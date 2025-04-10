import {
	CardCollectProps,
	CardCollectResponse,
	GenerateIFrameFieldProps,
	IFrameValuesPostMessageResponse
} from '../types/types';
import { validateFields, generateError } from '../utils/validations';

const PBI_FIELDS_BASE_PATH = 'https://ambitious-forest-051c39f03.6.azurestaticapps.net';

const handleCardCollectV2 = ({
	onCardCollectFrameLoaded,
	onFieldChange,
	validateOnFrame,
	i18nMessages,
	displayErrors,
	css
}: CardCollectProps = {}): CardCollectResponse => {
	const cHolder = document.getElementById('cc-holder');
	const cNumber = document.getElementById('cc-number');
	const cExpDate = document.getElementById('cc-expiration-date');
	const cCVV = document.getElementById('cc-cvc');

	const handleMessage = (event: MessageEvent) => {
		if (event.data.type === 'PB_PCI_FIELD_CHANGE') {
			onFieldChange?.(event.data);
		}
	};

	window.addEventListener('message', handleMessage);

	const destroy = () => {
		window.removeEventListener('message', handleMessage);
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
				{ type: 'PB_PCI_METADATA', data: { placeholder, css } },
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
			src: `${PBI_FIELDS_BASE_PATH}/pci-card-holder.html`,
			placeholder: i18nMessages?.holderName || 'Card Holder',
			wrapper: cHolder,
			css
		});
	}
	if (cNumber) {
		generateIFrameField({
			src: `${PBI_FIELDS_BASE_PATH}/pci-card-number.html`,
			placeholder: i18nMessages?.cardNumber || 'Card Number',
			wrapper: cNumber,
			css
		});
	}
	if (cExpDate) {
		generateIFrameField({
			src: `${PBI_FIELDS_BASE_PATH}/pci-card-exp-date.html`,
			placeholder: i18nMessages?.expDate || 'MM/YY',
			wrapper: cExpDate,
			css
		});
	}
	if (cCVV) {
		generateIFrameField({
			src: `${PBI_FIELDS_BASE_PATH}/pci-card-cvv.html`,
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
				iframe.contentWindow?.postMessage({ type: 'PB_PCI_GET_VALUES' }, '*');
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

	const submit = async () => {
		clearIFrameErrors();
		const { cardHolder, cardNumber, cvv, expDate } = await getIFrameValues();
		let normalizedExpDate = expDate;

		if (normalizedExpDate && /^\d{3,4}$/.test(normalizedExpDate)) {
			const formattedDate = normalizedExpDate.padStart(4, '0');
			normalizedExpDate = `${formattedDate.slice(0, 2)}/${formattedDate.slice(2)}`;
		}

		const { isValid, errors } = validateFields({
			holderValue: cardHolder,
			cardValue: cardNumber,
			dateValue: expDate,
			cvvValue: cvv,
			i18nMessages
		});

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

		// Returns all card data so it can be used by the client to finish the payment
		return Promise.resolve({
			status: 200,
			data: {
				holderValue: cardHolder || '',
				cardValue: cardNumber || '',
				dateValue: expDate || '',
				cvvValue: cvv || ''
			}
		});
	};

	return { cardCollect_submit: submit, destroy };
};

export default handleCardCollectV2;
