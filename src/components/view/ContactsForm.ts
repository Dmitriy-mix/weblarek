import { Form } from '../common/Form';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export class ContactsForm extends Form<{ email: string; phone: string }> {
      protected _email: HTMLInputElement;
    protected _phone: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._email = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this._phone = ensureElement<HTMLInputElement>('input[name="phone"]', container);

        this._email.addEventListener('input', () => {
            events.emit('contacts:change', { field: 'email', value: this._email.value });
        });

        this._phone.addEventListener('input', () => {
            events.emit('contacts:change', { field: 'phone', value: this._phone.value });
        });
    }

    set email(value: string) {
        this._email.value = value;
    }

    set phone(value: string) {
        this._phone.value = value;
    }
}