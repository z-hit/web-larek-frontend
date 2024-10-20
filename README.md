# Проектная работа "Веб-ларек"

## !!! В данной проектной работе был отточен навык анализа чужого кода и составления подробного описания проекта на основе ООП, весь текст ниже написан мною на основе анализа выданного готового кода !!!

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
- src/scss/styles.scss — корневой файл стилей
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

Проект реализовать на основе принципов **MVС** (Model, View, Controller).

В части **Model** представлен абстрактный класс `Model<T>` и реализующий его `AppState`, отвещающий за хранение ключевых данных o всех товарах и о заказе, необходимые для взаимодействия с сервером и осуществеления бизнес логики.

В части **View** представлен абстрактный класс `Component<T>`, который реализуется в нескольких классах - `Page`, `Modal`, `ItemCard`, `Form<T>`, `Basket`, `Success`. Классы осуществляют создание визуального образа приложения в виде различных компонентов.

В части **Controller** представлен класс `EventEmitter`, который отслеживает изменения состояния приложения (события), вносит изменения в данные Модели и оповещает о них необходимые компоненты приложения, которые меняются в соответствии с произошедшим событием.

Класс `LarekAPI` который наследует от класса `Api` осуществляет взаимодействие приложения с сервером путем передачи приложению изначальных данных о товарах для каталога, а также путем приема данных о заказе, введенных пользователем. Взаимодействие происходит по принципу promise-based flow.

### URL схема с архитектурой проекта

