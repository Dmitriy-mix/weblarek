import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Modal extends Component<{ content: HTMLElement }> {
    protected _closeButton: HTMLElement;
    protected _content: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._closeButton = ensureElement<HTMLElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);

        this._closeButton.addEventListener('click', () => {
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
        this._content.innerHTML = '';
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }
}