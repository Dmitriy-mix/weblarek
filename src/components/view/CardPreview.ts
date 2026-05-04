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
        this.setImage(this.imageElement, value, this.title);
    }

    set description(value: string) {
        this.setText(this.descriptionElement, value);
    }

    set buttonText(value: string) {
        this.setText(this.buttonElement, value);
    }

    set buttonDisabled(value: boolean) {
        this.setDisabled(this.buttonElement, value);
    }


}