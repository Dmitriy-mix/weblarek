/**
 * Базовый компонент
 */
export abstract class Component<T> {
    protected constructor(protected readonly container: HTMLElement) { }

    protected setText(element: HTMLElement, value: unknown): void {
        if (element) element.textContent = String(value);
    }

    protected setDisabled(element: HTMLElement, state: boolean): void {
        if (element) {
            if (state) element.setAttribute('disabled', 'disabled');
            else element.removeAttribute('disabled');
        }
    }

    protected setHidden(element: HTMLElement): void {
        if (element) element.style.display = 'none';
    }

    protected setVisible(element: HTMLElement): void {
        if (element) element.style.display = '';
    }

    protected setImage(element: HTMLImageElement, src: string, alt?: string): void {
        if (element) {
            element.src = src;
            if (alt) element.alt = alt;
        }
    }

    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}