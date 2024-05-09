export { Category, IItem } from '../types';

import { Model } from './base/Model';
import {
	//FormErrors,
	IAppState,
	IItem,
	IOrder,
	IOrderForm,
	Category,
	IContactsForm,
	FormOrderErrors,
	FormContactsErrors,
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
	formOrderErrors: FormOrderErrors = {};
	formContactsErrors: FormContactsErrors = {};

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
		this.validateOrder();
	}

	setContactsField(field: keyof IContactsForm, value: string) {
		this.order[field] = value;
		this.validateContacts();
	}

	validateOrder() {
		const errors: typeof this.formOrderErrors = {};
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}

		this.formOrderErrors = errors;
		this.events.emit('formOrderErrors:change', this.formOrderErrors);
		return Object.keys(errors).length === 0;
	}

	validateContacts() {
		const errors: typeof this.formContactsErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать почту';
		}

		if (!this.order.phone) {
			errors.phone = 'Необходимо указать номер телеофона';
		}

		this.formContactsErrors = errors;
		this.events.emit('formContactsErrors:change', this.formContactsErrors);
		return Object.keys(errors).length === 0;
	}
}
