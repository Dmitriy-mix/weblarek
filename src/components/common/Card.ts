import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export class Card<T> extends Component<T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(
        container: HTMLElement,
        protected events: IEvents,
        protected actions?: { onClick?: (event: MouseEvent) => void }
    ) {
        super(container);
        this.titleElement = ensureElement<HTMLElement>('.card__title', container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', container);
    }

    set title(value: string) {
        this.setText(this.titleElement, value);
    }

    set price(value: number | null) {
        if (value === null || value === 0) {
            this.setText(this.priceElement, 'Бесценно');
        } else {
            this.setText(this.priceElement, `${value} синапсов`);
        }
    }
}