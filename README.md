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
import CardCollect from '@paybyrd/card-collect';
or;
import CardCollect from '@paybyrd/card-collect/dist/cardCollect-web.js';
```

on your project.

# Usage

## React.js

```js
import CardCollect from '@paybyrd/card-collect';

export default () => {
	const [cc, setCardCollect] = useState(null);

	const handleSubmit = () => {
		cc.cardCollect_submit()
			.then(({ status, data }) => console.log('Success:', status, data)) // Handle paybyrd's response here
			.catch((error) => console.log('Error:', error)); // Handle any errors here
	};

	const handleFieldChange = ({ fieldId, element, error, value, isValid }) => {
		console.log(fieldId, element, error, value, isValid);
	};

	useEffect(() => {
		const setup = async () => {
			if (!cc) {
				const cardCollect = await CardCollect({
					displayErrors: true, // Optional. It will display error messages automatically without any extra configurations
					onFieldChange: handleFieldChange, // Optional. It will retrieve an object with metadata to perform extra validations
					onCardCollectFrameLoaded: () => console.log('PCI fields loaded'), // Optional. Called once every secure iframe field finishes loading
					onCardBrandCodeChange: (brandCode) => console.log('Detected card brand', brandCode), // Optional. Called whenever the detected card brand changes (empty when no brand is resolved)
					css: '.input { color: black; }', // Optional. Custom CSS string injected into each PCI iframe to style the inputs
					validateOnFrame: true, // Optional [default true]. When true, validation errors are also rendered inside the iframe field
					i18nMessages: { // Optional [default null]. It will override the default validation messages and field placeholders so they can be translated to different languages
						requiredField: 'Validation message that overrides the default one',
						invalidCardNumber: 'Validation message that overrides the default one',
						invalidExpirationDate: 'Validation message that overrides the default one',
						expiredCard: 'Validation message that overrides the default one',
						invalidCVV: 'Validation message that overrides the default one',
						holderName: 'Card Holder',
						cardNumber: 'Card Number',
						expDate: 'MM/YY',
						cvv: 'CVV'
					}
				});
				setCardCollect(cardCollect);
			}
		};

		setup();

		return () => cc?.destroy?.(); // Optional. Removes the iframe message listeners when the component unmounts
	}, []);

	return (
		<div id="cardCollect">
			<div id="cc-holder" className="form-field" data-placeholder="Card Holder"></div>
			<div id="cc-number" className="form-field" data-placeholder="Card Number"></div>
			<div className="form-field-group">
				<div id="cc-expiration-date" className="form-field" data-placeholder="MM/YY"></div>
				<div id="cc-cvc" className="form-field" data-placeholder="CVV"></div>
			</div>
			<button className="form-button" onClick={handleSubmit}>
				Submit
			</button>
		</div>
	);
};
```

## Vue.js

```html
<script>
	import CardCollect from '@paybyrd/card-collect';
	export default {
		data: {
			cardCollect: () => {},
		}
		methods: {
			handleSubmit: () {
				cardCollect.cardCollect_submit()
					.then(({ status, data }) => console.log('Success:', status, data)) // Handle paybyrd's response here
					.catch((error) => console.log('Error:', error)); // Handle any errors here
			},
			handleFieldChange: ({ fieldId, element, error, value, isValid }) {
				console.log(fieldId, element, error, value, isValid);
			}
		},
		mounted() {
			const setup = async () => {
				this.cardCollect = await CardCollect({
					displayErrors: true, // Optional. It will display error messages automatically without any extra configurations
					onFieldChange: handleFieldChange, // Optional. It will retrieve an object with metadata to perform extra validations
					onCardCollectFrameLoaded: () => console.log('PCI fields loaded'), // Optional. Called once every secure iframe field finishes loading
					onCardBrandCodeChange: (brandCode) => console.log('Detected card brand', brandCode), // Optional. Called whenever the detected card brand changes (empty when no brand is resolved)
					css: '.input { color: black; }', // Optional. Custom CSS string injected into each PCI iframe to style the inputs
					validateOnFrame: true // Optional [default true]. When true, validation errors are also rendered inside the iframe field
				});
			};

			setup();
		},
		beforeUnmount() {
			this.cardCollect?.destroy?.(); // Optional. Removes the iframe message listeners when the component unmounts
		}
	};
</script>
<template>
	<div id="app">
		<div id="cardCollect">
			<div id="cc-holder" className="form-field" data-placeholder="Card Holder"></div>
			<div id="cc-number" className="form-field" data-placeholder="Card Number"></div>
			<div className="form-field-group">
				<div id="cc-expiration-date" className="form-field" data-placeholder="MM/YY"></div>
				<div id="cc-cvc" className="form-field" data-placeholder="CVV"></div>
			</div>
			<button class="form-button" id="submit-form">Submit</button>
		</div>
	</div>
</template>
```

## JS

Please use dist/cardCollect-web.js and include it in your html file

```html
<body>
	<div id="cardCollect">
		<div id="cc-holder" className="form-field" data-placeholder="Card Holder"></div>
		<div id="cc-number" className="form-field" data-placeholder="Card Number"></div>
		<div className="form-field-group">
			<div id="cc-expiration-date" className="form-field" data-placeholder="MM/YY"></div>
			<div id="cc-cvc" className="form-field" data-placeholder="CVV"></div>
		</div>
		<button class="form-button" id="submit-form">Submit</button>
	</div>

	<script src="cardCollect-web.js"></script>
	<script type="module">
		async function init() {
			// Handler setup
			const handleSubmit = () => {
				cardCollect_submit()
					.then(({ status, data }) => console.log('Success:', status, data)) // Handle paybyrd's response here
					.catch((error) => console.log('Error:', error)); // Handle any errors here
			};

			const handleFieldChange = ({ fieldId, element, error, value, isValid }) => {
				console.log(fieldId, element, error, value, isValid);
			};

			// Paybyrd card collect initialization
			const { cardCollect_submit, destroy } = await cardCollect({
				displayErrors: true, // Optional. It will display error messages automatically without any extra configurations
				onFieldChange: handleFieldChange, // Optional. It will retrieve an object with metadata to perform extra validations
				onCardCollectFrameLoaded: () => console.log('PCI fields loaded'), // Optional. Called once every secure iframe field finishes loading
				onCardBrandCodeChange: (brandCode) => console.log('Detected card brand', brandCode), // Optional. Called whenever the detected card brand changes (empty when no brand is resolved)
				css: '.input { color: black; }', // Optional. Custom CSS string injected into each PCI iframe to style the inputs
				validateOnFrame: true // Optional [default true]. When true, validation errors are also rendered inside the iframe field
			});
			// Call destroy() when tearing down the form to remove the iframe message listeners

			// Form setup
			document.getElementById('submit-form').onclick = handleSubmit;
		}

		init();
	</script>
</body>
```
