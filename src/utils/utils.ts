const Amex = require('../icons/AmexIcon.svg') as string;
const ApplePay = require('../icons/ApplePayIcon.svg') as string;
const Discover = require('../icons/DiscoverIcon.svg') as string;
const Elo = require('../icons/EloIcon.svg') as string;
const Maestro = require('../icons/MaestroIcon.svg') as string;
const MasterCard = require('../icons/MasterCardIcon.svg') as string;
const CarteBancaire = require('../icons/CarteBancaireIcon.svg') as string;
const Dankort = require('../icons/DankortIcon.svg') as string;
const DinersClub = require('../icons/DinersClubIcon.svg') as string;
const JCB = require('../icons/JCBIcon.svg') as string;
const VPay = require('../icons/VPayIcon.svg') as string;
const Visa = require('../icons/VisaIcon.svg') as string;
const CreditCardPlaceholder = require('../icons/CreditCardPlaceholder.svg') as string;

export function getIconFromBrandCode(brandCode: string) {
	switch (brandCode) {
		case 'AMEX':
			return Amex;
		case 'APPLE':
			return ApplePay;
		case 'ELO':
			return Elo;
		case 'MASTER':
		case 'MASTERDEBIT':
		case 'MASTERCARD':
			return MasterCard;
		case 'VISAELECTRON':
		case 'VISADEBIT':
		case 'VISA':
			return Visa;
		case 'DISCOVER':
			return Discover;
		case 'MAESTRO':
			return Maestro;
		case 'CARTEBANCAIRE':
			return CarteBancaire;
		case 'DANKORT':
			return Dankort;
		case 'DINERS':
			return DinersClub;
		case 'JCB':
			return JCB;
		case 'VPAY':
			return VPay;
		default:
			return '';
	}
}

export const getBrandByCardNumber = (cardNumber: string) => {
	const amex = new RegExp('^3[47][0-9]{13}$');
	const visa = new RegExp('^4[0-9]{12}(?:[0-9]{3})?$');

	const mastercard = new RegExp('^5[1-5][0-9]{14}$');
	const mastercard2 = new RegExp('^2[2-7][0-9]{14}$');

	const disco1 = new RegExp('^6011[0-9]{12}[0-9]*$');
	const disco2 = new RegExp('^62[24568][0-9]{13}[0-9]*$');
	const disco3 = new RegExp('^6[45][0-9]{14}[0-9]*$');

	const diners = new RegExp('^3[0689][0-9]{12}[0-9]*$');
	const jcb = new RegExp('^35[0-9]{14}[0-9]*$');

	if (visa.test(cardNumber)) {
		return getIconFromBrandCode('VISA');
	}
	if (amex.test(cardNumber)) {
		return getIconFromBrandCode('AMEX');
	}
	if (mastercard.test(cardNumber) || mastercard2.test(cardNumber)) {
		return getIconFromBrandCode('MASTERCARD');
	}
	if (disco1.test(cardNumber) || disco2.test(cardNumber) || disco3.test(cardNumber)) {
		return getIconFromBrandCode('DISCOVER');
	}
	if (diners.test(cardNumber)) {
		return getIconFromBrandCode('DINERS');
	}
	if (jcb.test(cardNumber)) {
		return getIconFromBrandCode('JCB');
	}

	return CreditCardPlaceholder;
};
