import { Component, computed } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { vestValidatorFactory } from '../../helpers/vest.validator';
import { toSignal } from '@angular/core/rxjs-interop';
import { suite } from '../../validators/validations';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-introductie',
	imports: [ReactiveFormsModule, RouterLink],
	templateUrl: './introductie.component.html',
	styleUrl: './introductie.component.scss',
})
export class IntroductieComponent {
	public form = new FormGroup({
		firstName: new FormControl('', [vestValidatorFactory('firstName', 'bla')]),
		lastName: new FormControl('', [vestValidatorFactory('lastName')]),
		email: new FormControl('', [vestValidatorFactory('email')]),
		passwordGroup: new FormGroup(
			{
				password: new FormControl('abc'),
				confirmPassword: new FormControl('abc'),
			},
			[vestValidatorFactory('passwordGroup')],
		),
		children: new FormArray([], [vestValidatorFactory('children')]),
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
