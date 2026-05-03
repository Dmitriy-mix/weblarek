export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}


export type TPayment = 'cash' | 'card';


export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  inBasket?: boolean;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment | null;
  email: string;
  phone: string;
  address: string;
}

export interface IOrder {
  payment: TPayment | null;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

export interface IOrderResult {
  id: string;
  total: number;
}

export type TBuyerValidationErrors = Partial<Record<keyof IBuyer, string>>;