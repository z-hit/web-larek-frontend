# Проектная работа "Веб-ларек"

Ссылка на проект: https://github.com/z-hit/web-larek-frontend

Проект магазина товаров для Веб-разработчиков. В магазине можно выбирать товары из Каталога, добавлять их в Коризну, переходить в Коризну и оформлять покупку путем ввода контактных данных и выбора способа оплаты. При желании можно удалить товары из Коризны, или добавить новые к уже имеющимся.

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура

Проект реализовать на основе принципов MVС (Model, View, Controller).

В части Model представлен абстрактный класс Model и реализующий его AppState, отвещающий за хранение ключевых данных o всех товарах и о заказе, необходимые для взаимодействия с сервером и осуществеления бизнес логики.

В части View представлен абстрактный класс Component, который реализуется в нескольких классах ++++++++++

В части Controller представлен класс EventEmitter, который отслеживает изменения состояния приложения и оповещает о них необходимые компоненты приложения, которые также меняются в ответ на произошедшие изменения.

## URL схема с архитектурой проекта

Ссылка на UML схему с Архитектурой проекта:
https://github.com/z-hit/web-larek-frontend/blob/0fd4a15151fa457292c99c6b88a8fd888ee3920a/UML%20Web%20Larek.jpg

## Базовый код

## API и Котроллер Событий (Controller)

2. Класс Api реализует взаимодействие с Сервером и имеет следующие поля:
   readonly baseUrl: string - поле с базовым адресом сервера;
   protected options: RequestInit - поле опций вызова запроса.

   Конструктор constructor(baseUrl: string, options: RequestInit = {}) - принимает в качестве аргументов и устанавливает в свои поля базовый адрес сервера и описание для формирования запроса.

   Метод get(uri: string) - принимает адрес сервера и возвращает изначальный список товаров.
   Метод post(uri: string, data: object, method: ApiPostMethods = 'POST') - принимает адрес сервера, обект с данными(order) и метод взаимодействия с сервером(POST), метод возволяет фоормить заказ путем отправки на Сервер данных о заказе.
   Метод handleResponse(response: Response): Promise<object> - проверяет статус ответа и возвращает Promise с объектом данных: при успешном ответе возвращает полученные с срвера данные, преобразуя их в формат json; при ошибке работе с сервером, возвращает сообщение об ошибке.

1. Класс EventEmitter позволяет компонентам подписываться на события, уведомлять других  
   подписчиков о произошедших событиях и инициировать изменения. Класс имеет поле:
   \_events: Map<EventName, Set<Subscriber>> - объект со списком событий и обработчиками, который создается конструктором класса.

   Класс включает в себя методы:
   on<T extends object>(eventName: EventName, callback: (event: T) => void) - принимает событие и функцию обработчик, устанавливает обработчик для этого события;
   off(eventName: EventName, callback: Subscriber) - принимает событие и обработчик, в результате снимает обработчки с этого события, при отсутствии обработчкиво удаляет событие полностью;
   emit<T extends object>(eventName: string, data?: T) - принимает событие и данные, инициирует событие с принятыми данными;
   onAll(callback: (event: EmitterEvent) => void) - принимает обработчки событий как аргумент, устанавливает его для всех компонентов для слушания всех событий;
   offAll() - сбрасывает все обработчкик;
   trigger<T extends object>(eventName: string, context?: Partial<T>) - принимает событие и данные, слушает коллбэк триггер, который генерирует событие при своем вызове.

## Компоненты модели данных (Model)

1. Model
   В части Модели данных представлен абстрактный класс Model. Он принимает в конструктор constructor(data: Partial<T>, protected events: IEvents) определенный тип данных и список событий, которые добавляет в создаваемый объект.
   Имеет метод emitChanges(event: string), который принимает название события и оповещает подписчиков об изменнеиях модели.

2. AppState
   Класс AppState реализует класс Model и сожержит в себе данные проекта, а именно поля:
   catalog: IItem[] - изначальный каталог товаров, полученный с сервера;
   basket: ItemID[] - список id товаров, добавленных в корзину;
   order: IOrder - полные данные о заказе типа IOrder;
   loading: boolean - статус процесса загрузки данных;
   formErrors: FormErrors = {} - список ошибок, возникших при работе с сервером;
   preview: string | null - статус попапа.

