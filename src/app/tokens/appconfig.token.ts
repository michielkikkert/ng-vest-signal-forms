import { InjectionToken } from '@angular/core';
import { nibudAppConfig } from '../nibud.app.config';

export const NibudAppConfigToken = new InjectionToken<typeof nibudAppConfig>(`Nibud App Config`);
