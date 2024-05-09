export { Category, IItem } from '../types';

import { Model } from './base/Model';
import {
	FormErrors,
	IAppState,
	IItem,
	IOrder,
	IOrderForm,
	Category,
} from '../types';

export type CatalogChangeEvent = {
	catalog: IItem[];
};

export class Item extends Model<IItem> {
	id: string;
	title: string;
	price: number;
	description: string;
	image: string;
	category: Category;
}

export class AppState extends Model<IAppState> {
	basket: string[];
	catalog: Item[];
	loading: boolean;
	order: IOrder = {
		payment: 'card',
		address: '',
		email: '',
		phone: '',
		items: [],
		total: 0,
	};
	preview: string | null;
	formErrors: FormErrors = {};

	isItemAdded(item: IItem) {
		return this.order.items.some((it) => it === item.id);
	}

	setButtonText(item: IItem) {
		return this.isItemAdded(item) ? 'Удалить' : 'В корзину';
	}

	setPreview(item: IItem) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	toggleAddedItem(id: string, isAdded?: boolean) {
		if (!isAdded) {
			this.order.items.push(id);
		} else {
			this.order.items = this.order.items.filter((i) => i !== id);
		}
	}

	clearBasket() {
		this.order.items = [];
	}

	getTotal() {
		return this.order.items.reduce(
			(a, c) => a + this.catalog.find((item) => item.id === c).price,
			0
		);
	}

	setCatalog(items: IItem[]) {
		this.catalog = items.map((item) => new Item(item, this.events));
		this.emitChanges('items:changed', { catalog: this.catalog });
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
