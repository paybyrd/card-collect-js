import {
	CardCollectProps,
	CardCollectResponse,
	IFrameValuesPostMessageResponse
} from '../types/types';

import { generateIFrameField } from '../utils/init';

const handleCardCollectV2 = ({
	// displayErrors,
	onCardCollectFrameLoaded
}: // i18nMessages
CardCollectProps = {}): CardCollectResponse => {
	const cHolder = document.getElementById('cc-holder');
	const cNumber = document.getElementById('cc-number');
	const cExpDate = document.getElementById('cc-expiration-date');
	const cCVV = document.getElementById('cc-cvc');
	// const allFields = [cHolder, cNumber, cExpDate, cCVV];
	// let isDirty = false;

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

	const submit = async () => {
		const { cardHolder, cardNumber, cvv, expDate } = await getIFrameValues();
		let normalizedExpDate = expDate;

		if (normalizedExpDate && /^\d{3,4}$/.test(normalizedExpDate)) {
			const formattedDate = normalizedExpDate.padStart(4, '0');
			normalizedExpDate = `${formattedDate.slice(0, 2)}/${formattedDate.slice(2)}`;
		}

		// const { isValid, errors } = validateFields({
		// 	holderValue,
		// 	cardValue,
		// 	dateValue,
		// 	cvvValue,
		// 	i18nMessages
		// });

		// if (!isValid) {
		// 	isDirty = true;

		// 	Object.entries(errors).map((error) => {
		// 		const field = document.getElementById(error[0]);
		// 		const errorData = error[1];

		// 		if (field) {
		// 			generateError({
		// 				field,
		// 				displayErrors,
		// 				errorData
		// 			});
		// 		}
		// 	});

		// 	return Promise.reject(errors);
		// }

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

	onCardCollectFrameLoaded?.();

	return { cardCollect_submit: submit };
};

export default handleCardCollectV2;
