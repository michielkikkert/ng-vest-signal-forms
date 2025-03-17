import { Component, computed, Signal } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { suite } from '../../validators/validations';
import { toSignal } from '@angular/core/rxjs-interop';

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

type FormModel = {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	confirmPassword: string;
	children: Child[];
};

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

			// Update the form so it is equal to the incoming control
			control.parent?.updateValueAndValidity();

			// Set the validation model
			const formValue = this.form.value || control.parent?.parent?.value || control.parent?.value;
			const result = suite(formValue, field, group).getErrors();
			const errors = result[field];

			if (control instanceof FormArray) {
				const controlGroup = control?.controls;

				this.form.controls.children.controls.forEach((controlInForm: FormGroup<any>, index) => {
					const current = (controlGroup[index] as FormGroup).controls;
					if (current === controlInForm?.controls) {
						Object.keys(current).forEach((key) => {
							const id = `${key}-${index}`;
							const currentResult = suite(formValue, id, group).getErrors()?.[id];
							if (currentResult?.length) {
								current[key].setErrors({ message: currentResult[0] });
							} else {
								current[key].setErrors(null);
							}
						});
					}
				});
			}
			return errors ? { message: errors } : null;
		};
	};

	public form = new FormGroup(
		{
			firstName: new FormControl('', [this.vestValidatorFactory('firstName', 'bla')]),
			lastName: new FormControl(''),
			email: new FormControl(''),
			password: new FormControl('abc', [this.vestValidatorFactory('password')]),
			confirmPassword: new FormControl('abc', [this.vestValidatorFactory('confirmPassword')]),
			children: new FormArray([], [this.vestValidatorFactory('children')]),
		},
		[],
	);

	public formSignal: Signal<any>;
	public suiteSignal = computed(() => {
		this.formSignal();
		return suite.getErrors();
	});

	constructor() {
		this.formSignal = toSignal(this.form.valueChanges);
	}

	get children() {
		return this.form.controls.children as FormArray;
	}

	get newChild() {
		return new FormGroup({
			name: new FormControl(''),
			age: new FormControl<number | null>(null),
		});
	}

	addChild() {
		this.children.push(this.newChild);
		// setTimeout(() => {
		this.form.updateValueAndValidity();
		// }, 0);
	}

	removeChild(childIndex: number) {
		console.log(childIndex);
		this.children.removeAt(childIndex);
	}

	submit() {
		console.log('SUBMIT');

		console.log('SUITE RESULT', suite.getErrors());

		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

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

	createForm(config: FormConfigItem[], ngForm: Signal<NgForm>) {}
}
