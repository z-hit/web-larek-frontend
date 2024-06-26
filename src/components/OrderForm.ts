import { Form } from './common/Form';
import { IOrderForm } from '../types';
import { Events, IEvents } from './base/Events';
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
		this._address = this.container.elements.namedItem(
			'address'
		) as HTMLInputElement;

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
				events.emit(Events.UPDATE_PAYMENT, button);
			});
		});
	}

	set address(value: string) {
		this._address.value = value;
	}
}
