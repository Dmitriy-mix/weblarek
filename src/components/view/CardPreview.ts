import { Card } from '../common/Card';
import { IProduct } from '../../types';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';

export interface ICardPreviewActions {
    onButtonClick?: () => void;
}

export class CardPreview extends Card<IProduct> {
    protected _id!: string;
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _inBasket: boolean = false;

    constructor(
       container: HTMLElement, events: IEvents, actions?: ICardPreviewActions
    ) {
        super(container, events);
        
        this._category = ensureElement<HTMLElement>('.card__category', container);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);
        this._description = ensureElement<HTMLElement>('.card__text', container);
        this._button = ensureElement<HTMLButtonElement>('.card__button', container);

       if (actions?.onButtonClick) {
            this._button.addEventListener('click', actions.onButtonClick);
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
        this._image.alt = this._title.textContent || '';
    }

    set description(value: string) {
        this._description.textContent = value;
    }

    set inBasket(value: boolean) {
        this._inBasket = value;
        this._button.textContent = value ? 'Убрать из корзины' : 'В корзину';
    }

    set price(value: number | null) {
        super.price = value;
        if (value === null || value === 0) {
            this._button.disabled = true;
            this._button.textContent = 'Недоступно';
            this._inBasket = false;
        } else {
            this._button.disabled = false;
            if (!this._inBasket) {
                this._button.textContent = 'В корзину';
            }
        }
    }
}