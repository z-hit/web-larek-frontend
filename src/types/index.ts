import { IContactsForm } from '../components/Contacts';
import { IOrderForm } from '../components/Order';

export interface IAppState {
	catalog: Item[];
	basket: ItemID[];
	order: IOrder | null;
	loading: boolean;
	formErrors: FormErrors = {};
	modal: string | null;
}

export interface Item {
	id: ItemID;
	title: string;
	price: number;
	description: string;
	image: string;
	category: Category;
	isAdded: boolean;
}

export interface IOrderForm {
	payment: string;
	address: string;
}

export interface IContactsForm {
	email: string;
	phone: string;
}

export interface IOrder extends IOrderForm, IContactsForm {
	total: number;
	items: ItemID[];
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;
export type ItemID = string;
export type Payment = 'Онлайн' | 'При получении';
export type Category =
	| 'другое'
	| 'софт-скилл'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скилл';
