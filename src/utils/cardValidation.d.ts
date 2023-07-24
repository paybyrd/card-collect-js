type CardValidationResponse = {
    success: boolean;
    message?: string | null;
    type?: string | null;
};
export declare const validateCreditCard: (cardnumber: string) => CardValidationResponse;
export {};
