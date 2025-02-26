import { CardCollectProps, CardCollectResponse } from './types/types';

import './css/default.css';

import handleCardCollectV1 from './handlers/handleCardCollectV1';

export default async ({
	displayErrors,
	onFieldChange = () => {},
	validateOnChange = true,
	displayHelpIcons,
	i18nMessages,
	onCardCollectFrameLoaded
}: CardCollectProps = {}): Promise<CardCollectResponse> => {
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
