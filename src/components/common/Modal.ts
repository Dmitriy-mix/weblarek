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

        if (!this._closeButton || !this._content) {
            throw new Error('Modal: обязательные элементы не найдены');
        }

        this._closeButton.addEventListener('click', () => this.close());
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) this.close();
        });
    }

    open(): void {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    close(): void {
        this.container.classList.remove('modal_active');
        this._content.innerHTML = '';
        this.events.emit('modal:close');
    }

    get isOpen(): boolean {
        return this.container.classList.contains('modal_active');
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }
}