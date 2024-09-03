import { CardCollectProps, CardCollectResponse } from './types/types';

import './css/default.css';
import handleCardCollectV1 from './handlers/handleCardCollectV1';

export default async ({
	displayErrors,
	onFieldChange = () => {},
	validateOnChange,
	displayHelpIcons,
	handleCardValuesOnSubmit,
	i18nMessages,
	version = 1
}: CardCollectProps = {}): Promise<CardCollectResponse> => {
	if (version === 2) {
		// Handle Tokenex iframe
	}

	// Handle default card collect using html template
	return handleCardCollectV1({
		displayErrors,
		onFieldChange,
		validateOnChange,
		displayHelpIcons,
		handleCardValuesOnSubmit,
		i18nMessages
	});
};
