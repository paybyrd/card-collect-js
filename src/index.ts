import { CardCollectProps, CardCollectResponse } from './types/types';

import './css/default.css';

import handleCardCollectV1 from './handlers/handleCardCollectV1';
import handleCardCollectV2 from './handlers/handleCardCollectV2';

export default async ({
	displayErrors,
	onFieldChange = () => {},
	validateOnChange = true,
	displayHelpIcons,
	i18nMessages,
	version = 2,
	onCardCollectFrameLoaded,
	onDCCData,
	onCardBrandCodeChange,
	pciFieldsBasePath = 'https://pci-components.paybyrd.com',
	dccUrl,
	css,
	validateOnFrame = true,
	env = 'production',
	autoTokenize,
	autoTokenizeDebounceMs,
	reuseTokenOnSubmit,
	onFormStateChange,
	onTokenChange
}: CardCollectProps = {}): Promise<CardCollectResponse> => {
	if (version === 2) {
		return handleCardCollectV2({
			onCardCollectFrameLoaded,
			onFieldChange,
			onDCCData,
			onCardBrandCodeChange,
			pciFieldsBasePath,
			dccUrl,
			i18nMessages,
			displayErrors,
			css,
			validateOnFrame,
			env,
			autoTokenize,
			autoTokenizeDebounceMs,
			reuseTokenOnSubmit,
			onFormStateChange,
			onTokenChange
		});
	}

	// Handle default card collect using html template
	return handleCardCollectV1({
		displayErrors,
		onFieldChange,
		validateOnChange,
		displayHelpIcons,
		i18nMessages,
		onCardCollectFrameLoaded
	});
};
