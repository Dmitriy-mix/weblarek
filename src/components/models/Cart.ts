import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class Cart {
    private _items: IProduct[] = [];

    constructor(protected events: IEvents) {}

    getItems(): IProduct[] {
        return this._items;
    }

    addItem(product: IProduct): void {
        this._items.push(product);
        this.events.emit('cart:changed'); // без данных
    }

    removeItem(productId: string): void {
        this._items = this._items.filter(item => item.id !== productId);
        this.events.emit('cart:changed'); // без данных
    }

    clear(): void {
        this._items = [];
        this.events.emit('cart:changed'); // без данных
    }

    getTotalPrice(): number {
        return this._items.reduce((sum, item) => sum + (item.price ?? 0), 0);
    }

    getItemCount(): number {
        return this._items.length;
    }

    contains(productId: string): boolean {
        return this._items.some(item => item.id === productId);
    }
}