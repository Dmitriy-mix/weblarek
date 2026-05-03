import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { Card } from '../common/Card';

export interface ICardBasketActions {
    onRemove?: () => void;
}

export class CardBasket extends Card<{ product: IProduct; index: number }> {
    protected _index: HTMLElement;
    protected _deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents, actions?: ICardBasketActions) {
        super(container, events);
        
        this._index = ensureElement<HTMLElement>('.basket__item-index', container);
        this._deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

        if (actions?.onRemove) {
            this._deleteButton.addEventListener('click', actions.onRemove);
        }
    }

    set index(value: number) {
        this._index.textContent = String(value);
    }

    set product(value: IProduct) {
        this.title = value.title;
        this.price = value.price;
    }
}