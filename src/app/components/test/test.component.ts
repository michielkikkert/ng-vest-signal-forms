import { Component, computed } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { suite } from '../../validators/validations';
import { vestValidatorFactory } from '../../helpers/vest.validator';

@Component({
	selector: 'app-test',
	templateUrl: './test.component.html',
	imports: [JsonPipe, ReactiveFormsModule],
	styleUrls: ['./test.component.scss'],
})
export class TestComponent {
	public form = new FormGroup({
		firstName: new FormControl('', [vestValidatorFactory('firstName', 'test')]),
		lastName: new FormControl('', [vestValidatorFactory('lastName', 'test')]),
		email: new FormControl('', [vestValidatorFactory('email', 'test')]),
		passwordGroup: new FormGroup(
			{
				password: new FormControl('abc'),
				confirmPassword: new FormControl('abc'),
			},
			[vestValidatorFactory('passwordGroup', 'test')],
		),
		children: new FormArray([], [vestValidatorFactory('children', 'test')]),
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
