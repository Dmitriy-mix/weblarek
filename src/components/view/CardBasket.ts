import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export class CardBasket extends Component<{ product: IProduct; index: number }> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _index: HTMLElement;
    protected _deleteButton: HTMLButtonElement;
    protected _productId!: string;

    constructor(container: HTMLElement, protected events: IEvents, onRemove: (id: string) => void) {
        super(container);
        this._title = ensureElement<HTMLInputElement>('.card__title', container);
        this._price = ensureElement<HTMLInputElement>('.card__price', container);
        this._index = ensureElement<HTMLInputElement>('.basket__item-index', container);
        this._deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);


        if (!this._title || !this._price || !this._index || !this._deleteButton) {
            throw new Error('CardBasket: обязательные элементы не найдены');
        }

        this._deleteButton.addEventListener('click', () => onRemove(this._productId));
    }

    set product(value: IProduct) {
        this._productId = value.id;
        this._title.textContent = value.title;
        this._price.textContent = value.price ? `${value.price} синапсов` : 'Бесценно';
    }

    set index(value: number) {
        this._index.textContent = String(value);
    }

    render(data: { product: IProduct; index: number }): HTMLElement {
        this.product = data.product;
        this.index = data.index;
        return this.container;
    }
}