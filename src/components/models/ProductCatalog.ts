import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class ProductCatalog {
    private products: IProduct[] = [];
    private selectedProduct: IProduct | null = null;

    constructor(protected events: IEvents) { }

    setProducts(product: IProduct[]): void {
        this.products = product;
        this.events.emit('catalog:changed');
    }

    getProducts(): IProduct[] {
        return this.products;
    }

    setSelectedProduct(product: IProduct): void {
        this.selectedProduct = product;
        this.events.emit('catalog:selected');
    }

    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }
}

