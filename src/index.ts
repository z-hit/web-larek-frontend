import './scss/styles.scss';

import { LarekAPI } from './components/LarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppState, CatalogChangeEvent } from './components/AppState';
import { Page } from './components/Page';
import { ItemCardCatalog } from './components/Card';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { Tabs } from './components/common/Tabs';
import { IItem, IOrderForm } from './types';
import { Order } from './components/Order';
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
const tabsTemplate = ensureElement<HTMLTemplateElement>('#tabs');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const appData = new AppState({}, events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const tabs = new Tabs(cloneTemplate(tabsTemplate), {
	onClick: () => {
		events.emit('payment:changed');
	},
});
const order = new Order(cloneTemplate(orderTemplate), events);
//const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new ItemCardCatalog(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			description: item.description,
		});
	});
});

// Отправлена форма заказа
events.on('order:submit', () => {
	api
		.orderItems(appData.order)
		.then(() => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
					appData.clearBasket();
					events.emit('auction:changed');
				},
			});

			modal.render({
				content: success.render({}),
			});
		})
		.catch((err) => {
			console.error(err);
		});
});

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
	const { email, phone } = errors;
	order.valid = !email && !phone;
	order.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось одно из полей
events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// Открыть форму заказа
events.on('order:open', () => {
	modal.render({
		content: order.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

// Открыть закрытые лоты
events.on('basket:open', () => {
	modal.render({
		content: createElement<HTMLElement>('div', {}, [
			tabs.render({
				selected: 'closed',
			}),
			basket.render(),
		]),
	});
});

// Открыть лот
events.on('card:select', (item: IItem) => {
	appData.setPreview(item);
});

// Изменен открытый выбранный лот
events.on('preview:changed', (item: IItem) => {
	const showItem = (item: IItem) => {
		const card = new AuctionItem(cloneTemplate(cardPreviewTemplate));
		const auction = new Auction(cloneTemplate(auctionTemplate), {
			onSubmit: (price: number) => {
				item.placeBid(price);
				auction.render({
					status: item.status,
					time: item.timeStatus,
					label: item.auctionStatus,
					nextBid: item.nextBid,
					history: item.history,
				});
			},
		});

		modal.render({
			content: card.render({
				title: item.title,
				image: item.image,
				description: item.description.split('\n'),
				status: auction.render({
					status: item.status,
					time: item.timeStatus,
					label: item.auctionStatus,
					nextBid: item.nextBid,
					history: item.history,
				}),
			}),
		});

		if (item.status === 'active') {
			auction.focus();
		}
	};

	if (item) {
		api
			.getLotItem(item.id)
			.then((result) => {
				item.description = result.description;
				item.history = result.history;
				showItem(item);
			})
			.catch((err) => {
				console.error(err);
			});
	} else {
		modal.close();
	}
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

api
	.getItemList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});
