export interface IAppState {
	catalog: IItem[];
	order: IOrder | null;
	formOrderErrors: FormOrderErrors;
	formContactsErrors: FormContactsErrors;
	modal: string | null;
}

export interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export interface IItem {
	id: string;
	title: string;
	price: number;
	description: string;
	image: string;
	category: Category;
}

export interface IItemCard extends Partial<IItem> {
	id: string;
	title: string;
	price: number;
	description?: string;
	image?: string;
	category?: Category;
	index?: number;
	button?: string;
}

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface IFormState {
	valid: boolean;
	errors: string[];
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

export type CatalogChangeEvent = {
	catalog: IItem[];
};

export type FormOrderErrors = Partial<Record<keyof IOrderForm, string>>;
export type FormContactsErrors = Partial<Record<keyof IContactsForm, string>>;

export type Payment = 'Онлайн' | 'При получении';
export type Category =
	| 'другое'
	| 'софт-скилл'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скилл';

export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface ILarekAPI {
	getItemList: () => Promise<IItem[]>;
	getItem: (id: string) => Promise<IItem>;
	orderItems: (order: IOrder) => Promise<IOrderResult>;
}

export interface IBasketView {
	items: HTMLElement[];
	total: number;
	selected: string[];
}

export interface IModalData {
	content: HTMLElement;
}

export interface ISuccess {
	total: number;
}

export interface ISuccessActions {
	onClick: () => void;
}
