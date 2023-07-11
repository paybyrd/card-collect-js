export type CardCollectProps = {
	displayErrors?: boolean;
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
	validationType?: string;
	customHandleChange?: (value: string) => void;
	inputAddornment?: string;
};

export type InputChangeProps = {
	validationType?: string;
	maxLength?: number;
	customHandleChange?: (value: string) => void;
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
