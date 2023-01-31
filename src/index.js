//import { loadVGSCollect } from "@vgs/collect-js";

import "./css/default.css";

//let hasInit = false;

/* const checkLuhn = num => !(num
	.replace(/\D/g, '') //remove non-digits
	.split('') //make an array
	.reverse() //last digit first
	.map((e, i) => e * (i % 2 + 1)) //double every even element
	.join('') //instead of if(d > 9)
	.split('') // d -=9
	.reduce((e, t) => t - 0 + e, 0) //sum elements
	% 10); // 0 is falsy and !0 is truey */

const dateRegex = new RegExp(/\b(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})\b/);
const cvvRegex = new RegExp(/^[0-9]{3,4}$/);

export default async function cardCollect(/* { onStateChanged = null } = {} */) {
	/* let form = null; */
	let error = null;
	let cHolder = document.getElementById("cc-holder");
	let cNumber = document.getElementById("cc-number");
	let cDate = document.getElementById("cc-expiration-date");
	let cCVV = document.getElementById("cc-cvc");

	/*const fields = []; */

	/* if (!hasInit) {
		const collect = await loadVGSCollect({
			vaultId: VGS_VAULTID,
			environment: VGS_ENV,
			version: "2.15.0",
		}).catch((e) => (error = e));

		if (!collect) {
			throw new Error("Could not initialize");
		}

		form = collect
			.create(VGS_VAULTID, VGS_ENV, (state) => {
				if (onStateChanged) onStateChanged(state);
			})
			.useCname(VGS_CNAME);
	} */

	if(cHolder) {
		const cHolderInput = document.createElement("input");
		cHolderInput.type = "text";
		cHolderInput.placeholder = "Card Holder";
		cHolder.classList.add("form-field");
		cHolder.append(cHolderInput);
	}

	if(cNumber) {
		const cNumberInput = document.createElement("input");
		cNumberInput.type = "text";
		cNumberInput.placeholder = "Card Number";
		cNumber.classList.add("form-field");
		cNumber.append(cNumberInput);
	}

	if(cDate) {
		const cDateInput = document.createElement("input");
		cDateInput.type = "text";
		cDateInput.placeholder = "MM/YY";
		cDate.classList.add("form-field");
		cDate.append(cDateInput);
	}

	if(cCVV) {
		const cCVVInput = document.createElement("input");
		cCVVInput.type = "text";
		cCVVInput.placeholder = "CVV";
		cCVV.classList.add("form-field");
		cCVV.append(cCVVInput);
	}

	const field = (/* { id, ...options } */) => {
		/* if (!form) {
			throw new Error("You must initialize the form first");
		}

		if (!id) {
			throw new Error("You must pass a field id");
		}

		fields.push(form.field(id, { ...options })); */
	};

	const cardNumber = (/* options */) => {
		/* field({
			...options,
			type: "card-number",
			name: "card_number",
			validations: ["required", "validCardNumber"],
		}); */
	};

	const expirationDate = (/* options */) => {
		/* field({
			...options,
			type: "card-expiration-date",
			name: "card_exp",
			validations: ["required", "validCardExpirationDate"],
			serializers: [{ name: "replace", options: { old: " ", new: "" } }],
			yearLength: 2,
		}); */
	};

	const cvv = (/* options */) => {
		/* field({
			...options,
			type: "card-security-code",
			name: "card_cvv",
			validations: ["required", "validCardSecurityCode"],
		}); */
	};

	const holder = (/* options */) => {
		/* field({
			...options,
			type: "text",
			name: "card_holder",
			validations: ["required"],
		}); */
	};

	const mount = (/* callback */) => {
		/* return Promise.all(fields.map((field) => field.promise))
			.then(() => callback(true))
			.catch(() => callback(false)); */
	};

	const unmount = () => {
		/* if (!form) {
			throw new Error("You must initialize the form first");
		}

		form.unmount(); */
	};

	const submit = () => {
		/* if (!form) {
			throw new Error("You must initialize the form first");
		} */
		const holderValue = cHolder.getElementsByTagName("input")[0]?.value;
		const cardValue = cNumber.getElementsByTagName("input")[0]?.value;
		const dateValue = cDate.getElementsByTagName("input")[0]?.value;
		const cvvValue = cCVV.getElementsByTagName("input")[0]?.value;

		if(!holderValue || holderValue === "") {
			cHolder.classList.add("form-error");
			return;
		} else {
			cHolder.classList.remove("form-error");
		}

		if(!cardValue || cardValue === "" || cardValue.length < 16) {
			cNumber.classList.add("form-error");
			return;
		} else {
			cNumber.classList.remove("form-error");
		}

		if(!dateValue || dateValue === "" || !dateRegex.test(dateValue)) {
			cDate.classList.add("form-error");
			return;
		} else {
			cDate.classList.remove("form-error");
		}

		if(!cvvValue || cvvValue === "" || !cvvRegex.test(cvvValue)) {
			cCVV.classList.add("form-error");
			return;
		} else {
			cCVV.classList.remove("form-error");
		}

		return fetch(`https://${VGS_CNAME}/api/v1/tokens`, {
			method: 'POST',
			headers: {
				"x-functions-key": VGS_CODE_KEY,
			},
			body: JSON.stringify({
				number: cardValue,
				expiration: dateValue,
				cvv: cvvValue,
				holder: holderValue,
			}),
		}).then(response => response.json()).then(data => {
			return {
				status: "201",
				data,
			};
		});
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
