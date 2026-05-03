import { Card } from '../common/Card';
import { IProduct } from '../../types';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';

export interface ICardPreviewActions {
    onButtonClick?: () => void;
}

export class CardPreview extends Card<IProduct> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    protected descriptionElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;
    protected inBasketStatus: boolean = false;

    constructor(
        container: HTMLElement, events: IEvents, actions?: ICardPreviewActions
    ) {
        super(container, events);

        this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
        this.descriptionElement = ensureElement<HTMLElement>('.card__text', container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', container);

        if (actions?.onButtonClick) {
            this.buttonElement.addEventListener('click', actions.onButtonClick);
        }
    }

    set category(value: string) {
        this.categoryElement.textContent = value;
        let categoryClass = 'card__category_other';
        if (value in categoryMap) {
            categoryClass = categoryMap[value as keyof typeof categoryMap];
        }
        this.categoryElement.className = `card__category ${categoryClass}`;
    }

    set image(value: string) {
        this.imageElement.src = value;
        this.imageElement.alt = this.titleElement.textContent || '';
    }

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }

    set price(value: number | null) {
        super.price = value;
        if (value === null || value === 0) {
            this.buttonElement.disabled = true;
            this.buttonElement.textContent = 'Недоступно';
            this.inBasketStatus = false;
        } else {
            this.buttonElement.disabled = false;
            if (!this.inBasketStatus) {
                this.buttonElement.textContent = 'В корзину';
            }
        }
    }

     set inBasket(value: boolean) {
        this.inBasketStatus = value;
       if (this.buttonElement.textContent !== 'Недоступно') {
            this.buttonElement.textContent = value ? 'Убрать из корзины' : 'В корзину';
        }
    }
}