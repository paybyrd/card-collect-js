import { ValidateFieldsProps, ErrorData } from '../types/types';
import { validateCreditCard } from './cardValidation';

export const regexOnlyNumbers = (value: string) => {
	return value.replace(/[^0-9]/g, '');
};

const dateRegex = new RegExp(/\b(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})\b/);
const cvvRegex = new RegExp(/^[0-9]{3,4}$/);

export const validateFields = ({
	holderValue,
	cardValue,
	dateValue,
	cvvValue
}: ValidateFieldsProps) => {
	const errors: Record<string, ErrorData> = {};

	// Card Holder Validations
	if (holderValue !== undefined) {
		if (!holderValue) {
			errors['cc-holder'] = { type: 'required', message: 'This field is required' };
		}
	}

	// Card Number Validations
	if (cardValue !== undefined) {
		const cardData = validateCreditCard(cardValue);

		if (!cardValue) {
			errors['cc-number'] = { type: 'required', message: 'This field is required' };
		} else if (cardValue.length < 14 || !cardData.success) {
			errors['cc-number'] = { type: 'invalidCard', message: 'The card number must be valid' };
		}
	}

	// Card Expiration Date Validations
	if (dateValue !== undefined) {
		if (!dateValue) {
			errors['cc-expiration-date'] = { type: 'required', message: 'This field is required' };
		} else if (!dateRegex.test(dateValue)) {
			errors['cc-expiration-date'] = {
				type: 'invalidDate',
				message: 'The expiration date must be valid'
			};
		}
	}

	// Card CVV Validations
	if (cvvValue !== undefined) {
		if (!cvvValue || cvvValue === '') {
			errors['cc-cvc'] = { type: 'required', message: 'This field is required' };
		} else if (!cvvRegex.test(cvvValue)) {
			errors['cc-cvc'] = { type: 'invalidCVV', message: 'The CVV must be valid' };
		}
	}

	return {
		isValid: Object.keys(errors).length === 0,
		errors
	};
};

export const clearValidations = (fields: Array<HTMLElement | null>) => {
	fields.map((field) => {
		if (!field) return;

		field.classList.remove('form-error');
	});
};
