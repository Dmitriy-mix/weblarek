import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export class Header extends Component<{ counter: number; }> {
    protected basketCounterElement: HTMLElement;
    protected basketButton: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.basketCounterElement = ensureElement<HTMLElement>('.header__basket-counter', container);
        this.basketButton = ensureElement<HTMLElement>('.header__basket', container);

        this.basketButton.addEventListener('click', () => events.emit('basket:open'));
    }

    set counter(value: number) {
        this.basketCounterElement.textContent = String(value);
    }

}