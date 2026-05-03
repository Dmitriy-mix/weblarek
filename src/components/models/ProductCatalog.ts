import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class ProductCatalog {
    private _products: IProduct[] = [];
    private _selectedProduct: IProduct | null = null;

    constructor(protected events: IEvents) {}

    setProducts(products: IProduct[]): void {
        this._products = products;
        this.events.emit('catalog:changed'); // без данных
    }

    getProducts(): IProduct[] {
        return this._products;
    }

    getProductById(id: string): IProduct | undefined {
        return this._products.find(p => p.id === id);
    }

    setSelectedProduct(product: IProduct): void {
        this._selectedProduct = product;
        this.events.emit('catalog:selected'); // без данных
    }

    getSelectedProduct(): IProduct | null {
        return this._selectedProduct;
    }
}

