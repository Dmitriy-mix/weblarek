import { Form } from '../common/Form';
import { TPayment } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export class OrderForm extends Form<{ payment: TPayment; address: string }> {
    protected _paymentOnline: HTMLButtonElement;
    protected _paymentCash: HTMLButtonElement;
    protected _address: HTMLInputElement;
    protected _paymentValue!: TPayment;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._paymentOnline = ensureElement<HTMLButtonElement>('button[name="card"]', container);
        this._paymentCash = ensureElement<HTMLButtonElement>('button[name="cash"]', container);
        this._address = ensureElement<HTMLInputElement>('input[name="address"]', container);

        if (!this._paymentOnline || !this._paymentCash || !this._address) {
            throw new Error('OrderForm: обязательные элементы не найдены');
        }

        const updateValidity = () => {
            const isValid = this._address.value.trim() !== '' && this._paymentValue !== undefined;
            this.valid = isValid;
        };

        this._paymentOnline.addEventListener('click', () => {
            this.payment = 'card';
            events.emit('order:change', { field: 'payment', value: 'card' });
            updateValidity();
        });

        this._paymentCash.addEventListener('click', () => {
            this.payment = 'cash';
            events.emit('order:change', { field: 'payment', value: 'cash' });
            updateValidity();
        });

        this._address.addEventListener('input', () => {
            events.emit('order:change', { field: 'address', value: this._address.value });
            updateValidity();
        });

        this.valid = false;
    }

    set payment(value: TPayment) {
        this._paymentValue = value;
        const isOnline = value === 'card';
        this._paymentOnline.classList.toggle('button_alt-active', isOnline);
        this._paymentCash.classList.toggle('button_alt-active', !isOnline);
    }

    set address(value: string) {
        this._address.value = value;
    }
}