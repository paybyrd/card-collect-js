import cardCollect from './index';
import fetchMock from 'jest-fetch-mock';

describe('CardCollect - V1 (HTML inputs)', () => {
	let holderNameMock: HTMLElement;
	let cardNumberMock: HTMLElement;
	let expiryDateMock: HTMLElement;
	let cvvMock: HTMLElement;

	beforeAll(() => {
		fetchMock.enableMocks();
	});

	beforeEach(() => {
		document.body.innerHTML = '';

		fetchMock.resetMocks();
		fetchMock.doMock();
		jest.clearAllMocks();

		holderNameMock = document.createElement('div');
		cardNumberMock = document.createElement('div');
		expiryDateMock = document.createElement('div');
		cvvMock = document.createElement('div');

		jest.spyOn(document, 'getElementById').mockImplementation((id: string) => {
			switch (id) {
				case 'cc-holder':
					return holderNameMock;
				case 'cc-number':
					return cardNumberMock;
				case 'cc-expiration-date':
					return expiryDateMock;
				case 'cc-cvc':
					return cvvMock;
				default:
					return null;
			}
		});
	});

	it('should define the cardCollect function', () => {
		expect(cardCollect).toBeDefined();
	});

	it('should return submit function (v1)', async () => {
		const { cardCollect_submit } = await cardCollect({ version: 1 });
		expect(cardCollect_submit).toBeDefined();
	});

	it('should configure holder input (v1)', async () => {
		const appendSpy = jest.spyOn(holderNameMock, 'append');
		const classListSpy = jest.spyOn(holderNameMock.classList, 'add');

		await cardCollect({ version: 1 });

		expect(appendSpy).toHaveBeenCalledWith(expect.any(HTMLElement));
		expect(classListSpy).toHaveBeenCalledWith('form-field');
	});

	it('should configure card number input (v1)', async () => {
		const appendSpy = jest.spyOn(cardNumberMock, 'append');
		const classListSpy = jest.spyOn(cardNumberMock.classList, 'add');

		await cardCollect({ version: 1 });

		expect(appendSpy).toHaveBeenCalledWith(expect.any(HTMLElement));
		expect(classListSpy).toHaveBeenCalledWith('form-field');
	});

	it('should configure CVV input (v1)', async () => {
		const appendSpy = jest.spyOn(cvvMock, 'append');
		const classListSpy = jest.spyOn(cvvMock.classList, 'add');

		await cardCollect({ version: 1 });

		expect(appendSpy).toHaveBeenCalledWith(expect.any(HTMLElement));
		expect(classListSpy).toHaveBeenCalledWith('form-field');
	});

	it('should configure expiry date input (v1)', async () => {
		const appendSpy = jest.spyOn(expiryDateMock, 'append');
		const classListSpy = jest.spyOn(expiryDateMock.classList, 'add');

		await cardCollect({ version: 1 });

		expect(appendSpy).toHaveBeenCalledWith(expect.any(HTMLElement));
		expect(classListSpy).toHaveBeenCalledWith('form-field');
	});

	it('should fix expiry date format on submit (v1)', async () => {
		await cardCollect({ version: 1 });

		const holderInput = document.createElement('input');
		holderInput.value = 'Paybyrd';
		holderInput.id = 'cc-holder';
		holderNameMock.appendChild(holderInput);

		// E assim por diante nos outros:
		const cardNumberInput = document.createElement('input');
		cardNumberInput.value = '5555341244441115';
		cardNumberInput.id = 'cc-number';
		cardNumberMock.appendChild(cardNumberInput);

		const expiryDateInput = document.createElement('input');
		expiryDateInput.value = '130';
		expiryDateInput.id = 'cc-exp-date';
		expiryDateMock.appendChild(expiryDateInput);

		const cvvInput = document.createElement('input');
		cvvInput.value = '123';
		cvvInput.id = 'cc-cvv';
		cvvMock.appendChild(cvvInput);

		const { cardCollect_submit } = await cardCollect({ version: 1 });
		const response = await cardCollect_submit();

		expect(response.status).toBe(200);
		expect(response.data).toMatchObject({
			holderValue: 'Paybyrd',
			cardValue: '5555341244441115',
			dateValue: '01/30',
			cvvValue: '123'
		});
	});
});
