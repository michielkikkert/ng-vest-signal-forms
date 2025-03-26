import { Provider } from '@angular/core';
import { NibudAppConfigToken } from '../tokens';
import { AppConfigModel } from '../models/config.models';

export function provideNibudAppConfig(config: AppConfigModel): Provider[] {
	return [
		{
			provide: NibudAppConfigToken,
			useValue: config,
		},
	];
}
