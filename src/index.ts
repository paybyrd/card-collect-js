import { CardCollectProps, CardCollectResponse, SubmitBody } from './types/types';

import { generateField } from './utils/init';
import { validateFields, clearValidations } from './utils/validations';
import { getBrandByCardNumber } from './utils/utils';

const CreditCardPlaceholder = require('./icons/CreditCardPlaceholder.svg') as string;
const CreditCardPlaceholderCVV = require('./icons/CreditCardPlaceholderCVV.svg') as string;
const CreditCardPlaceholderExpDate = require('./icons/CreditCardPlaceholderExpDate.svg') as string;

import './css/default.css';

export default async ({ displayErrors }: CardCollectProps = {}): Promise<CardCollectResponse> => {
	const cHolder = document.getElementById('cc-holder');
	const cNumber = document.getElementById('cc-number');
	const cExpDate = document.getElementById('cc-expiration-date');
	const cCVV = document.getElementById('cc-cvc');
	const allFields = [cHolder, cNumber, cExpDate, cCVV];

	// Generate fields in DOM
	if (cHolder) {
		generateField({ wrapper: cHolder, id: 'pb-cc-holder' });
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
					wrapper.innerHTML = getBrandByCardNumber((cardNumber || '').replace(/ /g, ''));
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
			inputAddornment: CreditCardPlaceholderExpDate
		});
	}
	if (cCVV) {
		generateField({
			wrapper: cCVV,
			maxLength: 4,
			type: 'tel',
			id: 'pb-cc-cvv',
			validationType: 'cvv',
			inputAddornment: CreditCardPlaceholderCVV
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
		const dateValue = cExpDate?.getElementsByTagName('input')[0]?.value;
		const cvvValue = cCVV?.getElementsByTagName('input')[0]?.value;

		const { isValid, errors } = validateFields({
			holderValue,
			cardValue,
			dateValue,
			cvvValue
		});

		if (!isValid) {
			Object.entries(errors).map((error) => {
				const field = document.getElementById(error[0]);
				const errorData = error[1]; // TODO Do we need to send back a message?

				if (field) {
					field.classList.add('form-error');

					if (displayErrors) {
						const wrapper = field.querySelector('.form-field-error');

						if (wrapper) {
							wrapper.innerHTML = errorData.message;
						}
					}
				}
			});

			return Promise.reject(errors);
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
