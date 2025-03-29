export type FormControlItem = {
	name: string;
	label: string;
	fieldType?: 'text' | 'number' | 'radio' | 'checkbox' | 'toggle';
	formType?: 'FormControl' | 'FormArray' | 'FormGroup';
	value?: string | number | boolean | any[];
	skipValidation?: boolean;
	controls?: FormControlItem[];
};

export type StepConfig = Record<
	string,
	{
		index: number;
		label: string;
		disabled?: boolean;
		isResult?: boolean;
		controls?: FormControlItem[];
	}
>;

export type AppConfigModel = {
	appId: string;
	trackingId: string;
	partnerVersions: string[];
	steps: StepConfig;
	partner?: any;
	persistence: boolean;
};
