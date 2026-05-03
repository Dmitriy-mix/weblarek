import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Gallery extends Component<{ catalog: HTMLElement[]; }> {
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
    }

    set catalog(value: HTMLElement[]) {
        this.container.replaceChildren(...value);
    }
}