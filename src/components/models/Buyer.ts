import { IBuyer, TBuyerValidationErrors, TPayment } from '../../types';
import { IEvents } from '../base/Events';

export class Buyer {
    private _payment: TPayment | null = null;
    private _email: string = '';
    private _phone: string = '';
    private _address: string = '';

    constructor(protected events: IEvents) {}

    setData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) this._payment = data.payment;
        if (data.email !== undefined) this._email = data.email;
        if (data.phone !== undefined) this._phone = data.phone;
        if (data.address !== undefined) this._address = data.address;
        
        this.events.emit('buyer:changed'); // без данных
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
        this._payment = null;
        this._email = '';
        this._phone = '';
        this._address = '';
        this.events.emit('buyer:changed'); // без данных
    }

    validate(): TBuyerValidationErrors {
        const errors: TBuyerValidationErrors = {};
        
        if (!this._payment) errors.payment = 'Выберите способ оплаты';
        if (!this._email.trim()) errors.email = 'Укажите email';
        if (!this._phone.trim()) errors.phone = 'Укажите телефон';
        if (!this._address.trim()) errors.address = 'Укажите адрес';
        
        return errors;
    }
}