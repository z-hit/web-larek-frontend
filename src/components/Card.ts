import { Category } from '../types';
import { Component } from './base/Component';
import { IItem } from '../types';
import { bem, createElement, ensureElement } from '../utils/utils';

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
	isAdded: boolean;
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
		this._index = container.querySelector(`.${blockName}_item-index`);

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

	set price(value: string) {
		this.setText(this._price, value + ' синапсов');
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

	set description(value: string | string[]) {
		if (Array.isArray(value)) {
			this._description.replaceWith(
				...value.map((str) => {
					const descTemplate = this._description.cloneNode() as HTMLElement;
					this.setText(descTemplate, str);
					return descTemplate;
				})
			);
		} else {
			this.setText(this._description, value);
		}
	}
}
