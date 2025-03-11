import { InputChangeProps, GenerateFieldProps } from '../types/types';

import { regexOnlyNumbers } from './validations';

const handleKeyEvent = (
	event: KeyboardEvent,
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
			if (
				target.value.length === 2 &&
				(event.code === 'Backspace' || event.code === 'Delete')
			) {
				customHandleChange(target.value.substring(0, 1));
				target.value = target.value.substring(0, 1);
				break;
			}

			const expDate = target.value
				.replace(
					/^([1-9]\/|[2-9])$/g,
					'0$1/' // 3 > 03/
				)
				.replace(
					/^(0[1-9]|1[0-2])$/g,
					'$1/' // 11 > 11/
				)
				.replace(
					/^([0-1])([3-9])$/g,
					'0$1/$2' // 13 > 01/3
				)
				.replace(
					/^(0?[1-9]|1[0-2])([0-9]{2})$/g,
					'$1/$2' // 141 > 01/41
				)
				.replace(
					/^([0]+)\/|[0]+$/g,
					'0' // 0/ > 0 and 00 > 0
				)
				.replace(
					/[^\d/]|^[/]*$/g,
					'' // To allow only digits and `/`
				)
				.replace(
					/\/\//g,
					'/' // Prevent entering more than 1 `/`
				);

			customHandleChange(expDate.substring(0, maxLength));
			target.value = expDate.substring(0, maxLength);
			break;
		}
		case 'cvv': {
			target.value = formattedValue.substring(0, maxLength);
			customHandleChange(formattedValue.substring(0, maxLength));
			break;
		}
		case 'cardNumber': {
			const splitNumbers = (formattedValue || '').match(/.{1,4}/g);

			if (!splitNumbers) {
				customHandleChange(formattedValue.substring(0, maxLength));
				target.value = formattedValue.substring(0, maxLength);
				break;
			}

			customHandleChange(splitNumbers.join(' ').substring(0, maxLength));
			target.value = splitNumbers.join(' ').substring(0, maxLength);
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
	eventType,
	customHandleChange,
	inputAddornment
}: GenerateFieldProps) => {
	if (id) {
		if (document.getElementById(id)) return;

		const fieldInput = document.createElement('input');
		fieldInput.id = id;
		fieldInput.type = type;
		fieldInput.placeholder = wrapper.getAttribute('data-placeholder') || '';
		fieldInput.addEventListener(eventType || 'input', (event) =>
			handleKeyEvent(event as KeyboardEvent, {
				validationType,
				maxLength,
				customHandleChange: customHandleChange ? customHandleChange : () => {}
			})
		);

		if (maxLength) {
			fieldInput.max = String(maxLength);
		}

		wrapper.append(fieldInput);
	}

	const errorWrapper = document.createElement('span');
	errorWrapper.classList.add('form-field-error');

	wrapper.classList.add('form-field');
	wrapper.append(errorWrapper);

	if (inputAddornment) {
		const addornmentWrapper = document.createElement('div');

		addornmentWrapper.classList.add('form-field-addornment');
		addornmentWrapper.innerHTML = inputAddornment;
		wrapper.append(addornmentWrapper);
	}
};
