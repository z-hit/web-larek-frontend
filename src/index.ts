import './scss/styles.scss';

import { Events } from './components/base/events';
import { LarekAPI } from './components/LarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppState } from './components/AppState';
import { Page } from './components/Page';
import { ItemCard } from './components/Card';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import {
	CatalogChangeEvent,
	IContactsForm,
	IItem,
	IOrder,
	IOrderForm,
} from './types';
import { Order } from './components/Order';
import { Contacts } from './components/Contacts';
import { Success } from './components/common/Success';

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const appData = new AppState({}, events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

events.on<CatalogChangeEvent>(Events.UPDATE_CATALOG, () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new ItemCard('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit(Events.PREVIEW_CARD, item),
		});
		return card.render({
			category: item.category,
			title: item.title,
			image: item.image,
			price: item.price,
		});
	});
});

events.on(Events.OPEN_ORDER, () => {
	appData.order.total = appData.getTotal();
	modal.render({
		content: order.render({
			payment: '',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IContactsForm; value: string }) => {
		appData.setContactsField(data.field, data.value);
	}
);

events.on(Events.ORDER_ERRORS, (errors: Partial<IOrder>) => {
	const { address, payment } = errors;
	order.valid = !address && !payment;
	order.errors = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('; ');
});

events.on(Events.CONTACTS_ERRORS, (errors: Partial<IOrder>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

events.on(Events.UPDATE_PAYMENT, (button: HTMLButtonElement) => {
	appData.setOrderField('payment', button.name);
});

events.on(Events.MAKE_ORDER, () => {
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on(Events.PAY_ORDER, () => {
	api
		.orderItems(appData.order)
		.then((result) => {
			const sum = appData.getTotal();
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});
			appData.clearBasket();
			events.emit(Events.UPDATE_BASKET);
			modal.render({
				content: success.render({
					total: sum,
				}),
			});
		})
		.catch((err) => {
			console.error(err);
		});
});

events.on(Events.OPEN_BASKET, () => {
	modal.render({
		content: basket.render(),
	});
});

events.on(Events.UPDATE_BASKET, () => {
	page.counter = appData.order.items.length;

	basket.items = appData.order.items.map((id) => {
		const item = appData.catalog.find((item) => item.id === id);
		const itemIndex = appData.order.items.indexOf(id) + 1;
		const card = new ItemCard('card', cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit(Events.TOGGLE_ITEM, item);
			},
		});
		return card.render({
			index: itemIndex,
			title: item.title,
			price: item.price,
		});
	});
	basket.selected = appData.order.items;
	basket.total = appData.getTotal();
});

events.on(Events.TOGGLE_ITEM, (item: IItem) => {
	appData.toggleAddedItem(item.id, appData.isItemAdded(item));
	events.emit(Events.UPDATE_BASKET);
});

events.on(Events.PREVIEW_CARD, (item: IItem) => {
	appData.setPreview(item);
});

events.on(Events.UPDATE_PREVIEW, (item: IItem) => {
	const card = new ItemCard('card', cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit(Events.TOGGLE_ITEM, item);
			modal.close();
			events.emit(Events.CLOSE_MODAL);
		},
	});

	modal.render({
		content: card.render({
			category: item.category,
			title: item.title,
			image: item.image,
			price: item.price,
			description: item.description,
			button: appData.setButtonText(item),
		}),
	});
});

events.on(Events.OPEN_MODAL, () => {
	page.locked = true;
});

events.on(Events.CLOSE_MODAL, () => {
	page.locked = false;
});

api
	.getItemList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});