Мутоды AppState:
setCatalog(items: IItem[]): void - получает список изначальных карточек от сервера и сохраняет их в каталог в виде реализации интерфейса IItem;
toggleBasketItem(id: ItemID, isAdded: boolean): void - получает id товара и статус его добавленности в корзину, позволяет добавлять или удалять товар из корзины, в зависимости от статуса;
clearBasket(): void - очищает корзину от всех товаров;
getBasketList(): ItemID[] - возвращает полный список id товаров, добавленных в корзину;
setOrderField(field: keyof IOrder, value: string): void - принимает название поля и текст, затем устанавливает текст в соответствующее поле информации о заказе в формате интерфейса IOrder;
validateOrder(): boolean - возвращает boolean в зависимости от того, прошли ли поля ввода валидацию;
getTotal(): number - возвращает полную стоимость товаров, добавленных в корзину.

## Компоненты представления (View)

1. Component<T>
   Область компонентов представлена абстрактным классом Component<T>, который принимает в контруктор контейнер типа HTMLElement. Класс определяет базовые методы для всех визуальных компонентов приложения.
   Класс имеет следующие методы:
   toggleClass(element: HTMLElement, className: string) - принимает элемент и имя класса, позволяет добавлять или удалять класс у элемента, в зависимости от того, есть этот уласс у элемента уже или нет;
   setText(element: HTMLElement, value: unknown) - принимает элемент и данные неизвестного типа, позволяет вставить эти данные внутрь элемента как текст или дочерний элемент(ы);
   setDisabled(element: HTMLElement, state: boolean) - принимает элемент и статут активации, далет элемент неактивным или наоборот активным в зависимости от статуса путем добавления или удаления атрибута disabled;
   setHidden(element: HTMLElement) - принимает элемент, делает элемент скрытым путем добавления в стиль элемента атрибута disolay: "none";
   setVisible(element: HTMLElement) - принимает элемент и делает элемент видимым путем удаления из стилей атрибута display;
   setImage(element: HTMLImageElement, src: string, alt?: string) - принимает элемент, ссылку на адрес, тест с описанием (опционально), позволяет устанавливать изобюражение в элемент;
   render(data?: Partial<T>): HTMLElement - принимает опционально данные определенного типа, возвращает корневой DOM элемент.

2. Page
   Класс Page наследует от класса Component и представляет собой визуальную реализацию главной страницы приложения. Имеет следующие поля:
   \_logo: HTMLElement - логотипа сайта;
   \_catalog: HTMLElement - каталог товаров;
   \_basket: HTMLElement - кнопка для перехода в корзину;
   \_wrapper: HTMLElement - обертка главной страницы;
   locked: boolean - статус блокировки экрана от прокрутки (при открытии модальных окон).

Конструктор класса constructor(container: HTMLElement, protected events: IEvents) принимает элемент контейнера и список событий, определяет и назначает HTMLElement для полей logo, catalog, basket, wrapper, а также добавляет слушателя событий на кнопку корзины и каталог с товарами.

Класс имеет методы:
set catalog(items: HTMLElement[]) - принимает список элементов товаров и добавляет их в каталог;
set locked(value: boolean) - принимает boolean и регулирует блокировку экрана от прокрутки;
set logo(url: string, alt?: string) - принимает адрес картинки и альтернативный текст при наличии, устанавливает адрес кратинки и альтернативнй текст в элемент.

3. ItemCard
   Класс ItemCard наследует от класса Component и представляет себя визуальную реализацию индивидульной карточки товара. Имеет следующие поля:
   id: string - уникальный айди товара;
   title: HTMLElement - название товара;
   price: HTMLElement - цена товара;
   description?: HTMLElement - описание товара (опционально);
   image?: HTMLImageElement - картинка товара (опционально);
   category?: HTMLElement - категория товара (опционально);
   counter?: HTMLElement - счетчик позиции товара в списке (опционально);
   isAdded: boolean - статус товара - добавлен в корзину или нет;
   button?: HTMLButtonElement - кнопка взаимодействия с товаром (опционально);

