import { InputChangeProps, GenerateFieldProps } from '../types/types';

import { regexOnlyNumbers } from './validations';

const handleKeyUp = (
	event: InputEvent,
	{ validationType, maxLength, customHandleChange }: InputChangeProps
) => {
	const target = event.target as HTMLInputElement;
	let formattedValue = regexOnlyNumbers(target.value);

	switch (validationType) {
		case 'holderName': {
			customHandleChange(target.value);
			break;
		}
		case 'expirationDate': {
			let month = formattedValue.substr(0, 2);
			const year = formattedValue.substr(2, 2);

			if (month && event.data && !isNaN(Number(event.data))) {
				if (Number(event.data) < 10) {
					formattedValue = `0${month}`;
				}

				const normalizedMonth = `${month.substring(1)}${event.data}`;
				if (month.startsWith('0') && month.length === 2 && Number(normalizedMonth) <= 12) {
					customHandleChange(normalizedMonth);
					target.value = normalizedMonth;
					return;
				}
			}

			if (Number(month) > 12) {
				month = '12';
			}

			if (year) {
				formattedValue = `${month}/${year}`;
			}

			customHandleChange(formattedValue);
			target.value = formattedValue;
			break;
		}
		case 'cvv': {
			target.value = formattedValue.substr(0, maxLength);
			customHandleChange(formattedValue.substr(0, maxLength));
			break;
		}
		case 'cardNumber': {
			const splitNumbers = (formattedValue || '').match(/.{1,4}/g);

			if (!splitNumbers) {
				customHandleChange(formattedValue.substr(0, maxLength));

				target.value = formattedValue.substr(0, maxLength);
				break;
			}

			customHandleChange(splitNumbers.join(' ').substr(0, maxLength));

			target.value = splitNumbers.join(' ').substr(0, maxLength);
			break;
		}
		default: {
			break;
		}
	}
};

export const generateField = ({
	type = 'text',
	wrapper,
	id,
	maxLength,
	validationType,
	customHandleChange,
	inputAddornment
}: GenerateFieldProps) => {
	if (document.getElementById(id)) return;

	const fieldInput = document.createElement('input');
	fieldInput.id = id;
	fieldInput.type = type;
	fieldInput.placeholder = wrapper.getAttribute('data-placeholder') || '';
	fieldInput.addEventListener('input', (event) =>
		handleKeyUp(event as InputEvent, {
			validationType,
			maxLength,
			customHandleChange
		})
	);

	if (maxLength) {
		fieldInput.max = String(maxLength);
	}

	const errorWrapper = document.createElement('span');
	errorWrapper.classList.add('form-field-error');

	wrapper.classList.add('form-field');
	wrapper.append(fieldInput);
	wrapper.append(errorWrapper);

	if (inputAddornment) {
		const addornmentWrapper = document.createElement('div');

		addornmentWrapper.classList.add('form-field-addornment');
		addornmentWrapper.innerHTML = inputAddornment;
		wrapper.append(addornmentWrapper);
	}
};
