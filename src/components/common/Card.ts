import { Component } from '../base/Component';
import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export class Card<T> extends Component<T> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;
    protected _description?: HTMLElement;
    protected _button?: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        protected events: IEvents,
        protected actions?: { onClick?: (event: MouseEvent) => void }
    ) {
        super(container);
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._category = ensureElement<HTMLElement>('.card__category', container);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);

        this._description = container.querySelector('.card__text') ?? undefined;
        this._button = container.querySelector('.card__button') ?? undefined;

        if (!this._title || !this._price || !this._category || !this._image) {
            throw new Error('Card: обязательные элементы не найдены');
        }

        if (this._button && actions?.onClick) {
            this._button.addEventListener('click', actions.onClick);
        }
    }

    set title(value: string) {
        this._title.textContent = value;
    }

    set price(value: number | null) {
        if (value === null || value === 0) {
            this._price.textContent = 'Бесценно';
            if (this._button) this._button.disabled = true;
        } else {
            this._price.textContent = `${value} синапсов`;
            if (this._button) this._button.disabled = false;
        }
    }

    set category(value: string) {
        this._category.textContent = value;
        let categoryClass = 'card__category_other';
        if (value in categoryMap) {
            categoryClass = categoryMap[value as keyof typeof categoryMap];
        }
        const baseClass = 'card__category';
        this._category.className = baseClass;
        this._category.classList.add(categoryClass);
    }

    set image(value: string) {
        this._image.src = value;
        this._image.alt = this._title.textContent || '';
    }

    set description(value: string) {
        if (this._description) this._description.textContent = value;
    }

    set buttonText(value: string) {
        if (this._button) this._button.textContent = value;
    }

    set disabled(value: boolean) {
        if (this._button) this._button.disabled = value;
    }
}