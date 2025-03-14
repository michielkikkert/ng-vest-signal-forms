import { Component, Signal } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { suite } from '../../validators/validations';

type FormConfigItem = {
	name: string;
	label: string;
	type: string;
	value: any | Signal<any> | Signal<Record<string, any>>;
	validate: boolean;
};

type FormConfig = FormConfigItem & {
	model?: {
		fields: FormConfigItem[];
	};
};

type Child = {
	name: string;
	age: number;
};

type FormModel = Partial<{
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	confirmPassword: string;
	children: Child[];
}>;

@Component({
	selector: 'app-test',
	templateUrl: './test.component.html',
	imports: [FormsModule, JsonPipe, ReactiveFormsModule],
	styleUrls: ['./test.component.scss'],
})
export class TestComponent {
	private signupFormConfig: FormConfig[] = [
		{
			name: 'firstName',
			label: 'First Name',
			type: 'text',
			value: 'Michiel',
			validate: true,
		},
		{
			name: 'lastName',
			label: 'Last Name',
			type: 'text',
			value: 'Kikkert',
			validate: true,
		},
		{
			name: 'email',
			label: 'Email',
			type: 'email',
			value: '',
			validate: true,
		},
		{
			name: 'password',
			label: 'Password',
			type: 'password',
			value: '',
			validate: true,
		},
		{
			name: 'confirmPassword',
			label: 'Confirm Password',
			type: 'password',
			value: '',
			validate: true,
		},
		{
			name: 'children',
			label: 'Children',
			type: 'array',
			value: [],
			validate: true,
			model: {
				fields: [
					{
						name: 'name',
						label: 'Name',
						type: 'text',
						value: '',
						validate: true,
					},
					{
						name: 'name',
						label: 'Name',
						type: 'text',
						value: '',
						validate: true,
					},
				],
			},
		},
	];

	private vestValidatorFactory = (field = '', group = '') => {
		return (control: AbstractControl): ValidationErrors | null => {
			const controlName = Object.keys(control.parent?.controls || {}).find((key) => control.parent.get(key) === control);
			if (!controlName) return null;

			// Update the form so it is equal with the incoming control
			control.parent?.updateValueAndValidity();

			// Set the validation model
			const formValue = this.form.value || control.parent?.parent?.value || control.parent.value;
			const result = suite(formValue, field, group).getErrors();
			const errors = result[field];

			console.log({ field, errors });

			if (errors?.length) {
				const [message, subControl, index] = errors[0].split('|');
				if (field === subControl) {
					return {
						error: message,
					};
				}
				if (!subControl && field === controlName) {
					return { error: message };
				}
			}
			return null;
		};
	};

	public form = new FormGroup(
		{
			firstName: new FormControl('Michiel', [this.vestValidatorFactory('firstName', '')]),
			lastName: new FormControl(''),
			email: new FormControl(''),
			password: new FormControl(''),
			confirmPassword: new FormControl(''),
			children: new FormArray(
				[
					new FormGroup({
						name: new FormControl('', [this.vestValidatorFactory('name')]),
						age: new FormControl<number | null>(null, [this.vestValidatorFactory('age')]),
					}),
				],
				[this.vestValidatorFactory('children')],
			),
		},
		[],
	);

	get children() {
		return this.form.controls.children as FormArray;
	}

	get newChild() {
		return new FormGroup({
			name: new FormControl('', [this.vestValidatorFactory('name')]),
			age: new FormControl<number | null>(null, [this.vestValidatorFactory('age')]),
		});
	}

	addChild() {
		this.children.push(this.newChild);
		setTimeout(() => {
			this.form.updateValueAndValidity();
		}, 0);
	}

	removeChild(childIndex: number) {
		console.log(childIndex);
		this.children.removeAt(childIndex);
	}

	submit() {
		console.log('SUBMIT');
		console.log('valid', this.form.valid);
		console.log('value', this.form.value);
	}

	getControlStatus(control: AbstractControl<any, any> | null) {
		return {
			errors: control?.errors || null,
			dirty: control?.dirty,
			valid: control?.valid,
		};
	}

	createForm(config: FormConfigItem[], ngForm: Signal<NgForm>) {
		// const control: Record<string, any> = {};
		// const statusChanges: WritableSignal<any> = signal(null);
		// const status: WritableSignal<Record<string, any>> = signal({});
		//
		// const formSig = computed(() => {
		// 	return ngForm() as NgForm;
		// });
		//
		// config.forEach((item) => {
		// 	item.value = signal(item.value);
		// 	control[item.name] = item;
		// });
		//
		// const controlValues = computed(() => {
		// 	const control: Record<string, any> = {};
		// 	statusChanges();
		// 	config.map(({ name, value }) => {
		// 		control[name] = value();
		// 		untracked(() => {
		// 			status.update((status) => {
		// 				return {
		// 					...status,
		// 					[name]: this.getControlStatus(formSig().form.get(name)),
		// 				};
		// 			});
		// 			if (Array.isArray(value())) {
		// 				// Update this name in errors:
		// 				const statusArray: any[] = [];
		// 				value().forEach((subControl: any, index: number) => {
		// 					const keys = Object.keys(subControl);
		// 					const subStatus: Record<string, any> = {};
		// 					keys.forEach((key: string) => {
		// 						const subKey = `${name}-${key}-${index}`;
		// 						subStatus[key] = this.getControlStatus(formSig().form.get(subKey));
		// 					});
		// 					statusArray.push(subStatus);
		// 				});
		// 				status.update((status) => {
		// 					return {
		// 						...status,
		// 						[name]: statusArray,
		// 					};
		// 				});
		// 			}
		// 		});
		// 	});
		// 	return control;
		// });
		//
		// const valid = computed(() => {
		// 	formSig()
		// 		?.form.valueChanges.pipe(distinctUntilChanged(), take(1))
		// 		.subscribe((status) => {
		// 			statusChanges.set(status);
		// 		});
		// 	statusChanges();
		// 	controlValues();
		// 	return (formSig() as NgForm).form.valid;
		// });
		//
		// return {
		// 	controls: config,
		// 	control,
		// 	status,
		// 	valid,
		// 	value: controlValues,
		// };
	}
}
