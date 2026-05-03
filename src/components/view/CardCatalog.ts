import { Card } from '../common/Card';
import { IProduct } from '../../types';
import { IEvents } from '../base/Events';
import { categoryMap } from '../../utils/constants';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class CardCatalog extends Card<IProduct> {
    protected _id!: string;
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;

    constructor(container: HTMLElement, events: IEvents, actions: ICardActions) {
        super(container, events);
        
        this._category = container.querySelector('.card__category') as HTMLElement;
        this._image = container.querySelector('.card__image') as HTMLImageElement;

        if (actions?.onClick) {
            container.addEventListener('click', actions.onClick);
        }
    }

    set id(value: string) {
        this._id = value;
    }

    set category(value: string) {
        this._category.textContent = value;
        let categoryClass = 'card__category_other';
        if (value in categoryMap) {
            categoryClass = categoryMap[value as keyof typeof categoryMap];
        }
        this._category.className = `card__category ${categoryClass}`;
    }

    set image(value: string) {
        this._image.src = value;
        this._image.alt = this.title;
    }
}