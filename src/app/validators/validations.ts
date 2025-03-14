import { create, test, enforce, group, only, skip, warn, each, omitWhen } from 'vest';

export const suite = create((model: any, field: string, groupName) => {
	only(field);

	// console.log(JSON.stringify(model));

	test('firstName', 'Firstname is required', () => {
		enforce(model.firstName).isNotBlank();
	});

	test('firstName', 'Firstname should be longer than 2 chars', () => {
		enforce(model.firstName).longerThan(2);
	});

	test('lastName', 'Lastname is required', () => {
		enforce(model.lastName).isNotBlank();
	});

	test('children', 'Should have at least 1 child', () => {
		enforce(model.children).isNotNullish().longerThan(0);
	});

	each(model.children, ({ name, age }, index) => {
		console.log({ name, age });
		test('name', `Name is required|name|[${index}]`, () => {
			enforce(name).isNotBlank();
		});

		test('age', `Age is required|age|[${index}]`, () => {
			enforce(age).isNotNullish();
		});

		omitWhen(!age, () => {
			test('age', 'Minimum age is 6', () => {
				enforce(age).isNumber().greaterThan(5);
			});
		});
	});
});
