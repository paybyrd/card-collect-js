import { CardCollectProps, CardCollectResponse } from './types/types';

import './css/default.css';
import { handleFetch } from './services/handleFetch';

import handleCardCollectV1 from './handlers/handleCardCollectV1';
import handleCardCollectV2 from './handlers/handleCardCollectV2';

export default async ({
	displayErrors,
	onFieldChange = () => {},
	validateOnChange = true,
	displayHelpIcons,
	handleCardValuesOnSubmit,
	i18nMessages,
	version = 2,
	onTokenize = () => {},
	tokenExFieldsCss,
	onTokenexFrameLoaded,
	onTokenexFrameExpires
}: CardCollectProps = {}): Promise<CardCollectResponse> => {
	// Feature flag to enable manually using Tokenex form provider
	if (version === 2) {
		return handleFetch({
			url: `https://${PAYBYRD_TOKEN_URL}/api/v1/tokens/encryption-key`,
			method: 'POST',
			body: {}
		})
			.then((res) => {
				const [tokenExID, origin, timestamp, tokenScheme] = (res.data.content || '').split(
					'|'
				);
				const authenticationKey = res.data.value || '';

				return handleCardCollectV2({
					displayErrors,
					onFieldChange,
					validateOnChange,
					displayHelpIcons,
					handleCardValuesOnSubmit,
					i18nMessages,
					authenticationKey,
					timestamp,
					tokenScheme,
					origin,
					tokenExID,
					onTokenize,
					tokenExFieldsCss,
					onTokenexFrameLoaded,
					onTokenexFrameExpires
				});
			})
			.catch(() => {
				// Set frame loaded in case load fails
				// To avoid stuck loaders and load v1
				onTokenexFrameLoaded?.(true);

				// Handle default card collect using html template as fallback when error occurs
				return handleCardCollectV1({
					displayErrors,
					onFieldChange,
					validateOnChange,
					displayHelpIcons,
					handleCardValuesOnSubmit,
					i18nMessages
				});
			});
	}

	// Set frame loaded in case client is using version 1
	// To avoid stuck loaders
	onTokenexFrameLoaded?.(true);

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
