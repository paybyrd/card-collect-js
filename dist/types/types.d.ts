type FieldChangeProps = {
    fieldId: string;
    element: HTMLElement;
    error: Record<string, string>;
    value: string;
    isValid: boolean;
};
export type CardFieldId = 'cc-holder' | 'cc-number' | 'cc-expiration-date' | 'cc-cvc';
export type CardFieldState = {
    isEmpty: boolean;
    isValid: boolean;
    errorType: string | null;
};
export type FieldChangeEvent = CardFieldState & {
    type: string;
    field: CardFieldId;
};
export type CardFormState = {
    fields: Partial<Record<CardFieldId, CardFieldState>>;
    isValid: boolean;
};
export type CardToken = {
    tokenId: string;
    cardTokenIds: string[];
    correlationId: string;
};
type i18nMessagesTypes = 'requiredField' | 'invalidCardNumber' | 'invalidExpirationDate' | 'expiredCard' | 'invalidCVV' | 'holderName' | 'cvv' | 'expDate' | 'cardNumber';
export type ENV = 'stage' | 'production';
export type CardCollectProps = {
    displayErrors?: boolean;
    onFieldChange?: (data: FieldChangeProps | FieldChangeEvent) => void;
    validateOnChange?: boolean;
    displayHelpIcons?: boolean;
    i18nMessages?: Record<i18nMessagesTypes, string>;
    onCardCollectFrameLoaded?: () => void;
    onDCCData?: (dccData: unknown) => void;
    onCardBrandCodeChange?: (brandCode: string) => void;
    pciFieldsBasePath?: string;
    dccUrl?: string;
    version?: number;
    css?: string;
    validateOnFrame?: boolean;
    env?: ENV;
    autoTokenize?: boolean;
    autoTokenizeDebounceMs?: number;
    reuseTokenOnSubmit?: boolean;
    onFormStateChange?: (state: CardFormState) => void;
    onTokenChange?: (token: CardToken | null) => void;
};
export type IFrameValuesPostMessageResponse = {
    'cc-holder'?: string;
    'cc-number'?: string;
    'cc-expiration-date'?: string;
    'cc-cvc'?: string;
};
export type SubmitBody = {
    number?: string;
    expiration?: string;
    cvv?: string;
    holder?: string;
};
export type FetchProps = {
    url: string;
    body?: SubmitBody;
    method?: string;
};
export type FetchResponse = {
    status: number;
    data: Record<string, string>;
};
export type CardCollectResponse = {
    cardCollect_submit: () => Promise<FetchResponse>;
    destroy?: () => void;
};
export type GenerateFieldProps = {
    type?: string;
    wrapper: HTMLElement;
    maxLength?: number;
    id?: string;
    validationType?: string;
    customHandleChange?: (value: string) => void;
    inputAddornment?: string;
    eventType?: 'keydown' | 'keyup' | 'input';
};
export type GenerateIFrameFieldProps = {
    wrapper: HTMLElement;
    id?: string;
    src: string;
    placeholder?: string;
    css?: string;
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
    field?: HTMLElement | null;
    displayErrors?: boolean;
    errorData: Record<string, string>;
};
export {};
