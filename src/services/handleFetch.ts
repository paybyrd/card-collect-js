import { FetchResponse, FetchProps } from '../types/types';

export const handleFetch = ({ url, body, method }: FetchProps) => {
	return fetch(url, {
		method: method || 'GET',
		headers: {
			'Content-Type': 'application/json',
			'x-functions-key': PAYBYRD_CODE_KEY
		},
		...(body && { body: JSON.stringify(body) })
	}).then((response) => {
		return response.json().then(
			(data) =>
				({
					status: response.status,
					data: data
				} as FetchResponse)
		);
	});
};
