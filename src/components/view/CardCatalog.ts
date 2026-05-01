import { Card } from '../common/Card';
import { IProduct } from '../../types';
import { IEvents } from '../base/Events';


export class CardCatalog extends Card<IProduct> {
    protected _id!: string;

    constructor(container: HTMLElement, events: IEvents, onSelect: (id: string) => void) {
        super(container, events);

        this.container.addEventListener('click', () => {
            onSelect(this._id);
        });
    }

    set id(value: string) {
        this._id = value;
        this.container.setAttribute('data-id', value);
    }

    render(data: IProduct): HTMLElement {
        this.id = data.id;
        this.title = data.title;
        this.price = data.price;
        this.category = data.category;
        this.image = data.image;
        this.buttonText = 'В корзину';
        return this.container;
    }
}