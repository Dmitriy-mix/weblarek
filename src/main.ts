import './scss/styles.scss';

import { Api } from './components/base/Api';
import { API_URL, CDN_URL } from './utils/constants';
import { ProductCatalog } from './components/models/ProductCatalog';
import { Cart } from './components/models/Cart';
import { Buyer } from './components/models/Buyer';
import { Modal } from './components/common/Modal';
import { IProduct, IOrder } from './types';
import { EventEmitter } from './components/base/Events';
import { AppApi } from './components/layer/AppApi';
import { Page } from './components/view/Page';
import { CardCatalog } from './components/view/CardCatalog';
import { CardPreview } from './components/view/CardPreview';
import { CardBasket } from './components/view/CardBasket';
import { Basket } from './components/view/Basket';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';
import { Success } from './components/view/Success';
import { ensureElement } from './utils/utils';

// ИНИЦИАЛИЗАЦИЯ


const events = new EventEmitter();

const catalog = new ProductCatalog(events);
const cart = new Cart(events);
const buyer = new Buyer(events);

const api = new Api(API_URL);
const appApi = new AppApi(api);

const modalContainer = document.querySelector('#modal-container') as HTMLElement;
const pageContainer = document.querySelector('.page') as HTMLElement;

const modal = new Modal(modalContainer, events);
const page = new Page(pageContainer, events);

// Шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// ============================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================

function getImageUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${CDN_URL}/${cleanPath}`;
}

function getElementFromTemplate(template: HTMLTemplateElement): HTMLElement {
    const fragment = template.content.cloneNode(true) as DocumentFragment;
    const element = fragment.firstElementChild as HTMLElement;
    if (!element) {
        throw new Error('Не удалось получить элемент из шаблона');
    }
    return element;
}

function createCardCatalog(product: IProduct): HTMLElement {
    const container = getElementFromTemplate(cardCatalogTemplate);
    const card = new CardCatalog(container, events, (id: string) => {
        events.emit('card:select', { id });
    });
    const productWithImage = {
        ...product,
        image: getImageUrl(product.image)
    };
    return card.render(productWithImage);
}

function createCardPreview(product: IProduct, inBasket: boolean): HTMLElement {
    const container = getElementFromTemplate(cardPreviewTemplate);
    const card = new CardPreview(
        container,
        events,
        (id: string) => {
            events.emit('basket:add', { id });
        },
        (id: string) => {
            events.emit('basket:remove', { id });
        }
    );
    card.inBasket = inBasket;
    const productWithImage = {
        ...product,
        image: getImageUrl(product.image)
    };
    return card.render(productWithImage);
}

function createCardBasket(product: IProduct, index: number): HTMLElement {
    const container = getElementFromTemplate(cardBasketTemplate);
    const card = new CardBasket(container, events, (id: string) => {
        events.emit('basket:remove', { id });
    });
    return card.render({ product, index });
}

function updateBasketView(): void {
    const items = cart.getItems();
    const container = getElementFromTemplate(basketTemplate);
    const basket = new Basket(container, events);
    const cardElements = items.map((item, index) => createCardBasket(item, index + 1));
    basket.items = cardElements;
    basket.total = cart.getTotalPrice();
    basket.disabled = items.length === 0;
    modal.content = basket.render({ items: cardElements, total: cart.getTotalPrice() });
}

function updateBasketCounter(): void {
    page.counter = cart.getItemCount();
}

// ============================================
// ОБРАБОТЧИКИ СОБЫТИЙ ОТ МОДЕЛЕЙ
// ============================================

events.on('catalog:changed', () => {
    const products = catalog.getProducts();
    const cards = products.map(product => createCardCatalog(product));
    page.catalog = cards;
});

events.on('cart:changed', () => {
    updateBasketCounter();
});

// ============================================
// ОБРАБОТЧИКИ СОБЫТИЙ ОТ ПРЕДСТАВЛЕНИЙ
// ============================================

// Выбор карточки для просмотра (ОДИН обработчик!)
events.on('card:select', ({ id }: { id: string }) => {
    const product = catalog.getProductById(id);
    if (product) {
        catalog.setSelectedProduct(product);
        const inBasket = cart.contains(product.id);
        const cardPreview = createCardPreview(product, inBasket);
        modal.content = cardPreview;
        modal.open();
    }
});

// Добавление товара в корзину
events.on('basket:add', ({ id }: { id: string }) => {
    const product = catalog.getProductById(id);
    if (product && !cart.contains(product.id)) {
        cart.addItem(product);
    }
    if (modal.isOpen && product) {
        const updatedPreview = createCardPreview(product, true);
        modal.content = updatedPreview;
    }
});

// Удаление товара из корзины
events.on('basket:remove', ({ id }: { id: string }) => {
    cart.removeItem(id);
    
    // Проверяем, что сейчас открыто в модальном окне
    const isBasketOpen = document.querySelector('.basket') !== null;
    const isPreviewOpen = document.querySelector('.card.card_full') !== null;
    
    if (isBasketOpen) {
        // Если открыта корзина - обновляем её содержимое
        updateBasketView();
    } else if (isPreviewOpen) {
        // Если открыто превью товара - просто обновляем кнопку
        const product = catalog.getProductById(id);
        if (product) {
            const updatedPreview = createCardPreview(product, false);
            modal.content = updatedPreview;
        }
    }
    
    // Обновляем счётчик корзины
    updateBasketCounter();
});

// Открытие корзины
events.on('basket:open', () => {
    updateBasketView();
    modal.open();
});

// Открытие формы заказа
events.on('order:submit', () => {
    const orderFormContainer = getElementFromTemplate(orderTemplate) as HTMLFormElement;
    const orderForm = new OrderForm(orderFormContainer, events);
    const data = buyer.getData();
    orderForm.address = data.address;
    orderForm.payment = data.payment;
    modal.content = orderForm.render({ address: data.address, payment: data.payment });
    modal.open();
});

// Изменение полей формы заказа
events.on('order:change', ({ field, value }: { field: string; value: string }) => {
    if (field === 'address') {
        buyer.setAddress(value);
    } else if (field === 'payment') {
        buyer.setPayment(value as 'cash' | 'card');
    }
});

// Сабмит формы заказа → переход к контактам
events.on('order:form-submit', () => {
    const contactsFormContainer = getElementFromTemplate(contactsTemplate) as HTMLFormElement;
    const contactsForm = new ContactsForm(contactsFormContainer, events);
    const data = buyer.getData();
    contactsForm.email = data.email;
    contactsForm.phone = data.phone;
    modal.content = contactsForm.render({ email: data.email, phone: data.phone });
});

// Изменение полей формы контактов
events.on('contacts:change', ({ field, value }: { field: string; value: string }) => {
    if (field === 'email') {
        buyer.setEmail(value);
    } else if (field === 'phone') {
        buyer.setPhone(value);
    }
});

// Сабмит формы контактов
events.on('contacts:form-submit', async () => {
    const errors = buyer.validate();
    if (errors) {
        console.error('Ошибки валидации:', errors);
        events.emit('contacts:errors', { errors });
        return;
    }

    const orderData: IOrder = {
        payment: buyer.getData().payment,
        email: buyer.getData().email,
        phone: buyer.getData().phone,
        address: buyer.getData().address,
        total: cart.getTotalPrice(),
        items: cart.getItems().map(item => item.id)
    };

    try {
        const result = await appApi.sendOrder(orderData);
        const successContainer = getElementFromTemplate(successTemplate);
        const success = new Success(successContainer, events);
        success.total = result.total;
        modal.content = success.render({ total: result.total });
        cart.clear();
        buyer.clear();
    } catch (error) {
        console.error('Ошибка при отправке заказа:', error);
        events.emit('order:error', { error });
    }
});

// Закрытие окна успеха
events.on('success:close', () => {
    modal.close();
});

// Блокировка прокрутки
events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});

// ============================================
// ЗАГРУЗКА ДАННЫХ
// ============================================

appApi.getProducts()
    .then(data => {
        if (data.items && Array.isArray(data.items)) {
            catalog.setProducts(data.items);
        }
    })
    .catch(err => {
        console.error('Ошибка при загрузке товаров:', err);
    });