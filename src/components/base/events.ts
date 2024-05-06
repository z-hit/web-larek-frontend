// Хорошая практика даже простые типы выносить в алиасы
// Зато когда захотите поменять это достаточно сделать в одном месте
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
export class EventEmitter implements IEvents {
	_events: Map<EventName, Set<Subscriber>>;

	constructor() {
		this._events = new Map<EventName, Set<Subscriber>>();
	}

	on<T extends object>(eventName: EventName, callback: (event: T) => void) {
		if (!this._events.has(eventName)) {
			this._events.set(eventName, new Set<Subscriber>());
		}
		this._events.get(eventName)?.add(callback);
	}

	off(eventName: EventName, callback: Subscriber) {
		if (this._events.has(eventName)) {
			this._events.get(eventName)!.delete(callback);
			if (this._events.get(eventName)?.size === 0) {
				this._events.delete(eventName);
			}
		}
	}

	emit<T extends object>(eventName: string, data?: T) {
		this._events.forEach((subscribers, name) => {
			if (
				(name instanceof RegExp && name.test(eventName)) ||
				name === eventName
			) {
				subscribers.forEach((callback) => callback(data));
			}
		});
	}

	onAll(callback: (event: EmitterEvent) => void) {
		this.on('*', callback);
	}

	offAll() {
		this._events = new Map<string, Set<Subscriber>>();
	}

	trigger<T extends object>(eventName: string, context?: Partial<T>) {
		return (event: object = {}) => {
			this.emit(eventName, {
				...(event || {}),
				...(context || {}),
			});
		};
	}
}

export enum Events {
	CHANGE_ITEMS = 'items:changed',
	SUBMIT_ORDER = 'order:submit',
	SUBMIT_CONTACTS = 'contacts:submit',
	CHANGE_ERRORS = 'formErrors:change',
	CHANGE_ORDER = '/^order..*:change/',
	OPEN_ORDER = 'order:open',
	OPEN_CONTACTS = 'contacts:open',
	OPEN_BASKET = 'basket:open',
	OPEN_CARD = 'card:select',
	OPEN_MODAL = 'modal:open',
	CLOSE_MODAL = 'modal:close',
	CHANGE_PAYMENT = 'payment:changed',
	CHANGE_PREVIEW = 'preview:changed',
	ORDER_READY = 'order:ready',
}
