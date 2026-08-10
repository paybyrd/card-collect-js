import { getTokensAPIURL } from '../service/api';
import { post } from '../service/api';
import {
	CardCollectProps,
	CardCollectResponse,
	CardFieldId,
	CardFieldState,
	CardFormState,
	CardToken,
	FieldChangeEvent,
	GenerateIFrameFieldProps,
	IFrameValuesPostMessageResponse
} from '../types/types';
import { validateFields, generateError } from '../utils/validations';

const handleCardCollectV2 = ({
	onCardCollectFrameLoaded,
	onFieldChange,
	onDCCData,
	onCardBrandCodeChange,
	pciFieldsBasePath,
	dccUrl,
	validateOnFrame,
	i18nMessages,
	displayErrors,
	css,
	env = 'production',
	autoTokenize = false,
	autoTokenizeDebounceMs = 300,
	reuseTokenOnSubmit = false,
	onFormStateChange,
	onTokenChange
}: CardCollectProps = {}): CardCollectResponse => {
	const PAYBYRD_API_TOKEN_URL = getTokensAPIURL(env);

	const cHolder = document.getElementById('cc-holder');
	const cNumber = document.getElementById('cc-number');
	const cExpDate = document.getElementById('cc-expiration-date');
	const cCVV = document.getElementById('cc-cvc');

	const mountedFields = [
		cHolder ? 'cc-holder' : null,
		cNumber ? 'cc-number' : null,
		cExpDate ? 'cc-expiration-date' : null,
		cCVV ? 'cc-cvc' : null
	].filter(Boolean) as CardFieldId[];

	const fieldStates: Partial<Record<CardFieldId, CardFieldState>> = {};
	mountedFields.forEach((field) => {
		fieldStates[field] = { isEmpty: true, isValid: false, errorType: 'required' };
	});

	let tokenResponse: Record<string, string> | null = null;
	let isTokenStale = true;
	let tokenizeTimer: ReturnType<typeof setTimeout> | null = null;
	let tokenizeSequence = 0;

	const getFormState = (): CardFormState => ({
		fields: { ...fieldStates },
		isValid: mountedFields.every((field) => fieldStates[field]?.isValid === true)
	});

	// The CVV frame needs the brand to know how many digits Amex requires.
	const forwardCardBrand = (brand: string) => {
		cCVV?.querySelector('iframe')?.contentWindow?.postMessage({ type: 'PB_PCI_CARD_BRAND', brand }, '*');
	};

	function handleFieldChange(event: FieldChangeEvent) {
		if (!fieldStates[event.field]) return;

		const wasValid = getFormState().isValid;

		fieldStates[event.field] = {
			isEmpty: event.isEmpty,
			isValid: event.isValid,
			errorType: event.errorType
		};

		const formState = getFormState();
		onFormStateChange?.(formState);

		// Any edit supersedes a tokenization already in flight — otherwise a
		// response landing after the card went invalid would emit a stale token.
		tokenizeSequence++;
		isTokenStale = true;

		if (tokenResponse) {
			tokenResponse = null;
			onTokenChange?.(null);
		}

		if (!autoTokenize) return;

		if (tokenizeTimer) clearTimeout(tokenizeTimer);
		if (!formState.isValid) return;

		// Completing the form tokenizes with no delay, so a token is ready if the
		// shopper hits Pay right away. Editing an already valid form is debounced —
		// otherwise every keystroke in the holder name would hit /tokens.
		if (!wasValid) {
			tokenize();
		} else {
			tokenizeTimer = setTimeout(tokenize, autoTokenizeDebounceMs);
		}
	}

	const handleMessage = (event: MessageEvent) => {
		if (event.data.type === 'PB_PCI_FIELD_CHANGE') {
			onFieldChange?.(event.data);
			handleFieldChange(event.data);
		}

		if (event.data.type === 'PB_PCI_DCC_DATA') {
			onDCCData?.(event.data);
		}

		if (event.data.type === 'PB_PCI_CARD_BRAND') {
			onCardBrandCodeChange?.(event.data.brand);
			forwardCardBrand(event.data.brand);
		}
	};

	window.addEventListener('message', handleMessage);

	const destroy = () => {
		window.removeEventListener('message', handleMessage);
		if (tokenizeTimer) clearTimeout(tokenizeTimer);
	};

	const fieldsToLoad = [
		cHolder ? 'cHolder' : null,
		cNumber ? 'cNumber' : null,
		cExpDate ? 'cExpDate' : null,
		cCVV ? 'cCVV' : null
	].filter(Boolean).length;

	let loadedFields = 0;

	const generateIFrameField = ({
		src,
		placeholder,
		wrapper,
		id,
		css
	}: GenerateIFrameFieldProps) => {
		const iframeField = document.createElement('iframe');
		iframeField.src = src;
		iframeField.id = id || '';
		iframeField.classList.add('pb-secure-field');
		iframeField.style.border = '0';
		iframeField.style.width = '100%';
		iframeField.style.height = '100%';

		wrapper.append(iframeField);

		iframeField.onload = () => {
			loadedFields++;

			iframeField.contentWindow?.postMessage(
				{ type: 'PB_PCI_METADATA', data: { placeholder, css, dccUrl } },
				'*'
			);

			if (loadedFields === fieldsToLoad) {
				onCardCollectFrameLoaded?.();
			}
		};
	};

	// Generate fields in DOM
	if (cHolder) {
		generateIFrameField({
			id: 'cc-holder',
			src: `${pciFieldsBasePath}/pci-card-holder.html`,
			placeholder: i18nMessages?.holderName || 'Card Holder',
			wrapper: cHolder,
			css
		});
	}
	if (cNumber) {
		generateIFrameField({
			id: 'cc-number',
			src: `${pciFieldsBasePath}/pci-card-number.html`,
			placeholder: i18nMessages?.cardNumber || 'Card Number',
			wrapper: cNumber,
			css
		});
	}
	if (cExpDate) {
		generateIFrameField({
			id: 'cc-expiration-date',
			src: `${pciFieldsBasePath}/pci-card-exp-date.html`,
			placeholder: i18nMessages?.expDate || 'MM/YY',
			wrapper: cExpDate,
			css
		});
	}
	if (cCVV) {
		generateIFrameField({
			id: 'cc-cvc',
			src: `${pciFieldsBasePath}/pci-card-cvv.html`,
			placeholder: i18nMessages?.cvv || 'CVV',
			wrapper: cCVV,
			css
		});
	}

	const getIFrameValues = async (): Promise<IFrameValuesPostMessageResponse> => {
		const iframes = document.querySelectorAll('.pb-secure-field');
		const fieldData = {} as IFrameValuesPostMessageResponse;

		// Get All Values from each iFrame field before sending to Paybyrd's Payments API
		async function getFieldData(iframe: HTMLIFrameElement) {
			return new Promise((resolve) => {
				const messageListener = (event: MessageEvent) => {
					if (event.data.type === 'PB_PCI_FIELD_VALUE') {
						window.removeEventListener('message', messageListener);
						resolve({ [event.data.field as string]: event.data.value });
					}
				};

				window.addEventListener('message', messageListener);
				iframe.contentWindow?.postMessage(
					{ type: 'PB_PCI_GET_VALUES', data: { id: iframe.id } },
					'*'
				);
			});
		}

		for (const iframe of Array.from(iframes)) {
			Object.assign(fieldData, await getFieldData(iframe as HTMLIFrameElement));
		}

		return fieldData;
	};

	const clearIFrameErrors = () => {
		const iframes = document.querySelectorAll('.pb-secure-field');

		for (const iframe of Array.from(iframes)) {
			(iframe as HTMLIFrameElement).contentWindow?.postMessage(
				{ type: 'PB_PCI_CLEAR_ERROR' },
				'*'
			);
		}
	};

	const generateIFrameErrors = (
		field: HTMLElement,
		errorData: Record<string, string>,
		validateOnFrame?: boolean
	) => {
		field
			.querySelector('iframe')
			?.contentWindow?.postMessage(
				{ type: 'PB_PCI_FIELD_ERROR', data: { errorData, validateOnFrame } },
				'*'
			);
	};

	const readAndValidate = async () => {
		const fields = await getIFrameValues();
		let normalizedExpDate = fields['cc-expiration-date'];

		if (normalizedExpDate && /^\d{3,4}$/.test(normalizedExpDate)) {
			const formattedDate = normalizedExpDate.padStart(4, '0');
			normalizedExpDate = `${formattedDate.slice(0, 2)}/${formattedDate.slice(2)}`;
		}

		const { isValid, errors } = validateFields({
			holderValue: fields['cc-holder'],
			cardValue: fields['cc-number'],
			dateValue: normalizedExpDate,
			cvvValue: fields['cc-cvc'],
			i18nMessages
		});

		return { fields, isValid, errors };
	};

	const postToken = (fields: IFrameValuesPostMessageResponse) =>
		post(`${PAYBYRD_API_TOKEN_URL}/api/v1/tokens`, {
			holder: fields['cc-holder'] || '',
			number: fields['cc-number'] ? fields['cc-number'].replace(/ /g, '') : '',
			expiration: fields['cc-expiration-date'] || '',
			cvv: fields['cc-cvc'] || ''
		});

	// Silent counterpart of `submit`: same validation, no error rendering. A
	// superseded request is discarded so the newest card always wins.
	async function tokenize() {
		const sequence = tokenizeSequence;

		try {
			const { fields, isValid } = await readAndValidate();

			if (!isValid) return;

			const response = await postToken(fields);

			if (sequence !== tokenizeSequence || !response?.tokenId) return;

			tokenResponse = response;
			isTokenStale = false;

			onTokenChange?.({
				tokenId: response.tokenId,
				cardTokenIds: (response.cardTokenIds as unknown as string[]) || [],
				correlationId: response.correlationId || ''
			} as CardToken);
		} catch {
			// Stays stale: the next change, or the submit, tries again.
		}
	}

	const submit = async () => {
		clearIFrameErrors();
		const { fields, isValid, errors } = await readAndValidate();

		if (!isValid) {
			Object.entries(errors).map((error) => {
				const field = document.getElementById(error[0]);
				const errorData = error[1];

				if (field) {
					generateError({
						field,
						displayErrors,
						errorData
					});

					generateIFrameErrors(field, errorData, validateOnFrame);
				}
			});

			return Promise.reject(errors);
		}

		if (reuseTokenOnSubmit && !isTokenStale && tokenResponse) {
			return { status: 200, data: tokenResponse };
		}

		// Returns tokenized card data to fetch /payment
		return postToken(fields).then((response) => {
			return {
				status: 200,
				data: response
			};
		});
	};

	return { cardCollect_submit: submit, destroy };
};

export default handleCardCollectV2;
