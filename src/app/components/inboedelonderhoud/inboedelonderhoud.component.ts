import { Component, computed, inject } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { suite } from '../../validators/validations';
import { RouterLink } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
	selector: 'app-inboedelonderhoud',
	imports: [JsonPipe, ReactiveFormsModule, RouterLink],
	templateUrl: './inboedelonderhoud.component.html',
	styleUrl: './inboedelonderhoud.component.scss',
})
export class InboedelonderhoudComponent {
	private dataService = inject(DataService);
	public form = this.dataService.getForm('inboedelonderhoud');
	public rootForm = this.dataService.getRootForm();

	public formSignal = toSignal(this.form.valueChanges, { initialValue: this.form.value });
	public suiteSignal = computed(() => {
		this.formSignal();
		return suite.getErrors();
	});

	constructor() {
		// this.form.updateValueAndValidity();
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
