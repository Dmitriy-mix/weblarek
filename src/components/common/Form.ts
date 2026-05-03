import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export class Form<T> extends Component<T> {
    protected formElement: HTMLFormElement;
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container);
        this.formElement = container;
        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this.errorsElement = ensureElement<HTMLElement>('.form__errors', container);

        this.formElement.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.events.emit(`${this.formElement.name}:change`, { field, value });
        });

        this.formElement.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.formElement.name}:form-submit`);
        });
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    set errors(value: string) {
        if (value) {
            this.errorsElement.textContent = value;
            this.errorsElement.style.display = 'block';
        } else {
            this.errorsElement.textContent = '';
            this.errorsElement.style.display = 'none';
        }
    }
}