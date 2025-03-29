import { inject, Injectable, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { NibudAppConfigToken, PartnerToken } from '../tokens';
import { AppConfigModel, FormControlItem, StepConfig } from '../models/config.models';
import { vestValidatorFactory } from '../helpers/vest.validator';
import { debounceTime } from 'rxjs';

// TODO: Use abstracted InjectionToken for localStorage (SSR!)

@Injectable({
	providedIn: 'root',
})
export class DataService {
	private config = inject(NibudAppConfigToken);
	private partner = inject(PartnerToken);
	private rootForm = new FormGroup({});
	private rootFormSignal = toSignal<FormGroup>(this.rootForm.valueChanges);
	private forms = this.createForms(this.config);
	private win = inject(DOCUMENT).defaultView;
	private storageKey = this.config.appId + (this.partner ?? 'nibud');
	private savedModel = JSON.parse(this.win.localStorage?.getItem(this.storageKey) || null);
	public currentStep = signal(0);

	constructor() {
		this.createRootForm(this.forms, this.rootForm);

		// TODO: needs more conditions. When do we start to record?
		if (this.config.persistence) {
			this.recordChanges();
		}

		// TODO: needs more conditions. When to apply saved model?
		if (this.savedModel) {
			this.applyModelToForm(this.savedModel?.model, this.config.steps, this.rootForm);
		}
	}

	private applyModelToForm(model: any, config: StepConfig | Record<string, FormControlItem[]>, form: FormGroup): void {
		// Find controls in config that have a FormArray formType as they need some special love.
		// .. unfortuntaly, patch does not automatically add new ForGroups/FormControla to a FormArray
		Object.entries(config).forEach(([name, group]) => {
			let currentModel = model?.[name];
			if (group.controls) {
				group.controls.forEach((control) => {
					if (control.formType === 'FormArray') {
						currentModel = currentModel?.[control.name];
						const currentFormArray = form.get([name, control.name]) as FormArray;
						if (currentModel?.length > currentFormArray?.controls.length) {
							currentFormArray.reset();
							currentModel.forEach((controlGroup) => {
								const groupObject = {};
								Object.entries(controlGroup).forEach(([name, value]) => {
									groupObject[name] = new FormControl(value);
								});
								console.log({ groupObject });
								currentFormArray.push(new FormGroup(groupObject));
							});
						}
					}

					// Takes care of FormArrays that might be in a FormGroup - recursive.
					if (control.formType === 'FormGroup') {
						currentModel = currentModel?.[control.name];
						const currentControls = form.get([name, control.name]) as FormGroup;
						this.applyModelToForm({ [control.name]: currentModel }, { [control.name]: control.controls }, currentControls);
					}
				});
			}

			// The form should be ready to patch now..
			form.patchValue(model);
		});
	}

	public getForm(step: string): FormGroup {
		return this.forms[step];
	}

	public getRootForm() {
		return this.rootForm;
	}

	public getStepByIndex(stepIndex: number = 0): any {
		return Object.entries(this.config.steps).find(([key, value]) => {
			if (value.index === stepIndex) {
				return { [key]: value } as StepConfig;
			}
			return undefined;
		});
	}

	private recordChanges(): void {
		this.rootForm.valueChanges.pipe(debounceTime(100)).subscribe((model) => {
			this.win.localStorage?.setItem(this.storageKey, JSON.stringify({ time: +new Date(), model }));
		});
	}

	private createForms(config: AppConfigModel) {
		const forms = {};
		Object.entries(config.steps).forEach(([step, { controls }]) => {
			let currentControls = {};
			controls?.forEach((control) => {
				currentControls[control.name] = this.processControl(control, step);
			});
			// Maybe attach a step validator here?
			forms[step] = new FormGroup(currentControls);
		});
		return forms;
	}

	private processControl(control: FormControlItem, step: string = '') {
		if (control.formType === 'FormArray') {
			const controlsArray = ((control.value as FormControlItem[]) || []).map((controlConfig) => {
				const controlObject = {};
				Object.entries(controlConfig).forEach(([key, value]) => {
					controlObject[key] = new FormControl(value);
				});
				return new FormGroup(controlObject);
			});
			return new FormArray(controlsArray, [vestValidatorFactory(control.name, step, this.rootFormSignal)]);
		}

		if (control.formType === 'FormGroup') {
			const controlGroup = {};
			((control.controls as FormControlItem[]) || []).forEach((groupControl) => {
				controlGroup[groupControl.name] = this.processControl(groupControl, null);
			});
			return new FormGroup(controlGroup, [vestValidatorFactory(control.name, step, this.rootFormSignal)]);
		}

		return new FormControl(control.value, step ? [vestValidatorFactory(control.name, step, this.rootFormSignal)] : []);
	}

	private createRootForm(forms: Record<string, FormGroup>, rootForm: FormGroup): void {
		Object.entries(forms).forEach(([key, form]) => {
			rootForm.addControl(key, form);
			// To make below work, we need another suite, so another factory. Not sure yet if needed.
			// rootForm.controls[key].addValidators([vestValidatorFactory(key, 'root')]);
		});
	}
}
