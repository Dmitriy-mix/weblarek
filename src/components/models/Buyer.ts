import { IBuyer, TPayment } from '../../types';

export class Buyer {
  private _payment: TPayment = 'cash';
  private _email: string = '';
  private _phone: string = '';
  private _address: string = '';

  setPayment(payment: TPayment): void {
    this._payment = payment;
  }

  setEmail(email: string): void {
    this._email = email;
  }

  setPhone(phone: string): void {
    this._phone = phone;
  }

  setAddress(address: string): void {
    this._address = address;
  }

  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this._payment = data.payment;
    if (data.email !== undefined) this._email = data.email;
    if (data.phone !== undefined) this._phone = data.phone;
    if (data.address !== undefined) this._address = data.address;
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