import { Form } from './common/Form';
import { IOrderForm } from '../types';
import { EventEmitter, IEvents } from './base/events';
import { ensureAllElements, ensureElement } from '../utils/utils';

export class Order extends Form<Partial<IOrderForm>> {
	_payment: HTMLButtonElement[];
	_address: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._payment = ensureAllElements<HTMLButtonElement>(
			'.button_alt',
			container
		);

		this._payment.forEach((button) => {
			button.addEventListener('click', () => {
				events.emit('payment:changed', button);
				this._payment.forEach((button) => {
					this.toggleClass(button, 'button_alt-active');
				});
			});
		});
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}
