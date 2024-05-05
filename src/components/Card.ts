import { Category, ItemID } from '../types';
import { Component } from './base/Component';
import { IItem } from '../types';
import { bem, createElement, ensureElement } from '../utils/utils';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}
export interface IItemCard {
	id: ItemID;
	title: string;
	price: number;
	description?: string;
	image?: string;
	category?: Category;
	index?: number;
	isAdded: boolean;
}

export class ItemCard extends Component<IItemCard> {
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _description?: HTMLElement;
	protected _button?: HTMLButtonElement;

	protected _category?: HTMLElement;
	protected _price?: HTMLElement;
	protected _index?: HTMLElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: ICardActions
	) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._image = ensureElement<HTMLImageElement>(
			`.${blockName}__image`,
			container
		);
		this._button = container.querySelector(`.${blockName}__button`);
		this._description = container.querySelector(`.${blockName}__description`);
		this._price = ensureElement<HTMLElement>(`.${blockName}_price`, container);
		this._category = container.querySelector(`.${blockName}_category`);
		this._index = container.querySelector(`.${blockName}_index`);

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

	get title(): string {
		return this._title.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
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

export class ItemCardCatalog extends ItemCard {
	constructor(container: HTMLElement, actions?: ICardActions) {
		super('card', container, actions);
	}
}
/* 
export type AuctionStatus = {
	status: string;
	time: string;
	label: string;
	nextBid: number;
	history: number[];
};

export class AuctionItem extends Card<HTMLElement> {
	protected _status: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super('lot', container, actions);
		this._status = ensureElement<HTMLElement>(`.lot__status`, container);
	}

	set status(content: HTMLElement) {
		this._status.replaceWith(content);
	}
} */
