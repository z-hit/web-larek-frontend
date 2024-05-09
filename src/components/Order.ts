import { Form } from './common/Form';
import { IOrderForm } from '../types';
import { IEvents } from './base/events';
import { ensureAllElements } from '../utils/utils';

export class Order extends Form<IOrderForm> {
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
