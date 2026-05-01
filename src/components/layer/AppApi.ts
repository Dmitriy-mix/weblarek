import { IOrder, IOrderResult, IProduct } from '../../types';
import { Api } from '../base/Api';

export class AppApi {
    constructor(private _api: Api) { }

    getProducts(): Promise<{ items: IProduct[] }> {
        return this._api.get<{ items: IProduct[] }>('/product/');
    }

    sendOrder(order: IOrder): Promise<IOrderResult> {
        return this._api.post<IOrderResult>('/order/', order);
    }
}