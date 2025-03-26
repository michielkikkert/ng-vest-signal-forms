export type FormConfigItem = {
	name: string;
	label: string;
	fieldType?: 'text' | 'number' | 'radio' | 'checkbox' | 'toggle';
	formType?: 'FormControl' | 'FormArray' | 'FormGroup';
	value: string | number | boolean | any[] | FormConfigItem[];
	skipValidation?: boolean;
	controls?: FormConfigItem[];
};

export type StepConfig = Record<
	string,
	{
		index: number;
		label: string;
		disabled?: boolean;
		isResult?: boolean;
		controls?: FormConfigItem[];
	}
>;

export type AppConfigModel = {
	appId: string;
	trackingId: string;
	partnerVersions: string[];
	steps: StepConfig;
	partner?: any;
};
