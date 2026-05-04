import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export class Basket extends Component<{ items: HTMLElement[]; total: number }> {
    protected listElement: HTMLElement;
    protected totalPriceElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.listElement = ensureElement<HTMLElement>('.basket__list', container);
        this.totalPriceElement = ensureElement<HTMLElement>('.basket__price', container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.basket__button', container);

        this.buttonElement.addEventListener('click', () => events.emit('order:submit'));
    }

    set items(value: HTMLElement[]) {
        this.listElement.replaceChildren(...value);
    }

    set total(value: number) {
        this.setText(this.totalPriceElement, `${value} синапсов`);
    }

    set disabled(value: boolean) {
        this.setDisabled(this.buttonElement, value);
    }
}