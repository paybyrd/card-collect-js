# Card Collect 
Card Collect is a javascript library that allows your company to create credit card payments without the need to be PCI-compliant as you do not handle credit card-related data on your side.

We provide fully customizable secured fields for the cardholder to enter his information and translate it to a temporary token that can be used to consume any Paybyrd's API that requires credit card data. 

# Getting Started
To get started you just have to run
```
npm install @paybyrd/card-collect
```
or
```
yarn add @paybyrd/card-collect
```
and then
```js
import CardCollect from "@paybyrd/card-collect";
```
on your project.

# Usage

## React.js

```js
import CardCollect from "@paybyrd/card-collect";

export default () => {
	const [cc, setCardCollect] = useState(null);
	const [valid, setValid] = useState(false);

	const handleSubmit = () => {
		cc.cardCollect_submit()
			.then(({ status, data }) => console.log("Success:", status, data)) // Handle paybyrd's response here
			.catch((error) => console.log("Error:", error)); // Handle any errors here
	};

	const handleStateChanged = (state) => {
		let valid = true;
		for (const field in state) {
			if (!state[field].isValid) {
				valid = false;
				break;
			}
		}

		if (valid) {
			setValid(valid);
		}
	};

	useEffect(() => {
		const setup = async () => {
			if (!cc) {
				const cardCollect = await CardCollect({ onStateChanged: handleStateChanged });
				setCardCollect(cardCollect);

				cardCollect.cardCollect_holder({
					id: '#cc-holder',
					placeholder: 'Card holder',
				});

				cardCollect.cardCollect_card_number({
					id: '#cc-number',
					placeholder: 'Card number',
				});

				cardCollect.cardCollect_expiration_date({
					id: '#cc-expiration-date',
					placeholder: 'MM/YY',
				});

				cardCollect.cardCollect_cvv({
					id: '#cc-cvc',
					placeholder: 'CVV',
				});
			}
		}

		setup();
	}, []);

	return (
		<div id="cardCollect">
			<div id="cc-holder" className="form-field"></div>
			<div id="cc-number" className="form-field"></div>
			<div className="form-field-group">
				<div id="cc-expiration-date" className="form-field"></div>
				<div id="cc-cvc" className="form-field"></div>
			</div>
			<button className="form-button" onClick={handleSubmit} disabled={!valid}>Submit</button>
		</div>
	);
};
```
JS

```html
<body>
	<div id="cardCollect">
		<div id="cc-holder" class="myfield"></div>
		<div id="cc-number" class="form-field"></div>
		<div class="form-field-group">
			<div id="cc-expiration-date" class="form-field"></div>
			<div id="cc-cvc" class="form-field"></div>
		</div><button class="form-button" id="submit-form">Submit</button>
	</div>
	<script src="cardCollect.js"></script>
	<script>
		async function init() {
			// Handler setup
			const handleSubmit = () => {
				cardCollect_submit()
					.then(({ status, data }) => console.log("Success:", status, data)) // Handle paybyrd's response here
					.catch((error) => console.log("Error:", error)); // Handle any errors here
			};

			const handleStateChanged = (state) => {
				let valid = true;
				for (const field in state) {
					if (!state[field].isValid) {
						valid = false;
						break;
					}
				}

				if (valid) {
					const submit = document.getElementById("submit-form");
					submit.disabled = false;
				}
			};

			// Paybyrd card collect initialization
			const {
				cardCollect_field,
				cardCollect_error,
				cardCollect_submit,
				cardCollect_card_number,
				cardCollect_expiration_date,
				cardCollect_cvv,
				cardCollect_holder
			} = await window.CardCollect.cardCollect();

			// Form setup
			const submitButton = document.getElementById("submit-form");
			submitButton.onclick = handleSubmit;

			if (!cardCollect_error) {
				cardCollect_holder({
					id: '#cc-holder',
					placeholder: 'Card holder',
				});

				cardCollect_card_number({
					id: '#cc-number',
					placeholder: 'Card number',
				});

				cardCollect_expiration_date({
					id: '#cc-expiration-date',
					placeholder: 'MM/YY',
				});

				cardCollect_cvv({
					id: '#cc-cvc',
					placeholder: 'CVV',
				});
			}
		}

		init();
	</script>
</body>

```