Конструктор класса constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) - принимает аргументами название блока для создания единого стиля названия дочерних элементов, контейнер, в котором создается карточка, а также список действий, доступных с элементов. Контруктор осуществляет создание всех дочерних HTML элементов класса (title, price, description, image, category, counter, button), а также вешает обработчики событий на кнопку или всю карточку товара.

Класс имеет методы:
set id(value: string) - принимает id товара и добавляет его как атрибут элемента;
set title(value: string) - принимает текст названия товара и устанавливает в заголовок товара;
set price(value: number) - принимает цену товара, ддобавляет к цене текст и вставляет в элемент с ценой товара;
set description(value: string) - принимает текст описания товара и всталяет в элемент с описанием товара;
set image(value: string) - принимает адрес картинки товара и вставляет ее и описание картинки в элемент картинки товара;
set category(value: string) - принимает текст категории товара и всталяет его в элемент с категорией товара;
set counter() - определяет порядковый номер элемента в списке элементов (в Корзине) и вставляет его в элемент с порядковым номером.
set button(title?: string, image?: string, callback: Function) - принимает название кнопки (опционально), адрес картинки (опционально) и колбэк функцию, вставляет название кнопки или картику в элемент кнопки и навешивает функцию;
toggleIsAdded() - изменяет состяние товара между добавленным в корзину или нет;
get id(): string - возвращает id товара.

a. ItemCardCatalog
Класс ItemCardCatalog наследует от класса ItemCard и является визуальным представлением карточки товара в каталоге на главной странице. В данном классе конструктор визуально реализует родительские поля title, price, image, category.

b. ItemCardPreview
Класс ItemCardPreview наследует от класса ItemCard и является визуальным представлением карточки товара в модальном окне просмотра товара. В данном классе конструктор визуально реализует родительские поля title, price, image, category, description, button.

c. ItemCardBasket
Класс ItemCardBasket наследует от класса ItemCard и является визуальным представлением карточки товара в списке товаров в Корзине. В данном классе конструктор визуально реализует родительские поля counter, title, price, button.

4. Form<T>
   Класс Form<T> наследует от класса Component и является визуальным представлением формы для ввода информации пользователя о заказе. Класс имеет поля:
   valid: boolean - хранит boolean о прохождении валидации заполнения формы;
   \_submit: HTMLButtonElement - кнопка отправки введенных данных;
   \_errors: HTMLElement - элемент для отображения ошибок заполнения формы.

Конструктор класса constructor(protected container: HTMLFormElement, protected events: IEvents) - принимает аргументами элемент контейнер и список событий, создает HTML элементы кнопки и вывода сообщения об ошибках, а также навешивает слушателей событий на поля ввода и на кнопку submit для отправки данных в AppState.

Класс имеет методы:
onInputChange(field: keyof T, value: string) - принимает поле и строчные данные, обновляет данные поля ввода в соответствии с введенными пользователем;
set valid(value: boolean) - принимает статус валидации и активирует (если валидация подтверждена) или деактивирует (если валидация не подтверждена) возможность отправки данных кнопкой submit;
set errors(value: string) - принимает текст ошибки и устанавливает его в элемент показа ошибки заполнения формы;
render(state: Partial<T> & IFormState) - принимает объект со всеми данными и возвращает готовый элемент формы.

a. Order
Класс Order наследует от класса Form и визуально реализует элемент заполнения формы заказа с указанием способа оплаты и адреса доставки. Имеет поля:

Конструктор класса constructor(container: HTMLFormElement, events: IEvents) принимает контейнер и события и создает форму через родительский конструктор, добавляя туда соответствующие поля ввода.

Класс имеет методы:
set payment(value: string) - получает строку способа оплаты и сохраняет его, выделяя соответствующую кнопку;
set address(value: string) - получает строку адреса и сохраняет адрес в поле ввода.

b. Contacts
Класс Contacts наследует от класса Form и визуально реализует элемент заполнения контактных данных пользователя.

Конструктор класса constructor(container: HTMLFormElement, events: IEvents) принимает контейнер и события и создает форму через родительский конструктор, добавляя туда соответствующие поля ввода.

Класс имеет методы:
set email(value: string) - получает строку адреса почты и сохраняет ее в поле ввода;
set phone(value: string) - получает строку с номером телефона и сохраняет его в поел ввода.

