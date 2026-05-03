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
import { Header } from './components/view/Header';
import { CardCatalog } from './components/view/CardCatalog';
import { CardPreview } from './components/view/CardPreview';
import { CardBasket } from './components/view/CardBasket';
import { Basket } from './components/view/Basket';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';
import { Success } from './components/view/Success';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Gallery } from './components/view/Gallery';

const events = new EventEmitter();

const catalog = new ProductCatalog(events);
const cart = new Cart(events);
const buyer = new Buyer(events);

const api = new Api(API_URL);
const appApi = new AppApi(api);

const modalContainer = document.querySelector('#modal-container') as HTMLElement;

const galleryContainer = document.querySelector('.gallery') as HTMLElement;
const headerContainer = document.querySelector('.header') as HTMLElement;

const modal = new Modal(modalContainer, events);
const gallery = new Gallery(galleryContainer, events);
const header = new Header(headerContainer, events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ

function getImageUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${CDN_URL}/${cleanPath}`;
}


function createCardCatalog(product: IProduct): HTMLElement {
     const container = cloneTemplate(cardCatalogTemplate);
    const card = new CardCatalog(container, events, {
			onClick: () => events.emit('card:select', product),
		});
    const productWithImage = {
        ...product,
        image: getImageUrl(product.image)
    };
    return card.render(productWithImage);
}

function createCardPreview(product: IProduct, inBasket: boolean): HTMLElement {
    const container = cloneTemplate(cardPreviewTemplate);
    const card = new CardPreview(container, events, {
        onButtonClick: () => {
            if (!inBasket) {
                events.emit('basket:add', product);
            } else {
                events.emit('basket:remove', product);
            }
            modal.close();
        }
    });
    
    card.id = product.id;
    card.title = product.title;
    card.category = product.category;
    card.image = getImageUrl(product.image);
    card.description = product.description;
    card.price = product.price;
    card.inBasket = inBasket;
    
    return card.render();
}

function createCardBasket(product: IProduct, index: number): HTMLElement {
    const container = cloneTemplate(cardBasketTemplate);
    const card = new CardBasket(container, events, {
        onRemove: () => {
            events.emit('basket:remove', product);
            // Обновляем отображение корзины, если она открыта
            const isBasketOpen = document.querySelector('.basket') !== null;
            if (isBasketOpen) {
                updateBasketView();
            }
        }
    });
    
    card.index = index;
    card.product = product;
    
    return card.render();
}

function updateBasketView(): void {
    const items = cart.getItems();
    const container = cloneTemplate(basketTemplate);
    const basket = new Basket(container, events);
    const cardElements = items.map((item, idx) => createCardBasket(item, idx + 1));
    
    basket.items = cardElements;
    basket.total = cart.getTotalPrice();
    basket.disabled = items.length === 0;
    
    modal.content = basket.render();
}

function updateBasketCounter(): void {
    header.counter = cart.getItemCount();
}

// ОБРАБОТЧИКИ СОБЫТИЙ ОТ МОДЕЛЕЙ

events.on('catalog:changed', () => {
    const products = catalog.getProducts();
    const cards = products.map(product => createCardCatalog(product));
    gallery.catalog = cards;
});

events.on('cart:changed', () => {
    updateBasketCounter();
});

// ОБРАБОТЧИКИ СОБЫТИЙ ОТ ПРЕДСТАВЛЕНИЙ

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
        modal.close();
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
        // Если открыто превью товара - просто закрываем окно
        modal.close();
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
    const orderFormContainer = cloneTemplate(orderTemplate) as HTMLFormElement;
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
        buyer.setData({ address: value });
    } else if (field === 'payment') {
        buyer.setData({ payment: value as 'cash' | 'card' });
    }
});


// Сабмит формы заказа → переход к контактам
events.on('order:form-submit', () => {
   const data = buyer.getData();
    if (!data.payment || !data.address.trim()) return;
    
    const contactsFormContainer = cloneTemplate(contactsTemplate) as HTMLFormElement;
    const contactsForm = new ContactsForm(contactsFormContainer, events);
    contactsForm.email = data.email;
    contactsForm.phone = data.phone;
    modal.content = contactsForm.render({ email: data.email, phone: data.phone });
});

events.on('contacts:change', ({ field, value }: { field: string; value: string }) => {
    if (field === 'email') {
        buyer.setData({ email: value });
    } else if (field === 'phone') {
        buyer.setData({ phone: value });
    }
});

// Сабмит формы контактов
events.on('contacts:form-submit', async () => {
    const errors = buyer.validate();
    
    // Проверяем, есть ли ошибки
    if (Object.keys(errors).length > 0) {
        console.error('Ошибки валидации:', errors);
        events.emit('contacts:errors', { errors });
        return;
    }

    const data = buyer.getData();
    
    if (!data.payment) {
        console.error('Способ оплаты не выбран');
        return;
    }

    const orderData: IOrder = {
        payment: data.payment,
        email: data.email,
        phone: data.phone,
        address: data.address,
        total: cart.getTotalPrice(),
        items: cart.getItems().map(item => item.id)
    };

    try {
        const result = await appApi.sendOrder(orderData);
        const successContainer = cloneTemplate(successTemplate);
        const success = new Success(successContainer, events);
        success.total = result.total;
        modal.content = success.render({ total: result.total });
        cart.clear();
        buyer.setData({ payment: null, email: '', phone: '', address: '' });
    } catch (error) {
        console.error('Ошибка при отправке заказа:', error);
        events.emit('order:error', { error });
    }
});

// Закрытие окна успеха
events.on('success:close', () => {
    modal.close();
});


// ЗАГРУЗКА ДАННЫХ

appApi.getProducts()
    .then(data => {
        if (data.items && Array.isArray(data.items)) {
            catalog.setProducts(data.items);
        }
    })
    .catch(err => {
        console.error('Ошибка при загрузке товаров:', err);
    });