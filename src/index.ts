import './scss/styles.scss';

import { LarekAPI } from './components/LarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppState, CatalogChangeEvent } from './components/AppState';
import { Page } from './components/Page';
import { IItemCard, ItemCard } from './components/Card';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { IItem, IOrderForm } from './types';
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

events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new ItemCard('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			category: item.category,
			title: item.title,
			image: item.image,
			price: item.price,
			isAdded: item.isAdded,
		});
	});
});

events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

events.on('basket:changed', () => {
	page.counter = appData.order.items.length;

	basket.items = appData.order.items.map((id) => {
		const item = appData.catalog.find((item) => item.id === id);
		const card = new ItemCard('card', cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit('basket:remove', item);
			},
		});
		return card.render({
			index: appData.order.items.length,
			title: item.title,
			price: item.price,
		});
	});
	basket.selected = appData.order.items;
	basket.total = appData.getTotal();
});

events.on('basket:remove', (item: IItem) => {
	appData.toggleAddedItem(item.id, true);
	events.emit('basket:changed');
	console.log(appData.order.items);
});

events.on('basket:add', (item: IItem) => {
	appData.toggleAddedItem(item.id, false);
	events.emit('basket:changed');
	console.log(appData.order.items);
});

events.on('card:select', (item: IItem) => {
	appData.setPreview(item);
});

events.on('preview:changed', (item: IItem) => {
	const card = new ItemCard('card', cloneTemplate(cardPreviewTemplate), {
		onClick: () => events.emit('basket:add', item),
	});

	modal.render({
		content: card.render({
			category: item.category,
			title: item.title,
			image: item.image,
			price: item.price,
			description: item.description,
		}),
	});
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
