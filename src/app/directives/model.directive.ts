import { Directive, inject, OnDestroy, Signal } from '@angular/core';
import { AbstractControl, NgModel, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormDirective } from './form.directive';
import { suite } from '../validators/validations';

@Directive({
	selector: '[ngModel]',
})
export class ModelDirective implements OnDestroy {
	form = inject(FormDirective);
	ngModel = inject(NgModel);
	control = this.ngModel.control as any;

	constructor() {
		console.log('CREATE MODEL DIRECTIVE', this.ngModel.name);
		setTimeout(() => {
			// console.log('SUITE:', this.form.suite(), this.form.model()());
			console.log(this.ngModel.name);
			this.control.addValidators(validatorFactory(this.form.model as Signal<Record<string, any>>, this.ngModel.name, this.form.suite() as string));
			this.control.updateValueAndValidity({ onlySelf: true, emitEvent: false });
		}, 0);
	}

	ngOnDestroy() {
		console.log('DESTROY', this.ngModel.name);
		this.control.updateValueAndValidity({ onlySelf: true, emitEvent: false });
	}
}

function validatorFactory(model: Signal<Record<string, any>>, field: string, suiteId: string): ValidatorFn | ValidatorFn[] {
	const vestValidator = (control: AbstractControl): ValidationErrors | null => {
		console.log(suiteId, field, control.value);
		const updatedModel = {
			...model(),
			[field]: control.value,
		};
		const result = suite(updatedModel, field);
		// control.updateValueAndValidity({ onlySelf: true, emitEvent: false });
		console.log('VEST ERRORS:', result.getErrors());
		return null;
	};

	return [vestValidator];
}
