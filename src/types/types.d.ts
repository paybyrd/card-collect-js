type FieldChangeProps = {
	fieldId: string;
	element: HTMLElement;
	error: Record<string, string>;
	value: string;
	isValid: boolean;
};
type TokenizedDataProps = {
	cardType: string;
	cvvIncluded: boolean;
	firstSix: string;
	lastFour: string;
	referenceNumber: string;
	token: string;
	tokenHMAC: string;
};
export type CardCollectProps = {
	displayErrors?: boolean;
	onFieldChange?: ({ fieldId, element, error, value, isValid }: FieldChangeProps) => void;
	validateOnChange?: boolean;
	displayHelpIcons?: boolean;
	version?: number;
	onTokenize?: (data: TokenizedDataProps) => void;
	onTokenexFrameLoaded?: (isLoaded: boolean) => void;
	onTokenexFrameExpires?: (isExpired: boolean) => void;
};
export type SubmitBody = {
	number?: string;
	expiration?: string;
	cvv?: string;
	holder?: string;
};
export type FetchResponse = {
	status: number;
	data: Record<string, string>;
};

export type CardCollectResponse = {
	cardCollect_submit: () => Promise<FetchResponse>;
};
export type GenerateFieldProps = {
	type?: string;
	wrapper: HTMLElement;
	maxLength?: number;
	id: string;
	validationType?: string;
	customHandleChange: (value: string) => void;
	inputAddornment?: string;
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
export {};
