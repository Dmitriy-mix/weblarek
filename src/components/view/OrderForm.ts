import { Form } from '../common/Form';
import { TPayment } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export class OrderForm extends Form<{ payment: TPayment | null; address: string }> {
     protected _paymentOnline: HTMLButtonElement;
    protected _paymentCash: HTMLButtonElement;
    protected _address: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._paymentOnline = ensureElement<HTMLButtonElement>('button[name="card"]', container);
        this._paymentCash = ensureElement<HTMLButtonElement>('button[name="cash"]', container);
        this._address = ensureElement<HTMLInputElement>('input[name="address"]', container);

        this._paymentOnline.addEventListener('click', () => {
            this.payment = 'card';
            events.emit('order:change', { field: 'payment', value: 'card' });
        });

        this._paymentCash.addEventListener('click', () => {
            this.payment = 'cash';
            events.emit('order:change', { field: 'payment', value: 'cash' });
        });

        this._address.addEventListener('input', () => {
            events.emit('order:change', { field: 'address', value: this._address.value });
        });
    }

    set payment(value: TPayment | null) {
        this._paymentOnline.classList.remove('button_alt-active');
        this._paymentCash.classList.remove('button_alt-active');
        
        if (value === 'card') {
            this._paymentOnline.classList.add('button_alt-active');
        } else if (value === 'cash') {
            this._paymentCash.classList.add('button_alt-active');
        }
    }

    set address(value: string) {
        this._address.value = value;
    }
}