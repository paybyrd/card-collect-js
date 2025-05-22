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
	pciFieldsBasePath,
	dccUrl,
	css,
	validateOnFrame = true,
	env = 'production'
}: CardCollectProps = {}): Promise<CardCollectResponse> => {
	if (version === 2) {
		return handleCardCollectV2({
			onCardCollectFrameLoaded,
			onFieldChange,
			onDCCData,
			pciFieldsBasePath,
			dccUrl,
			i18nMessages,
			displayErrors,
			css,
			validateOnFrame,
			env
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
