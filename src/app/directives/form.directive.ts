import { Directive, inject, input, InputSignal, Output, output, Signal } from '@angular/core';
import { AbstractControl, FormGroup, NgForm, NgModel, ValidationErrors, ValidatorFn } from '@angular/forms';
import { debounceTime, map, tap } from 'rxjs';
import { suite } from '../validators/validations';

@Directive({
	selector: 'form1',
})
export class FormDirective {
	public suite = input.required();
	private readonly ngForm = inject(NgForm, { self: true });
	// @Output() public readonly formValueChange = this.ngForm.form.valueChanges.pipe(
	// 	debounceTime(0),
	// 	map(() => mergeValuesAndRawValues(this.ngForm.form)),
	// 	// tap(() => this.ngForm.form.updateValueAndValidity()),
	// );
	// @Output() public readonly form = this.ngForm.form.valueChanges.pipe(
	// 	debounceTime(0),
	// 	map(() => this.ngForm.form),
	// 	tap(() => this.attachValidator(this.ngForm.form)),
	// );
	//
	// attachValidator(form: FormGroup) {
	// 	form.addValidators(this.validatorFactory(form));
	// }
	//
	// validatorFactory(form: FormGroup): ValidatorFn | ValidatorFn[] {
	// 	const vestValidator = (control: AbstractControl): ValidationErrors | null => {
	// 		let model = form.value;
	// 		// console.log({ groupName });
	// 		// if (!groupName) {
	// 		// 	updatedModel = {
	// 		// 		...model(),
	// 		// 		[field]: control.value,
	// 		// 	};
	// 		// } else {
	// 		// 	const entries = Object.entries(control.parent.controls);
	// 		// 	console.log({ entries });
	// 		// 	updatedModel = {
	// 		// 		...model(),
	// 		// 		[groupName]: '',
	// 		// 	};
	// 		// }
	// 		console.log(JSON.stringify(model, null, 5));
	// 		const result = suite(model, 'root');
	// 		console.log('VEST ERRORS:', result.getErrors());
	// 		return null;
	// 	};
	//
	// 	return [vestValidator];
	// }
}

export function mergeValuesAndRawValues<T>(form: FormGroup): T {
	// Retrieve the standard values (respecting references)
	const value = { ...form.value };

	// Retrieve the raw values (including disabled values)
	const rawValue = form.getRawValue();

	// Recursive function to merge rawValue into value
	function mergeRecursive(target: any, source: any) {
		Object.keys(source).forEach((key) => {
			if (target[key] === undefined) {
				// If the key is not in the target, add it directly (for disabled fields)
				target[key] = source[key];
			} else if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
				// If the value is an object, merge it recursively
				mergeRecursive(target[key], source[key]);
			}
			// If the target already has the key with a primitive value, it's left as is to maintain references
		});
	}

	// Start the merging process only if the form is a FormGroup
	if (form instanceof FormGroup) {
		mergeRecursive(value, rawValue);
	}

	return value;
}
