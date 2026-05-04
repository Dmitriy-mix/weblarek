import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class Cart {
    private items: IProduct[] = [];

    constructor(protected events: IEvents) { }

    getItems(): IProduct[] {
        return this.items;
    }

    addItem(product: IProduct): void {
        this.items.push(product);
        this.events.emit('cart:changed');
    }

    removeItem(productId: string): void {
        this.items = this.items.filter(item => item.id !== productId);
        this.events.emit('cart:changed');
    }

    clear(): void {
        this.items = [];
        this.events.emit('cart:changed');
    }

    getTotalPrice(): number {
        return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
    }

    getItemCount(): number {
        return this.items.length;
    }

    contains(productId: string): boolean {
        return this.items.some(item => item.id === productId);
    }
}