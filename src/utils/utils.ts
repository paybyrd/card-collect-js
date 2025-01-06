import Amex from '../icons/AmexIcon.svg';
import ApplePay from '../icons/ApplePayIcon.svg';
import Discover from '../icons/DiscoverIcon.svg';
import Elo from '../icons/EloIcon.svg';
import Maestro from '../icons/MaestroIcon.svg';
import MasterCard from '../icons/MasterCardIcon.svg';
import CarteBancaire from '../icons/CarteBancaireIcon.svg';
import Dankort from '../icons/DankortIcon.svg';
import DinersClub from '../icons/DinersClubIcon.svg';
import JCB from '../icons/JCBIcon.svg';
import VPay from '../icons/VPayIcon.svg';
import Visa from '../icons/VisaIcon.svg';
import CreditCardPlaceholder from '../icons/CreditCardPlaceholder.svg';

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
		case 'UNKNOWN':
			return CreditCardPlaceholder;
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
