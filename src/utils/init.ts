import { InputChangeProps, GenerateFieldProps } from '../types/types';

import { regexOnlyNumbers } from './validations';

const handleKeyUp = (
	event: InputEvent,
	{ validationType, maxLength, customHandleChange }: InputChangeProps
) => {
	const target = event.target as HTMLInputElement;
	const formattedValue = regexOnlyNumbers(target.value);

	switch (validationType) {
		case 'holderName': {
			customHandleChange(target.value);
			break;
		}
		case 'expirationDate': {
			const expDate = formattedValue
				.replace(
					/^([2-9])$/g,
					'0$1' // To handle 3 > 03
				)
				.replace(
					/^(1{1})([3-9]{1})$/g,
					'0$1/$2' // 13 > 01/3
				)
				.replace(
					/^0{1,}/g,
					'0' // To handle 00 > 0
				)
				.replace(
					/^([0-1]{1}[0-9]{1})([0-9]{1,2}).*/g,
					'$1/$2' // To handle 113 > 11/3
				);

			customHandleChange(expDate);
			target.value = expDate;
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
