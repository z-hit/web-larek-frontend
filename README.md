# Проектная работа "Веб-ларек"

Ссылка на проект: https://github.com/z-hit/web-larek-frontend

Проект магазина товаров для Веб-разработчиков. В магазине можно выбирать товары из Каталога, добавлять их в Коризну, переходить в Коризну и оформлять покупку путем ввода контактных данных и выбора способа оплаты. При желании можно удалить товары из Коризны, или добавить новые к уже имеющимся.

Проект реализовать на основе принципов MVP.

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

Ссылка на UML схему с Архитектурой проекта:
https://github.com/z-hit/web-larek-frontend/blob/0fd4a15151fa457292c99c6b88a8fd888ee3920a/UML%20Web%20Larek.jpg

## Базовый код

1. Класс EventEmitter позволяет компонентам подписываться на события и уведомлять других подписчиков о произошедших событиях.
   Класс включает в себя методы on, off, emit — для подписки на событие, отписки от события и уведомления подписчиков о наступлении события.
   Дополнительные методы onAll и offAll дают возможность подписки на все события и сброса всех
   подписчиков.
   Метод trigger позволяет генерировать события с заданными аргументами, что позволяет использовать передавать его в качетстве обработчика событий в другие классы и снизить связанность с EventEmitter.

2. Класс Api реализует взаимодействие с Сервером.
   Метод get позволяет получить начальный список товаров.
   Метод post возволяет фоормить заказ путем отправки на Сервер необходимых данных о пользователе.

## Компоненты модели данных

1. Класс Item хранит полную информацию о каждом товаре в виде следующих полей:

```
   id: ItemID - уникальный ID каждого товара,
   description: string - описание товара,
   image: string - адрес картинки товара,
   title: string - название товара,
   category: Category - категория товара,
   price: number - цена товара,
   counter: number - порядковый номер товара в Коризне,
   isAdded: Boolean - информация о добавленности товара в Корзину,
   button: Button - универсальная кнопка, модет реализовываться как кнопка добавления товара в Коризну или наоборот удаления товара из Корзины.
```

Класс не имеет методов, т к только хранит существующую информацию и не предполагает прямого взаимодейтсвия с пользователем.

2. Класс Basket хранит данные Корзины, в частности:

```
   items: ItemID[] - список ID товаров, добавленных в Корзину,
   total: number - сумму стоимости всех товаров в корзине.
```

Класс имеет следующие методы:

```
   addItem(itemId: ItemID): void - добавление товара в корзину,
   removeItem(itemId: ItemID): void - удаление товара из корзины,
   cleatrAll(): void - удаление всех товаров из корзины,
   getItems(): ItemID[] - создание списка ID товаров, находящихся в корзине.
```

3. Класс User получается и хранит данные о пользователе и имеет следующие поля:

```
   payment: Payment - выбранный пользователем способ оплаты,
   email: string - введеный пользователем адрес почты,
   phone: string - введенный пользователем номер телефона,
   address: string - введенный пользователем адрес доставки,
   total: number - полная стоимость выбранные товаров,
   items: ItemID[] - список ID выбранных товаров.
```

Класс имеет слеюущие методы:

```
   addPayment(payment: Payment): void - выбор метода оплаты,
   addAddress(address: string): void - ввод адреса доставки,
   addEmail(email: string): void - ввод адреса почты,
   addPhone(phone: string): void - ввод номера телефона,
   addItems(items: ItemID[]): void - добавление списка IDвыбранных товаров,
   postUserData(userData: Pick<User, "payment" | "email" | "phone" | "address" | "total" | "items"): void - отправка на Сервер полных данные о пользователе.
```

## Компоненты представления

1. Класс Main создает главную страницу сайта, которая включает в себя следующие части:
   logo: Picture - ссылка на картинку логотипа,
   catalog: Item[] - список товаров,
   buttonBasket: Button - кнопка открытия Корзины.

   С помощью метода getItems(): Item[] происходит получение списка товаров с Сервера и сохранение в поле catalog.

   При клике по Item (метод openPreview(): void) открывается PopupPreview с данными о конкретном товаре и возможностью добавления товара в Корзину.
   При клике на buttonBasket (метод openBasket(): void) открывается Корзина.

2. Класс Popup создает базовый каркас для всех попапов, которые имеют кнопку закрытия - buttonClose: Button, а также кнопку действия (индивидуального для каждого попапа) - button: Button. Все остальные попапы расширяют класс Popup своими индивидульными данными.

3. Класс PopupBasket расширяет классы Popup и Basket, добавляя заголовок, отображает список карточек товаров, добавленных в Корзину. Он также несет информацию о сумме стоимости всех товаров в корзине.
   При нажатии на кнопку происходит:

- список ID товаров в Корзине отправляется в Обект с данными пользователя - класс User;
- пользователь переводится в попап PopupOrder.

4. Класс IPopupFormInput<T> является дженериком, который имеет стандартную струтуру для всех полей ввода в форме:
   title: string;
   input: T;
   В зависимости от подставляемых данных, input меняется в разных формах.

5. Класс PopupOrder расширяет Popup и включает в себя два IPopupFormInput<T> - первый IPopupFormInput<InputPayment> для создания поля выбора способа оплаты и IPopupFormInput<string> для ввода адреса доставки.
   При нажатии на кнопку происходит:

- сохранение введенных данных в обект с данными о пользователе - класс User;
- очистка полей ввода.

6. Класс PopupContacts расширяет Popup и включает в себя два IPopupFormInput<T> - первый IPopupFormInput<string> для ввода адреса почты и IPopupFormInput<string> для ввода номера телефона.
   При нажатии на кнопку происходит:

   - сохранение введенных данных в обект с данными о пользователе - класс User;
   - отправка полных данные о пользователе на Сервер;
     далее при успешной отпавке данных на сервер:
   - очистка полей ввода;
   - очистка списка товаров в Коризне;
   - перевод пользователя в PopupSucess.

7. Класс PopupSuccess расширяет Popup, добавляя картинку, текст об успешном заказе, а также отображает общую сумму заказа.
   При нажатии на кнопку пользователь перенаправляется на главную страницу для продолжения покупок.

## Основные типы данных

```
type ItemID = string;
type Payment = "Онлайн" | "При получении";
type Category = "другое" | "софт-скилл" | "дополнительное" | "кнопка" | "хард-скилл";
type Picture = {
url: string;
title?: string;
alt: string;
}
type Button = {
title?: string;
event: Event;
callback: Function;
disabled?: Boolean;
};
type InputPayment = {
buttonPayOnline: Button;
buttonPayOffline: Button;
}
```
