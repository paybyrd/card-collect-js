import { ENV } from '../types/types';
interface SubmitBody {
    number?: string;
    expiration?: string;
    cvv?: string;
    holder?: string;
}
export declare const getTokensAPIURL: (env: ENV) => string;
export declare const post: (url: string, body: SubmitBody) => Promise<any>;
export {};
