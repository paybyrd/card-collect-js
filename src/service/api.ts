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

const handleFetch = ({ url, method, body }: FetchRequest) => {
	return fetch(url, {
		method,
		headers: {
			'x-functions-key': PAYBYRD_CODE_KEY
		},
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
