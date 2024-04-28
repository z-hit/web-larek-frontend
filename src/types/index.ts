export interface Item {
	id: ItemID;
	title: string;
	price: number;
	description: string;
	image: string;
	category: Category;
	counter: number;
	isAdded: Boolean;
	button: Button;
}

export interface User {
	payment: Payment;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: ItemID[];
	addPayment(payment: Payment): void;
	addAddress(address: string): void;
	addEmail(email: string): void;
	addPhone(phone: string): void;
	addItems(items: ItemID[]): void;
	postUserData(
		userData: Pick<
			User,
			'payment' | 'email' | 'phone' | 'address' | 'total' | 'items'
		>
	): void;
}

export interface Basket {
	items: ItemID[];
	total: number;
	addItem(itemId: ItemID): void;
	removeItem(itemId: ItemID): void;
	clearAll(): void;
	getItems(): ItemID[];
}

export type ItemID = string;
export type Payment = 'Онлайн' | 'При получении';
export type Category =
	| 'другое'
	| 'софт-скилл'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скилл';
export type Picture = {
	url: string;
	title?: string;
	alt: string;
};
export type Button = {
	title?: string;
	event: Event;
	callback: Function;
	disabled?: Boolean;
};
export type InputPayment = {
	buttonPayOnline: Button;
	buttonPayOffline: Button;
};

//MAIN PAGE

export interface IMain {
	logo: Picture;
	catalog: Item[];
	buttonBasket: Button;
	getItems(): Item[];
	openPreview(item: ItemID): void;
	openBasket(): void;
}

// POPUPS

export interface IPopup {
	buttonClose: Button;
	button: Button;
}

export interface IPopupPreview extends IPopup {
	itemPreview: Pick<
		Item,
		'id' | 'category' | 'title' | 'description' | 'image' | 'price' | 'isAdded'
	>;
}

export interface IPopupBasket extends IPopup, Basket {
	title: string;
	itemsList: Pick<
		Item,
		'id' | 'counter' | 'title' | 'price' | 'isAdded' | 'button'
	>[];
}

export interface IPopupFormInput<T> {
	title: string;
	input: T;
}

export interface IPopupOrder extends IPopup {
	inputPayment: IPopupFormInput<InputPayment>;
	inputAddress: IPopupFormInput<string>;
	showError(): string;
	clearInputs(): void;
}

export interface IPopupContacts extends IPopup {
	inputEmail: IPopupFormInput<string>;
	inputPhone: IPopupFormInput<string>;
	showError(): string;
	clearInputs(): void;
}

export interface IPopupSuccess extends IPopup {
	picture: string;
	text: 'Заказ оформлен';
	sum: number;
}
