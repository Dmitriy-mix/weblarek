import { Form } from '../common/Form';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export class ContactsForm extends Form<{ email: string; phone: string }> {
    protected _email: HTMLInputElement;
    protected _phone: HTMLInputElement;
    protected _emailValue: string = '';
    protected _phoneValue: string = '';

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._email = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this._phone = ensureElement<HTMLInputElement>('input[name="phone"]', container);

        if (!this._email || !this._phone) {
            throw new Error('ContactsForm: обязательные элементы не найдены');
        }

        const updateValidity = () => {
            const isValid = this._emailValue.trim() !== '' && this._phoneValue.trim() !== '';
            this.valid = isValid;
        };

        this._email.addEventListener('input', () => {
            this._emailValue = this._email.value;
            events.emit('contacts:change', { field: 'email', value: this._emailValue });
            updateValidity();
        });

        this._phone.addEventListener('input', () => {
            this._phoneValue = this._phone.value;
            events.emit('contacts:change', { field: 'phone', value: this._phoneValue });
            updateValidity();
        });

        this.valid = false;
    }

    set email(value: string) {
        this._emailValue = value;
        this._email.value = value;
        const isValid = this._emailValue.trim() !== '' && this._phoneValue.trim() !== '';
        this.valid = isValid;
    }

    set phone(value: string) {
        this._phoneValue = value;
        this._phone.value = value;
        const isValid = this._emailValue.trim() !== '' && this._phoneValue.trim() !== '';
        this.valid = isValid;
    }
}