[Ссылка на **UML** схему с Архитектурой проекта >>](https://github.com/z-hit/web-larek-frontend/blob/main/UML%20Web%20Larek%20MVP.jpg)

## Базовый код - API и Котроллер Событий (Controller)

### **Api**

Класс `Api` осуществляет непосредственное взаимодействие с Сервером и имеет следующие поля:

- `readonly baseUrl: string` - поле с базовым адресом сервера;
- `protected options: RequestInit` - поле опций вызова запроса.

  Конструктор `constructor(baseUrl: string, options: RequestInit = {})` - принимает в качестве аргументов базовый адрес url и опции запросов, и устанавливает в свои поля базовый адрес сервера и описание для формирования запроса.

  Имеет методы:

- `get(uri: string)` - принимает адрес сервера и возвращает изначальный список товаров.
- `post(uri: string, data: object, method: ApiPostMethods = 'POST')` - принимает адрес сервера, обект с данными заказа и метод взаимодействия с сервером(POST), метод возволяет фоормить заказ путем отправки на Сервер данных о заказе.
- `handleResponse(response: Response): Promise<object>` - принимает ответ сервера, проверяет статус ответа и возвращает Promise с объектом данных: при успешном ответе возвращает полученные с срвера данные, преобразуя их в формат json; при ошибке работе с сервером, возвращает сообщение об ошибке.

### **LarekAPI**

Класс `LarekAPI` наследует от `Api` и предоставляет методы для взаимодействия приложения и сервера

- `readonly cdn: string` - поле с адресом для оптимальной закгрузки картинок;

  Конструктор `constructor(cdn: string, baseUrl: string, options?: RequestInit)` - принимает в качестве аргументов адрес для оптимальной закгрузки картинок, базовый адрес url и опции запросов, и устанавливает в свои поля адреса и описание для формирования запроса.

  Имеет методы:

- `getItem(id: string): Promise<IItem>` - принимает id товара, отправляет запрос на получение информацию о конкретном товаре, возвращает промис с товаром;
- `getItemList(): Promise<IItem[]>` - запрашивает получение полного списка товаров, возвращает промис со списком товаров;
- `orderItems(order: IOrder): Promise<IOrderResult>` - отправляет данные о заказе, возвращает промис с данными об успешном заказе;

### **EventEmitter**

Класс `EventEmitter` позволяет компонентам подписываться на события, уведомлять других  
 подписчиков о произошедших событиях и инициировать изменения. Класс имеет поле:

- `_events: Map<EventName, Set<Subscriber>>` - объект со списком событий и обработчиками, который создается конструктором класса.

  Класс включает в себя методы:

- `on<T extends object>(eventName: EventName, callback: (event: T) => void)` - принимает событие и функцию обработчик, устанавливает обработчик для этого события;
- `off(eventName: EventName, callback: Subscriber)` - принимает событие и обработчик, в результате снимает обработчки с этого события, при отсутствии обработчкиво удаляет событие полностью;
- `emit<T extends object>(eventName: string, data?: T)` - принимает событие и данные, инициирует событие с принятыми данными;
- `onAll(callback: (event: EmitterEvent) => void)` - принимает обработчки событий как аргумент, устанавливает его для всех компонентов для слушания всех событий;
- `offAll()` - сбрасывает все обработчкик;
- `trigger<T extends object>(eventName: string, context?: Partial<T>)` - принимает событие и данные, слушает коллбэк триггер, который генерирует событие при своем вызове.

## Компоненты модели данных (Model)

### **Model<T>**

В части Модели данных представлен абстрактный дженерик класс `Model<T>`. Он принимает в конструктор `constructor(data: Partial<T>, protected events: IEvents)` определенный тип данных T и список событий, которые добавляет в создаваемый объект.
Имеет метод `emitChanges(event: string)`, который принимает название события и оповещает подписчиков об изменнеиях модели.
Класс служит основай дял элемента `AppState`, содержащего всю ключевую информацию для осуществления бизнес-логики.

### **AppState**

Класс `AppState` реализует класс `Model<T>` и сожержит в себе ключевые данные проекта, а именно поля:

- `catalog: Item[]` - каталог товаров, полученный с сервера;
- `order: IOrder | null` - полные данные о заказе типа IOrder;
- `preview: string | null` - поле для id товара для preview
- `formOrderErrors: FormOrderErrors = {}` - список ошибок при заполнении формы заказа
- `formContactsErrors: FormContactsErrors = {}` - список ошибок при заполнении формы контактов

Методы класса:

- `isItemAdded(item: IItem)` - проверяет, добавлен ли товар в корзину;
- `setButtonText(item: IItem)` - устанавливает текст кнопки;
- `setPreview(item: IItem)` - вызывает модальное окно с выбранной карточкой;
- `toggleAddedItem(id: string, isAdded?: boolean)` - добавляет или удаляет товар из корзины;
- `setCatalog(items: IItem[]): void` - получает список изначальных карточек от сервера и сохраняет их в каталог в виде реализации интерфейса IItem;
- `clearBasket(): void` - очищает корзину от всех товаров;
- `setOrderField(field: keyof IOrder, value: string): void` - принимает название поля и текст, затем устанавливает текст в соответствующее поле информации о заказе в формате интерфейса IOrderForm;
- `setField(field: keyof IOrder, value: string): void` - принимает название поля и текст, затем устанавливает текст в соответствующее поле информации о контактах в формате интерфейса IContactsForm;
- `setContactsField(field: keyof IContactsForm, value: string)`
- `validateOrder()` - проверяет валидность заполнения формы заказа;
- `validateContacts()` - проверяет валидность заполнения формы контактов;
- `getTotal(): number` - возвращает полную стоимость товаров, добавленных в корзину.

## Компоненты представления (View)

### **Component<T>**

Область компонентов представлена абстрактным дженерик классом `Component<T>`, который принимает в контруктор контейнер HTMLElement типа данных T. Класс определяет базовые методы для всех визуальных компонентов приложения.

Класс имеет следующие методы:

- `toggleClass(element: HTMLElement, className: string)` - принимает элемент и имя класса, позволяет добавлять или удалять класс у элемента, в зависимости от того, есть этот класс у элемента уже или нет;
- `addClass(element: HTMLElement, className: string)` - принимает элемент и имя класса, позволяет добавлять класс эелементу;
- `setText(element: HTMLElement, value: unknown)` - принимает элемент и данные неизвестного типа, позволяет вставить эти данные внутрь элемента как текст или дочерний элемент(ы);
- `setDisabled(element: HTMLElement, state: boolean)` - принимает элемент и статут активации, далет элемент неактивным или наоборот активным в зависимости от статуса путем добавления или удаления атрибута disabled;
- `setHidden(element: HTMLElement)` - принимает элемент, делает элемент скрытым путем добавления в стиль элемента атрибута disolay: "none";
- `setVisible(element: HTMLElement)` - принимает элемент и делает элемент видимым путем удаления из стилей атрибута display;
- `setImage(element: HTMLImageElement, src: string, alt?: string)` - принимает элемент, ссылку на адрес, тест с описанием (опционально), позволяет устанавливать изобюражение в элемент;
- `render(data?: Partial<T>): HTMLElement` - принимает опционально данные определенного типа, возвращает DOM элемент.

### **Page**

Класс `Page` наследует от класса `Component<T>` и представляет собой визуальную реализацию главной страницы приложения. Имеет следующие поля:

- `_counter: HTMLElement` - счетчик товаров в корзине;
- `_catalog: HTMLElement` - каталог товаров;
- `_basket: HTMLElement` - кнопка для перехода в корзину;
- `_wrapper: HTMLElement` - обертка главной страницы(для блокировки от прокрутки);

  Конструктор класса `constructor(container: HTMLElement, protected events: IEvents)` принимает элемент контейнера и список событий, определяет и назначает HTMLElement для полей catalog, basket, wrapper, а также добавляет слушателя событий на кнопку корзины и каталог с товарами.

  Класс имеет методы:

- `set counter(value: number)` - принимает число и устанавливает в поле счетчика количества товаров в корзине;
- `set catalog(items: HTMLElement[])` - принимает массив элементов товаров и добавляет их в каталог;
- `set locked(value: boolean)` - принимает boolean и регулирует блокировку экрана от прокрутки;

### **ItemCard<T>**

Класс `ItemCard<T>` наследует от класса `Component<T>` и представляет себя визуальную реализацию индивидульной карточки товара. Это дженерик класс, приниающий определенный тип данных T в зависимости от типа создаваемой карточки. Имеет следующие поля:

- `_title: HTMLElement` - название товара;
- `_price: HTMLElement` - цена товара;
- `_description?: HTMLElement` - описание товара (опционально);
- `_image?: HTMLImageElement` - картинка товара (опционально);
- `_category?: HTMLElement` - категория товара (опционально);
- `_index?: HTMLElement` - счетчик позиции товара в списке корзины (опционально);
- `_button?: HTMLButtonElement` - кнопка взаимодействия с товаром (опционально);

  Конструктор класса `constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions)` - принимает аргументами название блока для создания единого стиля названия дочерних элементов, контейнер, в котором создается карточка, а также список действий, доступных с элементом. Контруктор осуществляет создание всех дочерних HTML элементов внутри контейнера карточки (title, price, description, image, category, counter, button), а также вешает обработчики событий на кнопку или всю карточку товара.

  Класс имеет методы:

- `set button(value: string)` - принимает такст, устанавливает его в название кнопки;
- `set id(value: string)` - принимает id товара и добавляет его как атрибут элемента;
- `set title(value: string)` - принимает текст названия товара и устанавливает в заголовок товара;
- `set price(value: number)` - принимает цену товара, ддобавляет к цене текст и вставляет в элемент с ценой товара;
- `set description(value: string)` - принимает текст описания товара и всталяет в элемент с описанием товара;
- `set image(value: string)` - принимает адрес картинки товара и вставляет ее и описание картинки в элемент картинки товара;
- `set category(value: string)` - принимает текст категории товара и всталяет его в элемент с категорией товара;
- `set index()` - определяет порядковый номер элемента в списке элементов (в Корзине) и вставляет его в элемент с порядковым номером.
- `get id(): string` - возвращает id товара.

### **Form<T>**

Класс `Form<T>` наследует от класса `Component<T>` и является визуальным представлением формы для ввода информации пользователя о заказе. Это дженерик класс, который принимает определенный типа T.

Класс имеет поля:

- `_submit: HTMLButtonElement` - кнопка отправки введенных данных;
- `_errors: HTMLElement` - элемент для отображения ошибок заполнения формы.

  Конструктор класса `constructor(protected container: HTMLFormElement, protected events: IEvents)` - принимает аргументами элемент контейнер и список событий, создает HTML элементы кнопки и вывода сообщения об ошибках, а также навешивает слушателей событий на поля ввода и на кнопку submit.

  Класс имеет методы:

- `onInputChange(field: keyof T, value: string)` - принимает поле и строчные данные, обновляет данные поля ввода в соответствии с введенными пользователем;
- `set valid(value: boolean)` - принимает статус валидации и активирует (если валидация подтверждена) или деактивирует (если валидация не подтверждена) возможность отправки данных кнопкой submit;
- `set errors(value: string)` - принимает текст ошибки и устанавливает его в элемент показа ошибки заполнения формы;
- `render(state: Partial<T> & IFormState)` - принимает объект определенного типа и и возвращает готовый элемент формы.

#### **Order**

Класс `Order` наследует от класса `Form<T>` и визуально реализует элемент заполнения формы заказа с указанием способа оплаты и адреса доставки.

Имеет поля:

- `_payment: HTMLButtonElement[]` - кнопки выбора способа оплаты;
- `_address: HTMLInputElement` - поле ввода адреса доставки;

Конструктор класса `constructor(container: HTMLFormElement, events: IEvents)` принимает элемент контейнер и события и создает форму через родительский конструктор, добавляя туда кнопки выбора способа оплаты и поле ввода адреса.

Класс имеет методы:

- `set address(value: string)` - получает строку адреса и сохраняет адрес в поле ввода.

#### **Contacts**

Класс `Contacts` наследует от класса `Form<T>` и визуально реализует элемент заполнения контактных данных пользователя.

Имеет поля:

- `_email: HTMLInputElement` - поле для адреса электронной почты;
- `_phone: HTMLInputElement` - поле для номера телефона;

Конструктор класса `constructor(container: HTMLFormElement, events: IEvents)` принимает контейнер и события и создает форму через родительский конструктор, добавляя туда соответствующие поля ввода.

Класс имеет методы:

- `set email(value: string)` - получает строку адреса почты и сохраняет ее в поле ввода;
- `set phone(value: string)` - получает строку с номером телефона и сохраняет его в поле ввода.

### **Modal**

Класс `Modal` наследует от `Component<T>` и является визуальной реализацией элемента модального окна, отрываемого для просмотра товара, просмотра корзины и оформления заказа.

Класс имеет поля:

- `_closeButton: HTMLButtonElement` - элемент кнопки закрытия модального окна;
- `_content: HTMLElement` - содержание модального окна.

  Конструктор `constructor(container: HTMLElement, protected events: IEvents)` - принимает контейнер и список событий, в результате создает элемент кнопки закрытия и элемент для хранения содержания модального окна. Конструктор также устанавливает слушателей событий на кнопку закрытия, на элемент и содержание.

  Класс имеет методы:

- `set content(value: HTMLElement)` - принимает элемент и устанавливает его как содержание модального окна;
- `open()` - открывает модальное окно;
- `close()` - закрывает модальное окно и очищает его содержание;
- `render(data: IModalData): HTMLElement` - принимает данные модального окна и возвращает готовый элемент модального окна.

### **Success**

Класс `Success` наследует от `Component<T>` и является визуальным представление окна информирования об успешно совершенной покупке.
Класс имеет поле:

- `_close: HTMLElement` - кнопка закрытия уведомления с переходом на главную старницу приложения;
- `_total: HTMLElement` - отображение суммы отправленного заказа.

Конструктор класса `constructor(container: HTMLElement, actions: ISuccessActions)` принимает контейнер и список действий, создает элемент через родительский конструктор и добавляет кнопку, к которой добавляет список действий из аргументов. 
Имеет метод:

- `set total(total: number)` - принимает сумму, устанавливает в значение суммы купленных товаров в соответствующий элемент.

### **Basket**

Класс `Basket` наследует от `Component<T>` и является визуальным представлением открытой корзины с товарами, добавленными пользователем.

Класс имеет поля:

- `_list: HTMLElement[]` - контейнер для списка карточек с товарами, добавленными пользователем;
- `_total: HTMLElement` - общая стоимость всех товаров в корзине;
- `_button: HTMLElement` - кнопка для перехода к оформлению заказа.

  Конструктор класса `constructor(container: HTMLElement, protected events: EventEmitter)` принимает аргументами контейнер и список событий, создает элемент для списка товаров, определяет элементы для суммы `_total` и кнокпи `_button`, навешивает обработчки событий на кнопку.

  Класс имеет методы:

- `set items(items: HTMLElement[])` - принимает массив элементов карточек, добавляет карточки в список карточек корзины;
- `set selected(items: string[])` - принимает массив карточек, меняет статус кнопки между актиной и нет в зависимости от того, есть ли в корзине товары или нет;
- `set total(total: number)` - принимает число сумму стоимости всех товаров, устанавливает сумму в соответствующий элемент.

## Основные типы данных

_событие изменения каталога_

```
type CatalogChangeEvent = {
catalog: Item[]
}
```

_параметры состояния приложения, которые могут изменяться_

```
interface IAppState {
catalog: IItem[];
order: IOrder | null;
ormOrderErrors: FormOrderErrors;
formContactsErrors: FormContactsErrors;
modal: string | null;
}
```

_полная информация о товаре_

```
interface Item {
id: string;
title: string;
price: number;
description: string;
image: string;
category: Category;
}
```

_форма заказа_

```
interface IOrderForm {
payment: string;
address: string;
}
```

_форма контактных данных_

```
interface IContactsForm {
email: string;
phone: string;
}
```

_полная форма заказа, включающая информацию с форм заказа и контактных данных, плюс поле с суммой заказа и списком id товаров_

```
interface IOrder extends IOrderForm, IContactsForm {
total: number;
items: string[];
}
```

_обект с ошибками заполнения формы_

```
type FormErrors = Partial<Record<keyof IOrder, string>>
```

_id товара_

```
`type string = string
```

_варианты оплаты_

```
`type Payment = 'Онлайн' | 'При получении'
```

_варианты категорий товаров_

```
type Category = //
| 'другое'
| 'софт-скилл'
| 'дополнительное'
| 'кнопка'
| 'хард-скилл'
```

_главная страница сайта_

```
interface IPage {
counter: number;
catalog: HTMLElement[];
locked: boolean;
}
```

_индивидулаьная карточка товара_

```
interface IItemCard {
id: string;
title: string;
price: number;
description?: string;
image?: string;
category?: Category;
index?: number;
isAdded: boolean;
}
```

_окно об успешно совершенном заказе_

```
interface ISuccess {
total: number;
}
```

_действия по кнопке в окне успещного заказа_

```
interface ISuccessActions {
onClick: () => void;
}
```

_данные, передаваемые в модальное окно_

```
interface IModalData {
content: HTMLElement;
}
```

_состояние формы (валидное или нет) и список ошибок валидации_

```
interface IFormState {
valid: boolean;
errors: string[];
}
```

_октрытая корзина с товарами_

```
interface IBasketView {
items: HTMLElement[];
total: number;
selected: string[];
}
```

_название события_

```
type EventName = string | RegExp
```

_типа колбека для событий - функция_

```
type Subscriber = Function
```

_раздатчик событий_

```
type EmitterEvent = {
eventName: string;
data: unknown;
}
```

_типы событий и типы, которые они принимают и возвращают_

```
interface IEvents {
on<T extends object>(event: EventName, callback: (data: T) => void): void;
emit<T extends object>(event: string, data?: T): void;
trigger<T extends object>(
event: string,
context?: Partial<T>
): (data: T) => void;
}
```

## Основные события

- `UPDATE_CATALOG = 'items:changed'` -- изменили список товаров (в каталоге)
- `TOGGLE_ITEM = 'item:toggle'` - изменить добавление товара в корзину
- `OPEN_ORDER = 'order:open'` - открыть форму заполнения данных о заказе
- `MAKE_ORDER = 'order:submit'` - открыть формы заполнения данных о контактах
- `PAY_ORDER = 'contacts:submit'` - завершение оформления заказа, отправка данных на сервер
- `PREVIEW_CARD = 'card:preview'` - открыть модальное окно с карточкой
- `ORDER_ERRORS = 'formOrderErrors:change'` - измененилось ошибки заполнения формы заказа
- `CONTACTS_ERRORS = 'formContactsErrors:change'` - измененилось ошибки заполнения формы контактов
- `OPEN_BASKET = 'basket:open'` - открыть корзину
- `UPDATE_BASKET = 'basket:changed'` - изменить состояние корзины (списка товаров, суммы)
- `UPDATE_PAYMENT = 'payment:changed'` - обновить способ оплаты
- `UPDATE_PREVIEW = 'preview:changed'` - обновить модальное окна с карточкой
- `OPEN_MODAL = 'modal:open'` - открыть модальное окно
- `CLOSE_MODAL = 'modal:close'` - закрыть модальное окно
