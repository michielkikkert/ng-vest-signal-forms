import { create, test, enforce, group, only, skip, warn, each, omitWhen, skipWhen, include } from 'vest';
import 'vest/enforce/email';

export const suite = create((model: any, field: string, groupName, parent: string = '') => {
	only(field);

	console.log(field, groupName, JSON.stringify(model));

	// just a group test for later (need to check composition for multiple steps forms)
	group('inboedelonderhoud', () => {
		skip(groupName !== 'inboedelonderhoud' || groupName === 'root');

		test('heeftPartner', 'Partnervraag is verplicht', () => {
			enforce(model.heeftPartner).isNotBlank();
		});

		include('wozWaarde').when('woningGroup');
		include('soortWoning').when('woningGroup');

		test('soortWoning', 'Soort woning is verplicht', () => {
			enforce(model.woningGroup?.soortWoning).isNotBlank();
		});

		omitWhen(model.woningGroup?.soortWoning !== 'KoopWoning', () => {
			test('wozWaarde', 'Woz waarde is verplicht', () => {
				enforce(model.woningGroup?.wozWaarde).isNotBlank();
			});

			test('wozWaarde', 'Woz moet hoger zijn dan 1000 euro', () => {
				enforce(model.woningGroup?.wozWaarde).gt(1000);
			});
		});
	});

	group('auto', () => {
		skip(groupName !== 'auto' || groupName === 'root');

		test('Autos', '1 auto is verplicht', () => {
			enforce(model.Autos).longerThan(0);
		});

		omitWhen(!model.Autos?.length, () => {
			// Testingg controls in FormArray is a bit complex. We need to be able to uniquely identify these controls..
			// .. like [array parent] - [control name] - [index]
			model?.Autos &&
				each(model?.Autos, ({ NieuwWaarde, StatusAuto }, index) => {
					test(
						`Autos-NieuwWaarde-${index}`,
						`NieuwWaarde is required`,
						() => {
							enforce(NieuwWaarde).isNotBlank();
						},
						`Autos-NieuwWaarde-${index}`,
					);

					test(
						`Autos-StatusAuto-${index}`,
						`StatusAuto is required`,
						() => {
							enforce(StatusAuto).isNotBlank();
						},
						`Autos-StatusAuto-${index}`,
					);
				});
		});
	});

	group('test', () => {
		skip(groupName !== 'test');
		// Test some of the inputs

		test('firstName', 'firstName is required', () => {
			enforce(model.firstName).isNotBlank();
		});

		test('lastName', 'Lastname is required', () => {
			enforce(model.lastName).isNotBlank();
		});

		test('email', 'Email is required', () => {
			enforce(model.email).isNotBlank().longerThan(5);
		});

		omitWhen(!model.email, () => {
			test('email', 'Email should be valid', () => {
				enforce(model.email).isEmail();
			});
		});

		// Include subcontrols when passwordGroup is triggered
		include('password').when('passwordGroup');
		include('confirmPassword').when('passwordGroup');

		test('password', 'Password is required', () => {
			enforce(model.passwordGroup.password).isNotBlank();
		});

		test('confirmPassword', 'Passwords should match', () => {
			enforce(model.passwordGroup.password).isNotBlank().equals(model.passwordGroup.confirmPassword);
		});

		test('children', 'Should have at least 1 child', () => {
			enforce(model.children).isNotNullish().longerThan(0);
		});

		// Optimization with omitWhen
		omitWhen(!model.children?.length, () => {
			// Testingg controls in FormArray is a bit complex. We need to be able to uniquely identify these controls..
			// .. like [array parent] - [control name] - [index]
			model?.children &&
				each(model?.children, ({ age, name }, index) => {
					test(
						`children-name-${index}`,
						`Name is required`,
						() => {
							enforce(name).isNotBlank();
						},
						`children-name${index}`,
					);

					test(
						`children-age-${index}`,
						`Age is required`,
						() => {
							enforce(age).isNotNullish();
						},
						`children-age${index}`,
					);

					omitWhen(!age, () => {
						test(
							`children-age-${index}`,
							`Minimum age is 6`,
							() => {
								enforce(age).isNumber().greaterThan(5);
							},
							`children-age${index}`,
						);
					});
				});
		});
	});
});
