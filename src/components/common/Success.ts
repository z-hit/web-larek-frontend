import { Component } from '../base/Component';
import { ensureElement, formatNumber } from '../../utils/utils';
import { ISuccess, ISuccessActions } from '../../types';

export class Success extends Component<ISuccess> {
	protected _close: HTMLElement;
	protected _total: HTMLElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);
		this._total = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);
		this._close = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);

		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}

	set total(total: number) {
		this.setText(
			this._total,
			'Списано ' + String(formatNumber(total)) + ' синапсов'
		);
	}
}
