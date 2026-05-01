import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export class Success extends Component<{ total: number }> {
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._description = ensureElement<HTMLElement>('.order-success__description', container);
        this._button = ensureElement<HTMLButtonElement>('.order-success__close', container);

        if (!this._description || !this._button) {
            throw new Error('Success: обязательные элементы не найдены');
        }

        this._button.addEventListener('click', () => events.emit('success:close'));
    }

    set total(value: number) {
        this._description.textContent = `Списано ${value} синапсов`;
    }
}