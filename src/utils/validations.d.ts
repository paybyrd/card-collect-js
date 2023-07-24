import { ValidateFieldsProps, ErrorData, GenerateErrorProps } from '../types/types';
export declare const regexOnlyNumbers: (value: string) => string;
export declare const validateFields: ({ holderValue, cardValue, dateValue, cvvValue }: ValidateFieldsProps) => {
    isValid: boolean;
    errors: Record<string, ErrorData>;
};
export declare const clearValidations: (fields: Array<HTMLElement | null>) => void[];
export declare const generateError: ({ field, displayErrors, errorData }: GenerateErrorProps) => void;
