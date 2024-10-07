type FieldChangeProps = {
	fieldId: string;
	element: HTMLElement;
	error: Record<string, string>;
	value: string;
	isValid: boolean;
};

type i18nMessagesTypes =
	| 'requiredField'
	| 'invalidCardNumber'
	| 'invalidExpirationDate'
	| 'invalidCVV';

export type CardCollectProps = {
	displayErrors?: boolean;
	onFieldChange?: ({ fieldId, element, error, value, isValid }: FieldChangeProps) => void;
	validateOnChange?: boolean;
	displayHelpIcons?: boolean;
	handleCardValuesOnSubmit?: boolean;
	i18nMessages?: Record<i18nMessagesTypes, string>;
	version?: number;
};

export type SubmitBody = {
	number?: string;
	expiration?: string;
	cvv?: string;
	holder?: string;
};

export type CardCollectResponse = {
	cardCollect_submit: () => Promise<{ status: string; data: Record<string, string> }>;
};

export type GenerateFieldProps = {
	type?: string;
	wrapper: HTMLElement;
	maxLength?: number;
	id: string;
	validationType?: string;
	customHandleChange: (value: string) => void;
	inputAddornment?: string;
	eventType?: 'keydown' | 'keyup' | 'input';
};

export type InputChangeProps = {
	validationType?: string;
	maxLength?: number;
	customHandleChange: (value: string) => void;
};

export type ValidateFieldsProps = {
	holderValue?: string;
	cardValue?: string;
	dateValue?: string;
	cvvValue?: string;
	i18nMessages?: Record<i18nMessagesTypes, string>;
};

export type ErrorData = {
	type: string;
	message: string;
};

export type GenerateErrorProps = {
	field: HTMLElement;
	displayErrors?: boolean;
	errorData: Record<string, string>;
};
