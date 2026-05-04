import './scss/styles.scss';

import { Api } from './components/base/Api';
import { API_URL, CDN_URL } from './utils/constants';
import { ProductCatalog } from './components/models/ProductCatalog';
import { Cart } from './components/models/Cart';
import { Buyer } from './components/models/Buyer';
import { Modal } from './components/common/Modal';
import { IProduct, IOrder, TPayment } from './types';
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

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const modalContainer = ensureElement<HTMLElement>('#modal-container');
const galleryContainer = ensureElement<HTMLElement>('.gallery');
const headerContainer = ensureElement<HTMLElement>('.header');

const modal = new Modal(modalContainer, events);
const gallery = new Gallery(galleryContainer, events);
const header = new Header(headerContainer, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderForm = new OrderForm(
  cloneTemplate(orderTemplate) as HTMLFormElement,
  events
);
const contactsForm = new ContactsForm(
  cloneTemplate(contactsTemplate) as HTMLFormElement,
  events
);
const success = new Success(cloneTemplate(successTemplate), events, {
  onClick: () => modal.close(),
});

const cardPreview = new CardPreview(
  cloneTemplate(cardPreviewTemplate),
  events,
  {
    onButtonClick: handleCardPreviewButtonClick,
  }
);

// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ

function getImageUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${CDN_URL}/${cleanPath}`;
}

function handleCardPreviewButtonClick(): void {
  const product = catalog.getSelectedProduct();
  if (!product || product.price === null || product.price === 0) return;

  if (cart.contains(product.id)) {
    cart.removeItem(product.id);
  } else {
    cart.addItem(product);
  }

  modal.close();
}

// ОБРАБОТЧИКИ СОБЫТИЙ

// Каталог
events.on('catalog:changed', () => {
  const products = catalog.getProducts();
  const cards = products.map((product) => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), events, {
      onClick: () => events.emit('card:select', product),
    });
    const productWithImage = {
      ...product,
      image: getImageUrl(product.image)
    };
    return card.render(productWithImage);
  });
  gallery.catalog = cards;
});

// Просмотр товара
events.on('card:select', (product: IProduct) => {
  catalog.setSelectedProduct(product);
});

events.on('catalog:selected', () => {
  const product = catalog.getSelectedProduct();

  if (!product) return;

  const isAvailable = product.price !== null && product.price !== 0;

  const container = cardPreview.render({
    title: product.title,
    category: product.category,
    image: getImageUrl(product.image),
    description: product.description,
    price: product.price
  });

  cardPreview.buttonDisabled = !isAvailable;
  cardPreview.buttonText = !isAvailable ? 'Недоступно' : (cart.contains(product.id) ? 'Убрать из корзины' : 'В корзину');

  modal.content = container;
  modal.open();
});

// Корзина
events.on('cart:changed', () => {
  header.counter = cart.getItemCount();

  const items = cart.getItems();
  const cards = items.map((item, index) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), events, {
      onRemove: () => cart.removeItem(item.id),
    });
    card.index = index + 1;
    card.product = item;
    return card.render();
  });

  basket.items = cards;
  basket.total = cart.getTotalPrice();
  basket.disabled = items.length === 0;
});

events.on('buyer:changed', () => {
  const data = buyer.getData();
  const errors = buyer.validate();

  orderForm.address = data.address;
  orderForm.payment = data.payment;
  orderForm.valid = !errors?.payment && !errors?.address;
  orderForm.errors = errors?.address || errors?.payment || '';

  contactsForm.email = data.email;
  contactsForm.phone = data.phone;
  contactsForm.valid = !errors?.email && !errors?.phone;
  contactsForm.errors = errors?.email || errors?.phone || '';
});

events.on('basket:open', () => {
  const items = cart.getItems();
  basket.disabled = items.length === 0;
  modal.content = basket.render();
  modal.open();
});

events.on('order:submit', () => {
  const data = buyer.getData();
  orderForm.address = data.address;
  orderForm.payment = data.payment;
  modal.render({ content: orderForm.render() });
});

// Изменение полей формы заказа
events.on('order:payment-change', ({ payment }: { payment: TPayment }) => {
  const data = buyer.getData();
  buyer.setData({ ...data, payment });
});

events.on(
  'order:change',
  ({ field, value }: { field: string; value: string }) => {
    if (field === 'address') {
      const data = buyer.getData();
      buyer.setData({ ...data, address: value });
    }
  }
);

events.on('order:form-submit', () => {
  const data = buyer.getData();
  contactsForm.email = data.email;
  contactsForm.phone = data.phone;
  contactsForm.reset();
  modal.render({ content: contactsForm.render() });
});

// Форма контактов
events.on(
  'contacts:change',
  ({ field, value }: { field: string; value: string }) => {
    const data = buyer.getData();
    if (field === 'email') {
      buyer.setData({ ...data, email: value });
    } else if (field === 'phone') {
      buyer.setData({ ...data, phone: value });
    }
  }
);

events.on('contacts:form-submit', async () => {
  const data = buyer.getData();
  const orderData: IOrder = {
    payment: data.payment!,
    email: data.email,
    phone: data.phone,
    address: data.address,
    total: cart.getTotalPrice(),
    items: cart.getItems().map((item) => item.id),
  };

  try {
    const result = await appApi.sendOrder(orderData);
    cart.clear();
    buyer.clear();
    success.total = result.total;
    modal.render({ content: success.render() });
  } catch (error) {
    console.error('Ошибка при отправке заказа:', error);
  }
});

// ЗАГРУЗКА ДАННЫХ

appApi
  .getProducts()
  .then((data) => {
    if (data.items && Array.isArray(data.items)) {
      catalog.setProducts(data.items);
    }
  })
  .catch((err) => {
    console.error('Ошибка при загрузке товаров:', err);
  });
