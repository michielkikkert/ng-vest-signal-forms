import { Directive, inject, OnDestroy, Signal } from '@angular/core';
import { AbstractControl, NgModel, NgModelGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormDirective } from './form.directive';
import { suite } from '../validators/validations';

@Directive({
	selector: '[ngModel1], [ngModelGroup1]',
})
export class ModelDirective {
	// form = inject(FormDirective);
	// ngModel = inject(NgModel, { optional: true });
	// ngModelGroup = inject(NgModelGroup, { optional: true });
	// control = this.ngModel?.control || this.ngModelGroup?.control;
	// name = this.ngModel?.name;
	// groupName = this.ngModelGroup?.name;
	//
	// constructor() {
	// 	if (!this.control) {
	// 		return;
	// 	}
	// 	// console.log('CREATE MODEL DIRECTIVE', this.ngModel.name);
	// 	setTimeout(() => {
	// 		this.control.addValidators(validatorFactory(this.form.model as Signal<Record<string, any>>, this.name, this.groupName, this.ngModel, this.form.suite() as string));
	// 		this.control.updateValueAndValidity({ onlySelf: true, emitEvent: false });
	// 	}, 0);
	// }
	//
	// ngOnDestroy() {
	// 	this.control && this.control.updateValueAndValidity({ onlySelf: true, emitEvent: false });
	// }
}

function validatorFactory(model: Signal<any>, field: string, groupName: string, ngModel: NgModel, suiteId: string): ValidatorFn | ValidatorFn[] {
	const vestValidator = (control: AbstractControl): ValidationErrors | null => {
		let updatedModel = model;
		// console.log({ groupName });
		// if (!groupName) {
		// 	updatedModel = {
		// 		...model(),
		// 		[field]: control.value,
		// 	};
		// } else {
		// 	const entries = Object.entries(control.parent.controls);
		// 	console.log({ entries });
		// 	updatedModel = {
		// 		...model(),
		// 		[groupName]: '',
		// 	};
		// }
		console.log(updatedModel);
		const result = suite(updatedModel, field);
		console.log('VEST ERRORS:', result.getErrors());
		return null;
	};

	return [vestValidator];
}
