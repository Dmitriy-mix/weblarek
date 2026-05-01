import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export class Page extends Component<{ catalog: HTMLElement[]; counter: number; locked: boolean }> {
    protected _catalog: HTMLElement;
    protected _basketCounter: HTMLElement;
    protected _basket: HTMLElement;
    protected _wrapper: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._catalog = ensureElement<HTMLElement>('.gallery', container);
        this._basketCounter = ensureElement<HTMLElement>('.header__basket-counter', container);
        this._basket = ensureElement<HTMLElement>('.header__basket', container);
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper', container);

        if (!this._catalog || !this._basketCounter || !this._basket || !this._wrapper) {
            throw new Error('Page: обязательные элементы не найдены');
        }

        this._basket.addEventListener('click', () => events.emit('basket:open'));
    }

    set catalog(value: HTMLElement[]) {
        this._catalog.replaceChildren(...value);
    }

    set counter(value: number) {
        this._basketCounter.textContent = String(value);
    }

    set locked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        } else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }
}