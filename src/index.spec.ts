import cardCollect from './index';
import fetchMock from 'jest-fetch-mock';

describe('CardCollect', () => {
	let holderNameMock: HTMLElement;
	let cardNumberMock: HTMLElement;
	let expiryDateMock: HTMLElement;
	let cvvMock: HTMLElement;

	beforeAll(() => {
		fetchMock.enableMocks();
	});

	beforeEach(() => {
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

	it('cardCollect function should be defined', () => {
		expect(cardCollect).toBeDefined();
	});

	it('When call cardCollect function should return a submit function', async () => {
		const { cardCollect_submit } = await cardCollect({});

		expect(cardCollect_submit).toBeDefined();
	});

	it('When call cardCollect function should configure holder input', async () => {
		const appendSpy = jest.spyOn(holderNameMock, 'append');
		const classListSpy = jest.spyOn(holderNameMock.classList, 'add');

		await cardCollect({});

		expect(appendSpy).toHaveBeenCalledWith(expect.any(HTMLElement));
		expect(classListSpy).toHaveBeenCalledWith('form-field');
	});

	it('When call cardCollect function should configure card number input', async () => {
		const appendSpy = jest.spyOn(cardNumberMock, 'append');
		const classListSpy = jest.spyOn(cardNumberMock.classList, 'add');

		await cardCollect({});

		expect(appendSpy).toHaveBeenCalledWith(expect.any(HTMLElement));
		expect(classListSpy).toHaveBeenCalledWith('form-field');
	});

	it('When call cardCollect function should configure cvv input', async () => {
		const appendSpy = jest.spyOn(cvvMock, 'append');
		const classListSpy = jest.spyOn(cvvMock.classList, 'add');

		await cardCollect({});

		expect(appendSpy).toHaveBeenCalledWith(expect.any(HTMLElement));
		expect(classListSpy).toHaveBeenCalledWith('form-field');
	});

	it('When call cardCollect function should configure expiry date input', async () => {
		const appendSpy = jest.spyOn(expiryDateMock, 'append');
		const classListSpy = jest.spyOn(expiryDateMock.classList, 'add');

		await cardCollect({});

		expect(appendSpy).toHaveBeenCalledWith(expect.any(HTMLElement));
		expect(classListSpy).toHaveBeenCalledWith('form-field');
	});

	it('When call cardCollect submit should fix expiration date value', async () => {
		const { cardCollect_submit } = await cardCollect();

		const holder: HTMLInputElement = holderNameMock.getElementsByTagName(
			'input'
		)[0] as HTMLInputElement;
		holder.value = 'Paybyrd';
		const cardNumber: HTMLInputElement = cardNumberMock.getElementsByTagName(
			'input'
		)[0] as HTMLInputElement;
		cardNumber.value = '5555341244441115';
		const expiryDate: HTMLInputElement = expiryDateMock.getElementsByTagName(
			'input'
		)[0] as HTMLInputElement;
		expiryDate.value = '130';
		const cvv: HTMLInputElement = cvvMock.getElementsByTagName('input')[0] as HTMLInputElement;
		cvv.value = '123';

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
