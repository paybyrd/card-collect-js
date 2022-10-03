import { loadVGSCollect } from "@vgs/collect-js";

import "./css/default.css";

let hasInit = false;

export default async function cardCollect({ onStateChanged = null } = {}) {
	let form = null;
	let error = null;
	const fields = [];

	if (!hasInit) {
		const collect = await loadVGSCollect({
			vaultId: VGS_VAULTID,
			environment: VGS_ENV,
			version: "2.15.0",
		}).catch(e => error = e);

		if (!collect) {
			throw new Error("Could not initialize");
		}

		form = collect.create(VGS_VAULTID, VGS_ENV, (state) => { if (onStateChanged) onStateChanged(state) }).useCname(VGS_CNAME);
	}

	const field = ({ id, ...options }) => {
		if (!form) {
			throw new Error("You must initialize the form first");
		}

		if (!id) {
			throw new Error("You must pass a field id");
		}

		fields.push(form.field(id, { ...options }));
	};

	const cardNumber = (options) => {
		field({
			...options,
			type: 'card-number',
			name: 'card_number',
			validations: ['required', 'validCardNumber'],
		});
	};

	const expirationDate = (options) => {
		field({
			...options,
			type: 'card-expiration-date',
			name: 'card_exp',
			validations: ['required', 'validCardExpirationDate'],
			serializers: [{ name: 'replace', options: { old: ' ', new: '' } }],
			yearLength: 2,
		});
	};

	const cvv = (options) => {
		field({
			...options,
			type: 'card-security-code',
			name: 'card_cvv',
			validations: ['required', 'validCardSecurityCode'],
		});
	};

	const holder = (options) => {
		field({
			...options,
			type: 'text',
			name: 'card_holder',
			validations: ['required'],
		});
	};

	const mount = (callback) => {
		return Promise.all(fields.map(field => field.promise)).then(() => callback(true)).catch(() => callback(false));
	};

	const unmount = () => {
		if (!form) {
			throw new Error("You must initialize the form first");
		}

		form.unmount();
	};

	const submit = (/*additionalData*/) => {
		if (!form) {
			throw new Error("You must initialize the form first");
		}

		return new Promise((resolve, reject) => form.submit(
			`api/v1/tokens`,
			{
				data: (formValues) => {
					//let additionalFields = {};
					let payload = null;

					/* if (additionalData) {
						if (typeof additionalData === "function") {
							const tempAdditionalFields = additionalData();
							if (typeof tempAdditionalFields === "object") {
								additionalFields = tempAdditionalFields;
							}
						} else if (typeof additionalData === "object") {
							additionalFields = additionalData;
						}
					} */

					payload = {
						//...additionalFields,
						number: formValues['card_number'],
						expiration: formValues['card_exp'],
						cvv: formValues['card_cvv'],
						holder: formValues['card_holder'],
					};

					if (!formValues['card_number']) {
						throw new Error('You have to provide a card number');
					}

					if (!formValues['card_exp']) {
						throw new Error('You have to provide a card expiration date');
					}

					return payload;
				},
				headers: {
					'x-functions-key': VGS_CODE_KEY
				}
			},
			(status, data) => {
				if (status === 201) {
					resolve({ status, data })
				} else {
					reject({ status, data });
				}
			},
			reject,
		));
	};

	return {
		cardCollect_field: field,
		cardCollect_card_number: cardNumber,
		cardCollect_expiration_date: expirationDate,
		cardCollect_cvv: cvv,
		cardCollect_holder: holder,
		cardCollect_mount: mount,
		cardCollect_unmount: unmount,
		cardCollect_submit: submit,
		cardCollect_error: error,
	};
}