5. Modal
   Класс Modal наследует от Component и является визуальной реализацией элементат модального окна, отрываемого для просмотра товара, просмотра корзины и оформления заказа.

Класс имеет поля:
\_closeButton: HTMLButtonElement - элемент кнопки закрытия модального окна;
\_content: HTMLElement - содержание модального окна.

Конструктор constructor(container: HTMLElement, protected events: IEvents) - принимает контейнер и список событий, в результате создает элемент кнопки закрытия и элемент для хранения содержания модального окна. Конструктор также устанавливает слушателей событий на кнопку закрытия, на элемент и содержание.

Класс имеет методы:
set content(value: HTMLElement) - принимает элемент и устанавливает его как содержание модального окна;
open() - открывает модальное окно;
close() - закрывает модальное окно и очищает его содержание;
render(data: IModalData): HTMLElement - принимает данные модального окна и возвращает готовый элемент модального окна.

6. Success
   Класс Success наследует от Component и является визуальным представление окна информирования об успешно совершенной покупке.
   Класс имеет поле:
   \_close: HTMLElement - кнопка закрытия уведомления с переходом на главную старницу приложения.

Конструктор класса constructor(container: HTMLElement, actions: ISuccessActions) принимает контейнер и список действий, создает элемент через родительский конструктор и добавляет кнопку, к которой добавляет список действий из аргументов.

7. Basket
   Класс Basket наследует от Component и является визуальным представлением открытой корзины с товарами, добавленными пользователем. Класс имеет поля:
   items: HTMLElement[] - коллекция карточек товаров, добавленных пользователем;
   selected: string[] - маркер для омтетки того, есть ли в корзине товары;
   \_list: HTMLElement - список карточек с товарами, добавленными пользователем;
   \_total: HTMLElement - общая стоимость всех товаров в корзине;
   \_button: HTMLElement - кнопка для перехода к оформлению заказа.

Конструктор класса constructor(container: HTMLElement, protected events: EventEmitter) принимает аргументами контейнер и список событий, создает элемент для списка товаров, определяет элементы для суммы \_total и кнокпи \_button, навешивает обработчки событий на кнопку.

Класс имеет методы:
set items(items: HTMLElement[]) - принимает массив элементов карточек, добавляет карточки в список карточек корзины;
set selected(items: string[]) - принимает массив карточек, меняет статус кнопки между актиной и нет в зависимости от того, есть ли в корзине товары или нет;
set total(total: number) - принимает число сумму стоимости всех товаров, устанавливает сумму в соответствующий элемент.

8. Tabs
   Класс Tabs наследует Component и реализует функционал выбора опции путем переключения между кнопками. Класс имеет поле:
   \_buttons: HTMLButtonElement[] - коллекция кнопок, между которыми будет проходит переключение.

Конструктор класса constructor(container: HTMLElement, actions?: TabActions) принимает контейнер и список действий для кнопок, создает кнопки и навешивает на каждую слушатель событий.

Имеет методы:
set selected(name: string) - принимает навзание кнопки и устанавливает ее выбранной, также делая ее неактивной для выбора (т к она уже выбрана).

## Основные типы данных

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

interface IPage {
catalog: HTMLElement[];
locked: boolean;
}

export interface IItemCard {
id: ItemID;
title: string;
price: number;
description?: string;
image?: string;
category?: Category;
index?: number;
isAdded: boolean;
}

export type TabState = {
selected: string;
}
export type TabActions = {
onClick: (tab: string) => void;
}

interface ISuccess {
total: number;
}

interface ISuccessActions {
onClick: () => void;
}

interface IModalData {
content: HTMLElement;
}

interface IFormState {
valid: boolean;
errors: string[];
}

interface IBasketView {
items: HTMLElement[];
total: number;
selected: string[];
}

type EventName = string | RegExp;
type Subscriber = Function;
type EmitterEvent = {
eventName: string;
data: unknown;
};

export interface IEvents {
on<T extends object>(event: EventName, callback: (data: T) => void): void;
emit<T extends object>(event: string, data?: T): void;
trigger<T extends object>(
event: string,
context?: Partial<T>
): (data: T) => void;
}
