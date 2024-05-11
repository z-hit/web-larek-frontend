import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { Events, IEvents } from '../base/Events';
import { IModalData } from '../../types';

export class Modal extends Component<IModalData> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (event) => event.stopPropagation());
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	open() {
		this.container.classList.add('modal_active');
		this.events.emit(Events.OPEN_MODAL);
	}

	close() {
		this.container.classList.remove('modal_active');
		this.content = null;
		this.events.emit(Events.CLOSE_MODAL);
	}

	/* toggleOpen() {
		this.toggleClass(this.container, 'modal_active');
	} */

	render(data: IModalData): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}
