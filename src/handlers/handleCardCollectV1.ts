import { CardCollectProps, CardCollectResponse, SubmitBody } from '../types/types';

import { generateField } from '../utils/init';
import { validateFields, clearValidations, generateError } from '../utils/validations';
import { getBrandByCardNumber } from '../utils/utils';

import CreditCardPlaceholder from '../icons/CreditCardPlaceholder.svg';
import CreditCardPlaceholderCVV from '../icons/CreditCardPlaceholderCVV.svg';
import CreditCardPlaceholderExpDate from '../icons/CreditCardPlaceholderExpDate.svg';

const handleCardCollectV1 = ({
	displayErrors,
	onFieldChange = () => {},
	validateOnChange,
	displayHelpIcons,
	handleCardValuesOnSubmit,
	i18nMessages
}: CardCollectProps = {}): CardCollectResponse => {
	const cHolder = document.getElementById('cc-holder');
	const cNumber = document.getElementById('cc-number');
	const cExpDate = document.getElementById('cc-expiration-date');
	const cCVV = document.getElementById('cc-cvc');
	const allFields = [cHolder, cNumber, cExpDate, cCVV];
	let isDirty = false;

	// Generate fields in DOM
	if (cHolder) {
		generateField({
			wrapper: cHolder,
			id: 'pb-cc-holder',
			validationType: 'holderName',
			customHandleChange: (holderName: string) => {
				const { isValid, errors } = validateFields({
					holderValue: holderName,
					i18nMessages
				});

				onFieldChange({
					fieldId: 'pb-cc-holder',
					element: cHolder,
					error: errors['cc-holder'],
					value: holderName,
					isValid
				});

				if (validateOnChange || isDirty) {
					clearValidations([cHolder]);

					if (!isValid) {
						generateError({
							field: cHolder,
							displayErrors,
							errorData: errors['cc-holder']
						});
					}
				}
			}
		});
	}
	if (cNumber) {
		generateField({
			wrapper: cNumber,
			maxLength: 22,
			type: 'tel',
			id: 'pb-cc-number',
			validationType: 'cardNumber',
			customHandleChange: (cardNumber: string) => {
				const wrapper = cNumber && cNumber.querySelector('.form-field-addornment');

				if (wrapper) {
					wrapper.innerHTML = getBrandByCardNumber(
						(cardNumber || '').replace(/\s+/g, '')
					);
				}

				const { isValid, errors } = validateFields({
					cardValue: cardNumber,
					i18nMessages
				});

				onFieldChange({
					fieldId: 'pb-cc-number',
					element: cNumber,
					error: errors['cc-number'],
					value: cardNumber,
					isValid
				});

				if (validateOnChange || isDirty) {
					clearValidations([cNumber]);

					if (!isValid) {
						generateError({
							field: cNumber,
							displayErrors,
							errorData: errors['cc-number']
						});
					}
				}
			},
			inputAddornment: CreditCardPlaceholder
		});
	}
	if (cExpDate) {
		generateField({
			wrapper: cExpDate,
			maxLength: 5,
			type: 'tel',
			id: 'pb-cc-exp-date',
			validationType: 'expirationDate',
			eventType: 'keyup',
			customHandleChange: (expDate: string) => {
				const { isValid, errors } = validateFields({
					dateValue: expDate,
					i18nMessages
				});

				onFieldChange({
					fieldId: 'pb-cc-exp-date',
					element: cExpDate,
					error: errors['cc-expiration-date'],
					value: expDate,
					isValid
				});

				if (validateOnChange || isDirty) {
					clearValidations([cExpDate]);

					if (!isValid) {
						generateError({
							field: cExpDate,
							displayErrors,
							errorData: errors['cc-expiration-date']
						});
					}
				}
			},
			inputAddornment: displayHelpIcons ? CreditCardPlaceholderExpDate : undefined
		});
	}
	if (cCVV) {
		generateField({
			wrapper: cCVV,
			maxLength: 4,
			type: 'tel',
			id: 'pb-cc-cvv',
			validationType: 'cvv',
			customHandleChange: (cvv: string) => {
				const { isValid, errors } = validateFields({
					cvvValue: cvv,
					i18nMessages
				});

				onFieldChange({
					fieldId: 'pb-cc-cvv',
					element: cCVV,
					error: errors['cc-cvc'],
					value: cvv,
					isValid
				});

				if (validateOnChange || isDirty) {
					clearValidations([cCVV]);

					if (!isValid) {
						generateError({
							field: cCVV,
							displayErrors,
							errorData: errors['cc-cvc']
						});
					}
				}
			},
			inputAddornment: displayHelpIcons ? CreditCardPlaceholderCVV : undefined
		});
	}

	const handleFetch = (url: string, body: SubmitBody) => {
		return fetch(url, {
			method: 'POST',
			headers: {
				'x-functions-key': PAYBYRD_CODE_KEY
			},
			body: JSON.stringify(body)
		})
			.then((response) => response.json())
			.then((data) => {
				return {
					status: '201',
					data
				};
			});
	};

	const submit = () => {
		clearValidations(allFields);

		const holderValue = cHolder?.getElementsByTagName('input')[0]?.value;
		const cardValue = cNumber?.getElementsByTagName('input')[0]?.value.replace(/ /g, '');
		let dateValue = cExpDate?.getElementsByTagName('input')[0]?.value.replace('/', '');
		const cvvValue = cCVV?.getElementsByTagName('input')[0]?.value;

		if (dateValue && /^\d{3,4}$/.test(dateValue)) {
			const normalizedDate = dateValue.padStart(4, '0');
			dateValue = `${normalizedDate.slice(0, 2)}/${normalizedDate.slice(2)}`;
		}

		const { isValid, errors } = validateFields({
			holderValue,
			cardValue,
			dateValue,
			cvvValue,
			i18nMessages
		});

		if (!isValid) {
			isDirty = true;

			Object.entries(errors).map((error) => {
				const field = document.getElementById(error[0]);
				const errorData = error[1];

				if (field) {
					generateError({
						field,
						displayErrors,
						errorData
					});
				}
			});

			return Promise.reject(errors);
		}

		if (handleCardValuesOnSubmit) {
			return Promise.resolve({
				status: '200',
				data: {
					holderValue: holderValue || '',
					cardValue: cardValue || '',
					dateValue: dateValue || '',
					cvvValue: cvvValue || ''
				}
			});
		}

		return handleFetch(`https://${PAYBYRD_TOKEN_URL}/api/v1/tokens`, {
			number: cardValue,
			expiration: dateValue,
			cvv: cvvValue,
			holder: holderValue
		});
	};

	return { cardCollect_submit: submit };
};

export default handleCardCollectV1;
