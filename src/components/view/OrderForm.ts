import { Form } from '../common/Form';
import { TPayment } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export class OrderForm extends Form<{ payment: TPayment | null; address: string }> {
    protected paymentOnlineButton: HTMLButtonElement;
    protected paymentCashButton: HTMLButtonElement;
    protected addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this.paymentOnlineButton = ensureElement<HTMLButtonElement>('button[name="card"]', container);
        this.paymentCashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', container);
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);

        this.paymentOnlineButton.addEventListener('click', () => {
            this.events.emit('order:payment-change', { payment: 'card' });
        });

        this.paymentCashButton.addEventListener('click', () => {
            this.events.emit('order:payment-change', { payment: 'cash' });
        });
    }

    set payment(value: TPayment | null) {
        this.paymentOnlineButton.classList.remove('button_alt-active');
        this.paymentCashButton.classList.remove('button_alt-active');

        if (value === 'card') {
            this.paymentOnlineButton.classList.add('button_alt-active');
        } else if (value === 'cash') {
            this.paymentCashButton.classList.add('button_alt-active');
        }
    }

    set address(value: string) {
        this.addressInput.value = value;
    }

}