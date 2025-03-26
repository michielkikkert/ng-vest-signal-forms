import { inject, InjectionToken } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { nibudAppConfig } from '../nibud.app.config';

export const PartnerToken = new InjectionToken('Partner', {
	factory: () => {
		const doc = inject(DOCUMENT);
		const path = new URL(doc.location.href).pathname;
		const pathParts = path.substring(1).split('/');
		if (pathParts.length && pathParts.length < 2) {
			return null;
		} else {
			return nibudAppConfig.partnerVersions.includes(pathParts[0]) ? pathParts[0] : null;
		}
	},
});
