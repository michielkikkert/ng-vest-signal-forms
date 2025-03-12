import { create, test, enforce, only, warn, each, omitWhen } from 'vest';

export const suite = create((model: any = {}, field: string) => {
	// only(field);

	console.log({ model });

	test('firstName', 'Firstname is required', () => {
		enforce(model.firstName).isNotBlank();
	});

	test('firstName', 'Firstname should be longer than 2 chars', () => {
		enforce(model.firstName).longerThan(2);
	});

	test('children', 'Should have at least 1 child', () => {
		enforce(model.children).longerThan(0);
	});

	each(model.children, (field: any) => {
		console.log(field.age, field.name);
		test('name', 'Name is required', () => {
			enforce(field.name).isNotBlank();
		});

		test('age', 'Age is required', () => {
			console.log('age:', field.age);
			enforce(field.age).isNotBlank();
		});

		omitWhen(!field.age, () => {
			test('age', 'Minimum age is 6', () => {
				enforce(field.age).isNumber().greaterThan(5);
			});
		});
	});
});
