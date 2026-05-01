import { Card } from '../common/Card';
import { IProduct } from '../../types';
import { IEvents } from '../base/Events';


export class CardPreview extends Card<IProduct> {
    protected _id!: string;
    protected _inBasket: boolean = false;
    protected onAdd: (id: string) => void;
    protected onRemove: (id: string) => void;

    constructor(
        container: HTMLElement,
        events: IEvents,
        onAddToBasket: (id: string) => void,
        onRemoveFromBasket: (id: string) => void
    ) {
        super(container, events);
        this.onAdd = onAddToBasket;
        this.onRemove = onRemoveFromBasket;

        if (this._button) {
            this._button.addEventListener('click', () => {
                if (this._inBasket) {
                    this.onRemove(this._id);
                } else {
                    this.onAdd(this._id);
                }
            });
        }
    }

    set id(value: string) {
        this._id = value;
        this.container.setAttribute('data-id', value);
    }

    set inBasket(value: boolean) {
        this._inBasket = value;
        this.buttonText = value ? 'Убрать из корзины' : 'В корзину';
    }

    render(data: IProduct): HTMLElement {
        this.id = data.id;
        this.title = data.title;
        this.price = data.price;
        this.category = data.category;
        this.image = data.image;
        this.description = data.description;
        return this.container;
    }
}