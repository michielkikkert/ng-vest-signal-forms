import { create, test, enforce, group, only, skip, warn, each, omitWhen, skipWhen, include } from 'vest';

enforce.extend({
	isChildValid: (value) => {
		const context = enforce.context();

		console.log({ context });

		return true;
	},
});

export const suite = create((model: any, field: string, groupName) => {
	only(field);

	console.log(field);
	//
	// console.log(JSON.stringify(model));

	// skip(!suite.isTested('firstName'));

	group('bla', () => {
		skip(groupName !== 'bla');
		test('firstName', 'Firstname is required', () => {
			enforce(model.firstName).isNotBlank();
		});

		test('firstName', 'Firstname should be longer than 2 chars', () => {
			enforce(model.firstName).longerThan(2);
		});
	});

	test('lastName', 'Lastname is required', () => {
		enforce(model.lastName).isNotBlank();
	});

	test('password', 'Password is required', () => {
		enforce(model.password).isNotBlank();
	});

	omitWhen(!model.password || !model.confirmPassword, () => {
		test('confirmPassword', 'Passwords should match', () => {
			enforce(model.password).equals(model.confirmPassword);
		});
	});

	test('children', 'Should have at least 1 child', () => {
		enforce(model.children).isNotNullish().longerThan(0);
	});

	// omitWhen(!model.children.length, () => {
	each(model.children, ({ age, name }, index) => {
		test(
			`name-${index}`,
			`Name is required`,
			() => {
				enforce(name).isNotBlank();
			},
			`name${index}`,
		);

		test(
			`age-${index}`,
			`Age is required`,
			() => {
				enforce(age).isNotNullish();
			},
			`age${index}`,
		);
		//
		omitWhen(!age, () => {
			test(
				`age-${index}`,
				`Minimum age is 6`,
				() => {
					enforce(age).isNumber().greaterThan(5);
				},
				`age${index}`,
			);
		});
	});
	// });
});
