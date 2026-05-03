import { Form } from '../common/Form';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export class ContactsForm extends Form<{ email: string; phone: string }> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);

        this.emailInput.addEventListener('input', () => {
            events.emit('contacts:change', { field: 'email', value: this.emailInput.value });
           this.updateValidity();
        });

        this.phoneInput.addEventListener('input', () => {
            events.emit('contacts:change', { field: 'phone', value: this.phoneInput.value });
            this.updateValidity();
        });

        this.valid = false;
    }

    set email(value: string) {
        this.emailInput.value = value;
    }

    set phone(value: string) {
        this.phoneInput.value = value;
    }

     private updateValidity(): void {
        const errors: { email?: string; phone?: string } = {};
        
        if (!this.emailInput.value.trim()) {
            errors.email = 'Введите email';
        }
        if (!this.phoneInput.value.trim()) {
            errors.phone = 'Введите номер телефона';
        }
        
        const isValid = Object.keys(errors).length === 0;
        this.valid = isValid;
        this.errors = Object.values(errors).join('; ');
        
        this.events.emit('contactsForm:errors', errors);
    }
}