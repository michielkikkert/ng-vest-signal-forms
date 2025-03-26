import { Routes } from '@angular/router';
import { AppConfigModel } from '../models/config.models';

export function createRoutes(config: AppConfigModel, baseRoutes: Routes): Routes {
	const partnerRoutes: Routes = [];

	config.partnerVersions.forEach((partner) => {
		partnerRoutes.push(
			...baseRoutes.map((baseRoute) => {
				if (baseRoute.path === '') {
					return {
						...baseRoute,
						path: partner,
						redirectTo: `${partner}/${baseRoute.redirectTo}`,
					};
				}

				if (baseRoute.path === '**') {
					return {
						...baseRoute,
						path: `${partner}/${baseRoute.path}`,
						redirectTo: `/${partner}/${baseRoute.redirectTo}`,
					};
				}

				return {
					...baseRoute,
					path: `${partner}/${baseRoute.path}`,
				};
			}),
		);
	});

	return [...partnerRoutes, ...baseRoutes];
}
