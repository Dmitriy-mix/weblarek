import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export class Form<T> extends Component<T> {
    protected _form: HTMLFormElement;
    protected _submitButton: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container);
        this._form = container;
        this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this._errors = ensureElement<HTMLElement>('.form__errors', container);


        if (!this._submitButton || !this._errors) {
            throw new Error('Form: обязательные элементы не найдены');
        }

        this._form.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.events.emit(`${this._form.name}:change`, { field, value });
        });

        this._form.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this._form.name}:form-submit`);
        });
    }

    set valid(value: boolean) {
        this._submitButton.disabled = !value;
    }

    set errors(value: string) {
        this._errors.textContent = value;
    }

    render(data: Partial<T> & { valid?: boolean; errors?: string }): HTMLElement {
        super.render(data);
        if (data.valid !== undefined) this.valid = data.valid;
        if (data.errors !== undefined) this.errors = data.errors;
        return this.container;
    }
}