import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { suite } from '../validators/validations';

export function vestValidatorFactory(field = '', group = '') {
	return (control: AbstractControl): ValidationErrors | null => {
		const controlName = Object.keys(control.parent?.controls || {}).find((key) => control.parent.get(key) === control);
		if (!controlName) return null;

		const isFormControl = control instanceof FormControl;
		const isFormGroup = control instanceof FormGroup;
		const isFormArray = control instanceof FormArray;

		// get the current state of the form (looking up to 3 levels up from the current control)
		const form = control.parent;
		// Update the form (value) so it is up to date with the incoming control
		form.updateValueAndValidity();
		// form?.parent?.updateValueAndValidity();
		// form?.parent?.parent?.updateValueAndValidity();

		// Get the (parent) form value
		const formValue = form.value;

		// Run the validation suite for the current field against the root form
		const result = suite(formValue, field, group).getErrors();
		const errors = result[field];

		// Handle FormArray
		if (isFormArray) {
			const controlGroup = control?.controls;
			form.controls[controlName].controls.forEach((controlInForm: FormGroup<any>, index) => {
				const current = (controlGroup[index] as FormGroup)?.controls;
				// Find the current control inside the FormArray
				if (current === controlInForm?.controls) {
					Object.keys(current).forEach((key) => {
						// This (complex) field identifier is needed so Vest can test individual, index based fields inside FormArray
						const field = `${controlName}-${key}-${index}`;
						// Now run the suite again, but with the correctly scoped field
						const currentResult = suite(formValue, field, group, controlName).getErrors()?.[field];
						// Check for errors and manually set the Errors on the array control.
						// This is needed because in a formArray the internal controls
						// might not have validators set.
						if (currentResult?.length) {
							current[key].setErrors({ message: currentResult[0] });
						} else {
							current[key].setErrors(null);
						}
					});
				}
			});
			return errors ? { message: errors } : null;
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
			return errors ? { message: errors } : null;
		}

		// Handle a single control
		if (isFormControl) {
			return errors ? { message: errors } : null;
		}

		return null;
	};
}
