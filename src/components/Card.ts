import { Category } from '../types';
import { Component } from './base/Component';
import { IItem } from '../types';
import {
	bem,
	createElement,
	ensureElement,
	formatNumber,
} from '../utils/utils';
import { AppState } from './AppState';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}
export interface IItemCard {
	id: string;
	title: string;
	price: number;
	description?: string;
	image?: string;
	category?: Category;
	index?: number;
	button: string;
}

const colorsCategory: Record<string, string> = {
	другое: 'card__category_other',
	'софт-скил': 'card__category_soft',
	дополнительное: 'card__category_additional',
	кнопка: 'card__category_button',
	'хард-скил': 'card__category_hard',
};

export class ItemCard extends Component<IItemCard> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;

	protected _image?: HTMLImageElement;
	protected _description?: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _category?: HTMLElement;
	protected _index?: HTMLElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: ICardActions
	) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);

		this._category = container.querySelector(`.${blockName}__category`);
		this._image = container.querySelector(`.${blockName}__image`);
		this._button = container.querySelector(`.${blockName}__button`);
		this._description = container.querySelector(`.${blockName}__description`);
		this._index = container.querySelector(`.basket__item-index`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number) {
		if (value) {
			this.setText(this._price, String(formatNumber(value)) + ' синапсов');
		} else {
			this.setText(this._price, 'Не продается');
			this.setDisabled(this._button, true);
		}
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set category(value: string) {
		this.setText(this._category, value);
		this.addClass(this._category, colorsCategory[value]);
	}

	set index(value: number) {
		this.setText(this._index, String(value));
	}

	set description(value: string) {
		this.setText(this._description, value);
	}
}
