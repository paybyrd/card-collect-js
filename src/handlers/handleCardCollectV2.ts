import {
	CardCollectProps,
	CardCollectResponse,
	GenerateIFrameFieldProps,
	IFrameValuesPostMessageResponse
} from '../types/types';
import { validateFields, generateError } from '../utils/validations';

const handleCardCollectV2 = ({
	onCardCollectFrameLoaded,
	onFieldChange,
	onDCCData,
	pciFieldsBasePath,
	dccUrl,
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

		if (event.data.type === 'PB_PCI_DCC_DATA') {
			onDCCData?.(event.data);
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

	const submit = async () => {
		clearIFrameErrors();
		const fields = await getIFrameValues();
		let normalizedExpDate = fields['cc-expiration-date'];

		if (normalizedExpDate && /^\d{3,4}$/.test(normalizedExpDate)) {
			const formattedDate = normalizedExpDate.padStart(4, '0');
			normalizedExpDate = `${formattedDate.slice(0, 2)}/${formattedDate.slice(2)}`;
		}

		const { isValid, errors } = validateFields({
			holderValue: fields['cc-holder'],
			cardValue: fields['cc-number'],
			dateValue: fields['cc-expiration-date'],
			cvvValue: fields['cc-cvc'],
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
				holderValue: fields['cc-holder'] || '',
				cardValue: fields['cc-number'] || '',
				dateValue: fields['cc-expiration-date'] || '',
				cvvValue: fields['cc-cvc'] || ''
			}
		});
	};

	return { cardCollect_submit: submit, destroy };
};

export default handleCardCollectV2;
