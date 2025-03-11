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
	onCardCollectFrameLoaded
}: CardCollectProps = {}): Promise<CardCollectResponse> => {
	if (version === 2) {
		return handleCardCollectV2({ onCardCollectFrameLoaded });
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
