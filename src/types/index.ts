export interface IAppState {
	catalog: IItem[];
	basket: string[];
	order: IOrder | null;
	loading: boolean;
	formErrors: FormErrors;
	modal: string | null;
}

export interface IItem {
	isAdded: boolean;
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
	email: string;
	phone: string;
}

export interface IOrder extends IOrderForm {
	items: string[];
}

export interface IOrderResult {
	id: string;
	total: number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;
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
