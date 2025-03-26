import { ApplicationConfig, inject, InjectionToken, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { getRoutes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { provideNibudAppConfig } from './helpers/provideNibudConfig';
import { nibudAppConfig } from './nibud.app.config';

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(getRoutes(nibudAppConfig)),
		provideClientHydration(withEventReplay()),
		provideNibudAppConfig(nibudAppConfig),
	],
};
