import { Card } from '../common/Card';
import { IProduct } from '../../types';
import { IEvents } from '../base/Events';
import { categoryMap } from '../../utils/constants';

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export class CardCatalog extends Card<IProduct> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(container: HTMLElement, events: IEvents, actions: ICardActions) {
        super(container, events);

        this.categoryElement = container.querySelector('.card__category') as HTMLElement;
        this.imageElement = container.querySelector('.card__image') as HTMLImageElement;

        if (actions?.onClick) {
            container.addEventListener('click', actions.onClick);
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
        this.imageElement.alt = this.title;
    }
}