import { TokenizeIframe } from '@tokenex/tokenex-iframe';

import { CardCollectProps, CardCollectResponse } from '../types/types';

import { generateField } from '../utils/init';
import { validateFields, clearValidations, generateError } from '../utils/validations';
import { getIconFromBrandCode } from '../utils/utils';

import CreditCardPlaceholder from '../icons/CreditCardPlaceholder.svg';
import CreditCardPlaceholderCVV from '../icons/CreditCardPlaceholderCVV.svg';
import CreditCardPlaceholderExpDate from '../icons/CreditCardPlaceholderExpDate.svg';

const handleCardCollectV2 = ({
	onFieldChange = () => {},
	validateOnChange,
	displayHelpIcons,
	i18nMessages,
	displayErrors,
	timestamp = '',
	authenticationKey = '',
	tokenScheme = 'sixTOKENfour',
	tokenExID = '',
	origin = '',
	onTokenize,
	tokenExFieldsCss,
	onTokenexFrameLoaded,
	onTokenexFrameExpires
}: CardCollectProps = {}): CardCollectResponse => {
	let isTokenizedDataValid = false;
	let submitFieldsData = {};
	const cardNumberWrapper = document.getElementById('cc-number');
	const cvvWrapper = document.getElementById('cc-cvc');

	const defaultStyles = {
		base: `height: 40px; width: 100%; outline: none; box-sizing: border-box; padding: 0 10px; border-radius: 4px; background: transparent; border: 1px solid #ccc; ${tokenExFieldsCss?.base}`,
		focus: `outline: none; ${tokenExFieldsCss?.focus}`,
		error: `box-shadow: 0 0 6px 0 rgb(239, 83, 80);border: 1px solid rgb(239, 83, 80); ${tokenExFieldsCss?.error}`,
		placeholder: tokenExFieldsCss?.placeholder
	};
	const tokenExStyles = {
		...defaultStyles,
		cvv: defaultStyles
	};

	// TokenEx Integration
	TokenizeIframe.configure({
		auth: {
			origin,
			hmac: authenticationKey,
			timestamp,
			tokenExId: tokenExID,
			tokenScheme
		},
		// TODO - Tokenex - The environment should be configurable
		env: 'test',
		initialSettings: {
			// TODO - Tokenex - What should be the amount for timeout?
			expiresInSeconds: 1200,
			container: 'cc-number',
			cvvContainer: 'cc-cvc',
			pci: true,
			cvv: true,
			returnAutoCompleteValues: false,
			useExtendedBin: true
		},
		additionalSettings: {
			styles: tokenExStyles,
			enableAutoComplete: true,
			placeholder: cardNumberWrapper?.getAttribute('data-placeholder') || '',
			cvvPlaceholder: cvvWrapper?.getAttribute('data-placeholder') || '',
			enableValidateOnKeyUp: validateOnChange,
			enableValidateOnCvvKeyUp: validateOnChange,
			enablePrettyFormat: true,
			debug: true
		}
	});

	TokenizeIframe.load();

	TokenizeIframe.onEvent('load', (data = {}) => {
		if (onTokenexFrameLoaded) {
			onTokenexFrameLoaded(data.value);
		}
	});

	TokenizeIframe.onEvent('validate', ({ isCvvValid, isValid, validator }) => {
		if (!isCvvValid && (!!window.CVVFocused || !!window.globalValidation)) {
			generateError({
				field: document.getElementById('cc-cvc'),
				displayErrors,
				errorData: { message: i18nMessages?.requiredField || 'This field is required' }
			});
		} else if (validateOnChange) {
			clearValidations([cCVV]);
		}

		if (!isValid && (!!window.cardNumberFocused || !!window.globalValidation)) {
			generateError({
				field: document.getElementById('cc-number'),
				displayErrors,
				errorData:
					validator === 'format'
						? {
								message:
									i18nMessages?.invalidCardNumber ||
									'The card number must be valid'
								// eslint-disable-next-line no-mixed-spaces-and-tabs
						  }
						: { message: i18nMessages?.requiredField || 'This field is required' }
			});
		} else if (validateOnChange) {
			clearValidations([cNumber]);
		}

		if (!isCvvValid && !isValid) {
			isTokenizedDataValid = false;
		} else {
			isTokenizedDataValid = true;
		}

		window.globalValidation = false;
	});

	TokenizeIframe.onEvent('focus', () => {
		clearValidations([cNumber]);
		window.cardNumberFocused = true;
	});

	TokenizeIframe.onEvent('change', () => {
		window.cardNumberFocused = false;
	});

	TokenizeIframe.onEvent('cvvFocus', () => {
		clearValidations([cCVV]);
		window.CVVFocused = true;
	});

	TokenizeIframe.onEvent('cvvBlur', () => {
		window.CVVFocused = false;
	});

	TokenizeIframe.onEvent('cardTypeChange', (data) => {
		const wrapper = document.querySelector('#cc-number .form-field-addornment');

		if (wrapper && data && data.possibleCardType) {
			wrapper.innerHTML = getIconFromBrandCode(data.possibleCardType.toUpperCase());
		}
	});

	TokenizeIframe.onEvent('tokenize', (data) => {
		if (onTokenize) {
			onTokenize({ ...data, ...submitFieldsData });
		}
	});

	TokenizeIframe.onEvent('expired', (data) => {
		if (onTokenexFrameExpires) {
			onTokenexFrameExpires(data);
		}
	});

	const cHolder = document.getElementById('cc-holder');
	const cNumber = document.getElementById('cc-number');
	const cExpDate = document.getElementById('cc-expiration-date');
	const cCVV = document.getElementById('cc-cvc');
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
			inputAddornment: displayHelpIcons ? CreditCardPlaceholderCVV : undefined
		});
	}

	const submit = () => {
		window.globalValidation = true;
		TokenizeIframe.validate();

		clearValidations([cNumber, cCVV, cHolder, cExpDate]);

		const holderValue = cHolder?.getElementsByTagName('input')[0]?.value;
		let dateValue = cExpDate?.getElementsByTagName('input')[0]?.value.replace('/', '');

		if (dateValue && /^\d{3,4}$/.test(dateValue)) {
			const normalizedDate = dateValue.padStart(4, '0');
			dateValue = `${normalizedDate.slice(0, 2)}/${normalizedDate.slice(2)}`;
		}

		const { isValid, errors } = validateFields({
			holderValue,
			dateValue,
			i18nMessages
		});

		if (!isValid || !isTokenizedDataValid) {
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

		submitFieldsData = { dateValue, holderValue };
		TokenizeIframe.tokenize();

		return Promise.resolve({
			status: 202,
			data: {
				message:
					'Request sent for tokenization. Make sure you have onTokenize listener configured.'
			}
		});
	};

	return {
		cardCollect_submit: submit
	};
};

export default handleCardCollectV2;
