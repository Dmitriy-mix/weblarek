import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export class Card<T> extends Component<T> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;

    constructor(
       container: HTMLElement,
        protected events: IEvents,
        protected actions?: { onClick?: (event: MouseEvent) => void }
    ) {
        super(container);
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);

        if (actions?.onClick) {
            this.container.addEventListener('click', actions.onClick);
        }
    }

    set title(value: string) {
        this._title.textContent = value;
    }

    set price(value: number | null) {
        if (value === null || value === 0) {
            this._price.textContent = 'Бесценно';
        } else {
            this._price.textContent = `${value} синапсов`;
        }
    }
}