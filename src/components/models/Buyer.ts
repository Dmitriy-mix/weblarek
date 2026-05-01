import { IBuyer, TPayment } from '../../types';
import { IEvents } from '../base/Events';

export class Buyer {
    private _payment: TPayment = 'cash';
    private _email: string = '';
    private _phone: string = '';
    private _address: string = '';

    constructor(protected events: IEvents) { }

    setPayment(payment: TPayment): void {
        this._payment = payment;
        this.events.emit('buyer:changed', this.getData());
    }

    setEmail(email: string): void {
        this._email = email;
        this.events.emit('buyer:changed', this.getData());
    }

    setPhone(phone: string): void {
        this._phone = phone;
        this.events.emit('buyer:changed', this.getData());
    }

    setAddress(address: string): void {
        this._address = address;
        this.events.emit('buyer:changed', this.getData());
    }

    setData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) this._payment = data.payment;
        if (data.email !== undefined) this._email = data.email;
        if (data.phone !== undefined) this._phone = data.phone;
        if (data.address !== undefined) this._address = data.address;

        this.events.emit('buyer:changed', this.getData());
    }

    getData(): IBuyer {
        return {
            payment: this._payment,
            email: this._email,
            phone: this._phone,
            address: this._address,
        };
    }

    clear(): void {
        this._payment = 'cash';
        this._email = '';
        this._phone = '';
        this._address = '';
        this.events.emit('buyer:changed', this.getData());
    }

    validate(): Partial<Record<keyof IBuyer, string>> | null {
        const errors: Partial<Record<keyof IBuyer, string>> = {};
        if (!this._payment) errors.payment = 'Не выбран вид оплаты';
        if (!this._email.trim()) errors.email = 'Укажите email';
        if (!this._phone.trim()) errors.phone = 'Укажите телефон';
        if (!this._address.trim()) errors.address = 'Укажите адрес';
        return Object.keys(errors).length === 0 ? null : errors;
    }
}