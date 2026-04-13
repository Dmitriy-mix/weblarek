import { IOrder, IOrderResult, IApi, IProductsResponse } from '../../types';

export class AppApi {
  constructor(private _api: IApi) {}

  getProducts(): Promise<IProductsResponse> {
    return this._api.get<IProductsResponse>('/product/');
  }

  sendOrder(order: IOrder): Promise<IOrderResult> {
    return this._api.post<IOrderResult>('/order/', order);
  }
}