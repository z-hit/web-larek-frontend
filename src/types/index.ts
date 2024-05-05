export interface IAppState {
	catalog: IItem[];
	basket: ItemID[];
	order: IOrder | null;
	loading: boolean;
	formErrors: FormErrors = {};
	modal: string | null;
}

export interface IItem {
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
	email: string;
	phone: string;
}

export interface IOrder extends IOrderForm {
	items: ItemID[];
}

export interface IOrderResult {
	id: ItemID;
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

export type Button = {
	title: string;
	callback: Function;
};
