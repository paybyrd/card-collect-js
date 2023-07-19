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

	const handleFieldChange = ({ fieldId, element, error, isValid }) => {
		console.log(fieldId, element, error, isValid);
	};

	useEffect(() => {
		const setup = async () => {
			if (!cc) {
				const cardCollect = await CardCollect({
					displayErrors: true, // Optional. It will display error messages automatically without any extra configurations
					onFieldChange: handleFieldChange, // Optional. It will retrieve an object with metadata to perform extra validations
					validateOnChange: false // Optional. It will validate on change even before form submission
				});
				setCardCollect(cardCollect);
			}
		};

		setup();
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
			handleFieldChange: ({ fieldId, element, error, isValid }) {
				console.log(fieldId, element, error, isValid);
			}
		},
		mounted() {
			const setup = async () => {
				this.cardCollect = await CardCollect({
					displayErrors: true, // Optional. It will display error messages automatically without any extra configurations
					onFieldChange: handleFieldChange, // Optional. It will retrieve an object with metadata to perform extra validations
					validateOnChange: false, // Optional. It will validate on change even before form submission
				});
			};

			setup();
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

			const handleFieldChange = ({ fieldId, element, error, isValid }) => {
				console.log(fieldId, element, error, isValid);
			};

			// Paybyrd card collect initialization
			const { cardCollect_submit } = await cardCollect({
				displayErrors: true, // Optional. It will display error messages automatically without any extra configurations
				onFieldChange: handleFieldChange, // Optional. It will retrieve an object with metadata to perform extra validations
				validateOnChange: false // Optional. It will validate on change even before form submission
			});

			// Form setup
			document.getElementById('submit-form').onclick = handleSubmit;
		}

		init();
	</script>
</body>
```
