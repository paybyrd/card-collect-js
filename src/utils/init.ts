import { InputChangeProps, GenerateFieldProps } from '../types/types';

import { regexOnlyNumbers } from './validations';

const handleKeyUp = (
	event: KeyboardEvent,
	{ validationType, maxLength, customHandleChange }: InputChangeProps
) => {
	const target = event.target as HTMLInputElement;
	let formattedValue = regexOnlyNumbers(target.value);

	switch (validationType) {
		case 'expirationDate': {
			const month = formattedValue.substr(0, 2);
			const year = formattedValue.substr(2, 2);

			if (year) {
				formattedValue = `${month}/${year}`;
			}

			target.value = formattedValue;
			break;
		}
		case 'cvv': {
			target.value = formattedValue.substr(0, maxLength);
			break;
		}
		case 'cardNumber': {
			const splitNumbers = (formattedValue || '').match(/.{1,4}/g);

			if (!splitNumbers) {
				if (customHandleChange) {
					customHandleChange(formattedValue.substr(0, maxLength));
				}

				target.value = formattedValue.substr(0, maxLength);
				break;
			}

			if (customHandleChange) {
				customHandleChange(splitNumbers.join(' ').substr(0, maxLength));
			}

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
	maxLength,
	validationType,
	customHandleChange,
	inputAddornment
}: GenerateFieldProps) => {
	const fieldInput = document.createElement('input');
	fieldInput.type = type;
	fieldInput.placeholder = wrapper.getAttribute('data-placeholder') || '';
	fieldInput.addEventListener('keyup', (event) =>
		handleKeyUp(event, {
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
