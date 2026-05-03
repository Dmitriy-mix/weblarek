import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Modal extends Component<{ content: HTMLElement }> {
    protected closeButton: HTMLElement;
    protected contentElement: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.closeButton = ensureElement<HTMLElement>('.modal__close', container);
        this.contentElement = ensureElement<HTMLElement>('.modal__content', container);

        this.closeButton.addEventListener('click', () => {
            this.events.emit('modal:close');
            this.close();
        });

        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) {
                this.events.emit('modal:close');
                this.close();
            }
        });
    }

    open(): void {
        this.container.classList.add('modal_active');
    }

    close(): void {
        this.container.classList.remove('modal_active');
        this.contentElement.innerHTML = '';
    }

    set content(value: HTMLElement) {
        this.contentElement.replaceChildren(value);
    }
}