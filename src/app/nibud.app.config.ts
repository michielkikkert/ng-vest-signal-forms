import { AppConfigModel } from './models/config.models';

export const nibudAppConfig: AppConfigModel = {
	appId: 'bufferberekenaar',
	trackingId: '',
	partnerVersions: ['rabobank', 'ing'],
	steps: {
		introductie: {
			index: 0,
			label: 'Introductie',
			disabled: false,
		},
		inboedelonderhoud: {
			index: 1,
			label: 'Inboedel en onderhoud',
			controls: [
				{
					name: 'heeftPartner',
					label: 'Woon je samen met een partner?',
					fieldType: 'toggle',
					value: null as null | boolean,
				},
				{
					name: 'aantalKinderen',
					label: 'Hoeveel thuiswonende kinderen heb je?',
					fieldType: 'number',
					value: 0,
				},
				{
					name: 'soortWoning',
					label: 'Heb je een huurwoning of koopwoning?',
					fieldType: 'toggle',
					value: null as null | 'Koopwoning' | 'Huurwoning',
				},
				{
					name: 'wozWaarde',
					label: 'Wat is de WOZ-waarde van je woning?',
					fieldType: 'toggle',
					value: null as null | number,
				},
			],
		},
		auto: {
			index: 2,
			label: 'Auto',
			controls: [
				{
					name: 'heeftAuto',
					label: 'Heb je een eigen auto?',
					fieldType: 'toggle',
					value: null as null | boolean,
				},
				{
					name: 'Autos',
					label: 'Heb je een eigen auto?',
					formType: 'FormArray',
					value: [
						{
							NieuwWaarde: 12000,
							StatusAuto: 'Tweedehands',
							TypeAuto: null,
							Selectie: 1,
						},
					],
					controls: [
						{
							name: 'NieuwWaarde',
							label: '',
							value: null as null | string,
						},
						{
							name: 'StatusAuto',
							label: '',
							value: null as null | 'Tweedehands' | 'Nieuw',
						},
						{
							name: 'TypeAuto',
							label: '',
							value: null as null | string,
						},
						{
							name: 'Selectie',
							label: '',
							value: null as null | number,
						},
					],
				},
			],
		},
		resultaat: {
			index: 3,
			label: 'Resultaat',
			isResult: true,
		},
	} as const,
};
