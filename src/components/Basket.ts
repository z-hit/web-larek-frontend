import { Component } from './base/Component';
import { createElement, ensureElement, formatNumber } from '../utils/utils';
import { EventEmitter, Events } from './base/Events';
import { IBasketView } from '../types';

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price');
		this._button = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.container
		);

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit(Events.OPEN_ORDER);
			});
		}

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	set selected(items: string[]) {
		this.setDisabled(this._button, !items.length);
	}

	set total(total: number) {
		this.setText(this._total, String(formatNumber(total)) + ' синапсов');
	}
}
