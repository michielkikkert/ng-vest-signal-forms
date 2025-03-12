import { Directive, input, InputSignal, Signal } from '@angular/core';

@Directive({
	selector: 'form',
})
export class FormDirective {
	public suite = input.required();
	public model = input.required();
}
