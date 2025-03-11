import {
	CardCollectProps,
	CardCollectResponse,
	GenerateIFrameFieldProps,
	IFrameValuesPostMessageResponse
} from '../types/types';
import { validateFields, generateError } from '../utils/validations';

const handleCardCollectV2 = ({
	onCardCollectFrameLoaded,
	i18nMessages,
	displayErrors
}: CardCollectProps = {}): CardCollectResponse => {
	const cHolder = document.getElementById('cc-holder');
	const cNumber = document.getElementById('cc-number');
	const cExpDate = document.getElementById('cc-expiration-date');
	const cCVV = document.getElementById('cc-cvc');

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
			src: 'pci-card-holder.html',
			placeholder: 'Card Holder',
			wrapper: cHolder,
			css: 'body: { background: red }'
		});
	}
	if (cNumber) {
		generateIFrameField({
			src: 'pci-card-number.html',
			placeholder: 'Card Number',
			wrapper: cNumber,
			css: 'body: { background: green }'
		});
	}
	if (cExpDate) {
		generateIFrameField({
			src: 'pci-card-exp-date.html',
			placeholder: 'MM/YY',
			wrapper: cExpDate,
			css: 'body: { background: yellow }'
		});
	}
	if (cCVV) {
		generateIFrameField({
			src: 'pci-card-cvv.html',
			placeholder: 'CVV',
			wrapper: cCVV,
			css: 'body: { background: green }'
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

	const generateIFrameErrors = (field: HTMLElement, errorData: Record<string, string>) => {
		field
			.querySelector('iframe')
			?.contentWindow?.postMessage({ type: 'PB_PCI_FIELD_ERROR', data: { errorData } }, '*');
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

					console.log(errorData);

					generateIFrameErrors(field, errorData);
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

	return { cardCollect_submit: submit };
};

export default handleCardCollectV2;
