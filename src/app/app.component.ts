import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataService } from './services/data.service';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
})
export class AppComponent {
	title = 'ng-vest-signal-forms';
	dataService = inject(DataService);

	constructor() {
		// console.log(this.dataService.getStepConfig('inboedelonderhoud'));
	}
}
