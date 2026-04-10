import { Api } from '../base/Api';
import { IProduct, IOrder, IOrderResult } from '../../types';

export class AppApi {
  constructor(private _api: Api) {}

  getProducts(): Promise<{ items: IProduct[] }> {
    return this._api.get<{ items: IProduct[] }>('/product/');
  }

  sendOrder(order: IOrder): Promise<IOrderResult> {
    return this._api.post<IOrderResult>('/order/', order);
  }
}