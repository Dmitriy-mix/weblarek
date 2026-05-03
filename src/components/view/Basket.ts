import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export class Basket extends Component<{ items: HTMLElement[]; total: number }> {
    protected _list: HTMLElement;
    protected _totalPrice: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._list = ensureElement<HTMLElement>('.basket__list', container);
        this._totalPrice = ensureElement<HTMLElement>('.basket__price', container);
        this._button = ensureElement<HTMLButtonElement>('.basket__button', container);

        this._button.addEventListener('click', () => events.emit('order:submit'));
    }

    set items(value: HTMLElement[]) {
        this._list.replaceChildren(...value);
    }

    set total(value: number) {
        this._totalPrice.textContent = `${value} синапсов`;
    }

    set disabled(value: boolean) {
        this._button.disabled = value;
    }
}