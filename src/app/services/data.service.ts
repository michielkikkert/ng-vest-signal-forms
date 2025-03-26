import { inject, Injectable, Signal } from '@angular/core';
import { NibudAppConfigToken, PartnerToken } from '../tokens';
import { AppConfigModel, FormConfigItem, StepConfig } from '../models/config.models';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { vestValidatorFactory } from '../helpers/vest.validator';

@Injectable({
	providedIn: 'root',
})
export class DataService {
	private config = inject(NibudAppConfigToken);
	private partner = inject(PartnerToken);
	private model = this.createModel(this.config);
	private forms = this.createForms(this.config);
	private rootForm = this.createRootForm(this.forms);

	constructor() {
		console.log({ model: this.model, config: this.config, partner: this.partner });
		console.log({ rootForm: this.rootForm, forms: this.forms });
		console.log({ rootValue: this.rootForm.value });
	}

	public getForm(step: string): FormGroup {
		return this.forms[step];
	}

	public getRootForm() {
		return this.rootForm;
	}

	public getStepConfig(step: string = null): StepConfig {
		if (step && this.config.steps[step]) {
			return { [step]: this.config.steps[step] };
		}

		return this.config.steps;
	}

	createModel(config: AppConfigModel) {
		const model = {};
		Object.entries(config.steps).forEach(([key, value]) => {
			value?.controls?.forEach((control) => {
				model[control.name] = control.value;
			});
		});

		return model;
	}

	createForms(config: AppConfigModel) {
		const forms = {};
		Object.entries(config.steps).forEach(([step, { controls }]) => {
			const currentControls = {};
			controls?.forEach((control) => {
				if (control.formType === 'FormArray') {
					const controlsArray = ((control.value as FormConfigItem[]) || []).map((controlConfig) => {
						const controlObject = {};
						Object.entries(controlConfig).forEach(([key, value]) => {
							controlObject[key] = new FormControl(value);
						});
						return new FormGroup(controlObject);
					});
					currentControls[control.name] = new FormArray(controlsArray, [vestValidatorFactory(control.name, step)]);
				}

				if (control.formType === 'FormGroup') {
					const controlGroup = {};
					((control.value as FormConfigItem[]) || []).forEach((groupControl) => {
						controlGroup[groupControl.name] = new FormControl(groupControl.value);
					});
					currentControls[control.name] = new FormGroup(controlGroup, [vestValidatorFactory(control.name, step)]);
				}

				if (!control.formType || control.formType === 'FormControl') {
					currentControls[control.name] = new FormControl(control.value, [vestValidatorFactory(control.name, step)]);
				}
			});

			forms[step] = new FormGroup(currentControls);
		});

		return forms;
	}

	createRootForm(forms: Record<string, FormGroup>): FormGroup {
		const rootForm = new FormGroup({});
		Object.entries(forms).forEach(([key, form]) => {
			rootForm.addControl(key, form);
			// rootForm.controls[key].addValidators([vestValidatorFactory(key, 'root')]);
		});
		return rootForm;
	}
}
