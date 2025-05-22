import { ENV } from '../types/types';

interface SubmitBody {
	number?: string;
	expiration?: string;
	cvv?: string;
	holder?: string;
}

interface FetchRequest {
	url: string;
	method: string;
	body: SubmitBody;
}

export const getTokensAPIURL = (env: ENV) => {
	return `https://token${env === 'stage' ? 'sandbox' : ''}.paybyrd.com`;
};

const handleFetch = ({ url, method, body }: FetchRequest) => {
	return fetch(url, {
		method,
		...(body && { body: JSON.stringify(body) })
	})
		.then((response) => response.json())
		.catch((err) => {
			console.error('Error:', err);
			return err;
		});
};

export const post = (url: string, body: SubmitBody) => {
	return handleFetch({
		url,
		method: 'POST',
		body
	});
};
