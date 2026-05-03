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
            this.payment = 'card';
            events.emit('order:change', { field: 'payment', value: 'card' });
            this.updateValidity(events);
        });

        this.paymentCashButton.addEventListener('click', () => {
            this.payment = 'cash';
            events.emit('order:change', { field: 'payment', value: 'cash' });
            this.updateValidity(events);
        });

        this.addressInput.addEventListener('input', () => {
            events.emit('order:change', { field: 'address', value: this.addressInput.value });
            this.updateValidity(events);
        });

        this.valid = false;
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

    private updateValidity(events: IEvents): void {
        const errors: { payment?: string; address?: string } = {};

        const isPaymentSelected = this.paymentOnlineButton.classList.contains('button_alt-active') ||
            this.paymentCashButton.classList.contains('button_alt-active');

        if (!isPaymentSelected) {
            errors.payment = 'Выберите способ оплаты';
        }
        if (!this.addressInput.value.trim()) {
            errors.address = 'Введите адрес доставки';
        }

        const isValid = Object.keys(errors).length === 0;
        this.valid = isValid;
        this.errors = Object.values(errors).join('; ');

        events.emit('orderForm:errors', errors);
    }
}