export interface IAppState {
	catalog: IItem[];
	basket: string[];
	order: IOrder | null;
	loading: boolean;
	formOrderErrors: FormOrderErrors;
	formContactsErrors: FormContactsErrors;
	modal: string | null;
}

export interface IItem {
	id: string;
	title: string;
	price: number;
	description: string;
	image: string;
	category: Category;
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
	items: string[];
	total: number;
}

export interface IOrderResult {
	id: string;
	total: number;
}

export type FormOrderErrors = Partial<Record<keyof IOrderForm, string>>;
export type FormContactsErrors = Partial<Record<keyof IContactsForm, string>>;

export type Payment = 'Онлайн' | 'При получении';
export type Category =
	| 'другое'
	| 'софт-скилл'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скилл';

/* export type Button = {
	title: string;
	callback: Function;
}; */
