import { Routes } from '@angular/router';
import { createRoutes } from './helpers/createRoutes';
import { AppConfigModel } from './models/config.models';

export function getRoutes(config: AppConfigModel): Routes {
	const baseRoutes: Routes = [
		{
			path: '',
			redirectTo: 'introductie',
			pathMatch: 'full',
		},
		{
			path: 'introductie',
			loadComponent: () => import('./components/introductie/introductie.component').then((c) => c.IntroductieComponent),
		},
		{
			path: 'inboedel-en-onderhoud',
			loadComponent: () =>
				import('./components/inboedelonderhoud/inboedelonderhoud.component').then((c) => c.InboedelonderhoudComponent),
		},
		{
			path: 'auto',
			loadComponent: () => import('./components/auto/auto.component').then((c) => c.AutoComponent),
		},
		{
			path: 'resultaat',
			loadComponent: () => import('./components/resultaat/resultaat.component').then((c) => c.ResultaatComponent),
		},
		{
			path: 'test',
			loadComponent: () => import('./components/test/test.component').then((c) => c.TestComponent),
		},
		{
			path: '**',
			redirectTo: 'introductie',
			pathMatch: 'full',
		},
	];
	return createRoutes(config, baseRoutes);
}
