import { Component, computed, Signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormArray, FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
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

			const isFormControl = control instanceof FormControl;
			const isFormGroup = control instanceof FormGroup;
			const isFormArray = control instanceof FormArray;

			// Update the form so it is equal to the incoming control
			control.parent?.updateValueAndValidity();

			// Set the validation model
			const formValue = this.form.value || control.parent?.parent?.value || control.parent?.value;
			const result = suite(formValue, field, group).getErrors();

			// Handle FormArray
			if (isFormArray) {
				const controlGroup = control?.controls;
				this.form.controls[controlName].controls.forEach((controlInForm: FormGroup<any>, index) => {
					const current = (controlGroup[index] as FormGroup)?.controls;
					if (current === controlInForm?.controls) {
						Object.keys(current).forEach((key) => {
							const id = `${controlName}-${key}-${index}`;
							const currentResult = suite(formValue, id, group, controlName).getErrors()?.[id];
							if (currentResult?.length) {
								current[key].setErrors({ message: currentResult[0] });
							} else {
								current[key].setErrors(null);
							}
						});
					}
				});
			}

			// Handle FormGroup
			if (isFormGroup) {
				const controlGroup = control?.controls;
				Object.entries(controlGroup).forEach(([name, control]) => {
					if (result[name]) {
						control.setErrors({ message: result[name][0] });
					} else {
						control.setErrors(null);
					}
				});
			}

			// Handle a single control
			if (isFormControl) {
				const errors = result[field];
				return errors ? { message: errors } : null;
			}

			return null;
		};
	};

	public form = new FormGroup({
		firstName: new FormControl('', [this.vestValidatorFactory('firstName', 'bla')]),
		lastName: new FormControl('', [this.vestValidatorFactory('lastName')]),
		email: new FormControl('', [this.vestValidatorFactory('email')]),
		passwordGroup: new FormGroup(
			{
				password: new FormControl('abc'),
				confirmPassword: new FormControl('abc'),
			},
			[this.vestValidatorFactory('passwordGroup')],
		),
		children: new FormArray([], [this.vestValidatorFactory('children')]),
	});

	public formSignal = toSignal(this.form.valueChanges);
	public suiteSignal = computed(() => {
		this.formSignal();
		return suite.getErrors();
	});

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
		this.form.updateValueAndValidity();
	}

	removeChild(childIndex: number) {
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
}
