import { inject, InjectionToken } from '@angular/core';
import { DataService } from '../services/data.service';

export const CurrentStepToken = new InjectionToken('Current step', {
	factory: (index = 0) => {
		const dataService = inject(DataService);

		return dataService.getStepByIndex(index);
	},
});
