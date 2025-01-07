declare global {
	interface Window {
		cardNumberFocused: boolean;
		CVVFocused: boolean;
		globalValidation: boolean;
	}

	const PAYBYRD_CODE_KEY: string;
	const PAYBYRD_TOKEN_URL: string;
}

export {};
