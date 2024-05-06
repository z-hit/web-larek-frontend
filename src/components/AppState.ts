export { ItemID, Category, IItem } from '../types';

import { Model } from './base/Model';
import {
	FormErrors,
	IAppState,
	IItem,
	IOrder,
	IOrderForm,
	ItemID,
	Category,
	Button,
} from '../types';

export type CatalogChangeEvent = {
	catalog: IItem[];
};

export class Item extends Model<IItem> {
	id: ItemID;
	title: string;
	price: number;
	description: string;
	image: string;
	category: Category;
	counter?: number;
	isAdded?: boolean;
	button?: Button;
}

export class AppState extends Model<IAppState> {
	basket: ItemID[];
	catalog: Item[];
	loading: boolean;
	order: IOrder = {
		payment: '',
		address: '',
		email: '',
		phone: '',
		items: [],
	};
	preview: string | null;
	formErrors: FormErrors = {};

	removeBasketItem(id: string) {
		this.order.items.filter((item: ItemID) => item !== id);
	}

	clearBasket() {
		this.order.items.forEach((id) => {
			this.removeBasketItem(id);
		});
	}

	getTotal() {
		return this.order.items.reduce(
			(a, c) => a + this.catalog.find((it) => it.id === c).price,
			0
		);
	}

	setCatalog(items: IItem[]) {
		this.catalog = items.map((item) => new Item(item, this.events));
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	setPreview(item: IItem) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	setOrderField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;

		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
