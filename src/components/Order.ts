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
				if (
					!this._payment.some((button) =>
						button.classList.contains('button_alt-active')
					)
				) {
					this.toggleClass(button, 'button_alt-active');
				} else {
					this._payment.forEach((button) => {
						this.toggleClass(button, 'button_alt-active');
					});
				}
				events.emit('payment:changed', button);
			});
		});
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}
