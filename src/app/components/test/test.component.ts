import { Component, computed, Signal, signal, untracked, viewChild, WritableSignal } from '@angular/core';
import { AbstractControl, FormsModule, NgForm } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { FormDirective } from '../../directives/form.directive';
import { distinctUntilChanged, take } from 'rxjs';
import { ModelDirective } from '../../directives/model.directive';

type FormConfigItem = {
	name: string;
	label: string;
	type: string;
	value: any | Signal<any>;
};

@Component({
	selector: 'app-test',
	templateUrl: './test.component.html',
	imports: [FormsModule, JsonPipe, FormDirective, ModelDirective],
	styleUrls: ['./test.component.scss'],
})
export class TestComponent {
	private signupFormConfig: FormConfigItem[] = [
		{
			name: 'firstName',
			label: 'First Name',
			type: 'text',
			value: 'Michiel',
		},
		{
			name: 'lastName',
			label: 'Last Name',
			type: 'text',
			value: 'Kikkert',
		},
		{
			name: 'email',
			label: 'Email',
			type: 'email',
			value: '',
		},
		{
			name: 'password',
			label: 'Password',
			type: 'password',
			value: '',
		},
		{
			name: 'confirmPassword',
			label: 'Confirm Password',
			type: 'password',
			value: '',
		},
		{
			name: 'children',
			label: 'Children',
			type: 'array',
			value: [],
		},
	];
	ngForm: Signal<NgForm> = viewChild.required('signupform');
	form = this.createForm(this.signupFormConfig, this.ngForm);

	addChild() {
		this.form.control.children.value.update((kids: any[]) => {
			return [
				...kids,
				{
					name: '',
					age: '',
				},
			];
		});
	}

	removeChild(child: any) {
		this.form.control.children.value.update((kids: any[]) => {
			const pos = kids.findIndex((kid) => kid === child);
			return [...kids.slice(0, pos), ...kids.slice(pos + 1)];
		});
	}

	submit() {
		console.log('SUBMIT');
		console.log('valid', this.form.valid());
		console.log('value', this.form.value());
	}

	getControlStatus(control: AbstractControl<any, any> | null) {
		return {
			errors: control?.errors || null,
			dirty: control?.dirty,
			valid: control?.valid,
		};
	}

	createForm(
		config: FormConfigItem[],
		ngForm: Signal<NgForm>,
	): { controls: FormConfigItem[]; control: Record<string, any>; status: Signal<Record<string, any>>; valid: Signal<boolean>; value: Signal<Record<string, any>> } {
		const control: Record<string, any> = {};
		const statusChanges: WritableSignal<any> = signal(null);
		const status: WritableSignal<Record<string, any>> = signal({});

		const formSig = computed(() => {
			return ngForm() as NgForm;
		});

		config.forEach((item) => {
			item.value = signal(item.value);
			control[item.name] = item;
		});

		const controlValues = computed(() => {
			const control: Record<string, any> = {};
			statusChanges();
			config.map(({ name, value }) => {
				control[name] = value();
				untracked(() => {
					status.update((status) => {
						return {
							...status,
							[name]: this.getControlStatus(formSig().form.get(name)),
						};
					});
					if (Array.isArray(value())) {
						// Update this name in errors:
						const statusArray: any[] = [];
						value().forEach((subControl: any, index: number) => {
							const keys = Object.keys(subControl);
							const subStatus: Record<string, any> = {};
							keys.forEach((key: string) => {
								const subKey = `${name}-${key}-${index}`;
								subStatus[key] = this.getControlStatus(formSig().form.get(subKey));
							});
							statusArray.push(subStatus);
						});
						status.update((status) => {
							return {
								...status,
								[name]: statusArray,
							};
						});
					}
				});
			});
			return control;
		});

		const valid = computed(() => {
			formSig()
				?.form.valueChanges.pipe(distinctUntilChanged(), take(1))
				.subscribe((status) => {
					console.log('SUB!');
					statusChanges.set(status);
				});
			statusChanges();
			controlValues();
			return (formSig() as NgForm).form.valid;
		});

		return {
			controls: config,
			control,
			status,
			valid,
			value: controlValues,
		};
	}
}
