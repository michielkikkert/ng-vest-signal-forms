import { Component, computed, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { DataService } from '../../services/data.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { suite } from '../../validators/validations';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-auto',
	imports: [FormsModule, JsonPipe, ReactiveFormsModule, RouterLink],
	templateUrl: './auto.component.html',
	styleUrl: './auto.component.scss',
})
export class AutoComponent {
	private dataService = inject(DataService);
	public form = this.dataService.getForm('auto');
	public rootForm = this.dataService.getRootForm();

	public formSignal = toSignal(this.form.valueChanges, { initialValue: this.form.value });
	public suiteSignal = computed(() => {
		this.formSignal();
		return suite.getErrors();
	});

	constructor() {}

	refresh() {
		this.form.updateValueAndValidity();
	}

	get Autos() {
		return this.form.controls.Autos as FormArray;
	}

	get newAuto() {
		return new FormGroup({
			NieuwWaarde: new FormControl<null | number>(null),
			StatusAuto: new FormControl<null | string>(null),
		});
	}

	addAuto() {
		this.Autos.push(this.newAuto);
		this.form.updateValueAndValidity();
	}

	removeAuto(childIndex: number) {
		this.Autos.removeAt(childIndex);
		this.form.updateValueAndValidity();
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
