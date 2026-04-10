import "./scss/styles.scss";


import { ProductCatalog } from './components/models/ProductCatalog';
import { Cart } from './components/models/Cart';
import { Buyer } from './components/models/Buyer';
import { AppApi } from './components/layer/AppApi';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { IProduct } from './types';
import { apiProducts } from './utils/data';

// 1. Создание экземпляров моделей данных
const catalog = new ProductCatalog();
const cart = new Cart();
const buyer = new Buyer();

// 2. Инициализация слоя коммуникации с сервером
const apiInstance = new Api(API_URL);
const appApi = new AppApi(apiInstance);

const id: string = apiProducts.items[0].id; // тестирование

// 3. Тестирование моделей на локальных данных
console.info('Тестирование моделей данных (локальные данные)');

const testProducts: IProduct[] = apiProducts.items;
catalog.setProducts(testProducts);
console.info('Каталог (тест):', catalog.getProducts());
console.log('Товар с индексом 0:', catalog.getProductById(id));
catalog.setSelectedProduct(testProducts[0]);
console.log('Выбранный товар:', catalog.getSelectedProduct());

cart.addItem(testProducts[0]);
cart.addItem(testProducts[1]);
console.log('Корзина после добавления двух товаров:', cart.getItems());
console.log('Общая стоимость:', cart.getTotalPrice());
console.log('Количество товаров:', cart.getItemCount());
cart.removeItem(id);
console.log('Корзина после удаления:', cart.getItems());
cart.clear();
console.log('Корзина после очистки:', cart.getItems());

buyer.setData({ email: 'test@test.ru', phone: '+71234567890' });
console.log('Данные покупателя (частично):', buyer.getData());
console.log('Валидация (не полная):', buyer.validate());
buyer.setPayment('card');
buyer.setAddress('Москва');
console.log('Полные данные покупателя:', buyer.getData());
console.log('Валидация (полная):', buyer.validate());
buyer.clear();
console.log('Данные после очистки:', buyer.getData());

// 4. Получение реальных товаров с сервера
console.log('Загрузка товаров с сервера');
appApi
  .getProducts()
  .then((data) => {
    console.log('Ответ сервера:', data);
    if (data.items && Array.isArray(data.items)) {
      catalog.setProducts(data.items);
      console.log('Каталог после загрузки с сервера:', catalog.getProducts());
    } else {
      console.error('Неправильный формат ответа:', data);
    }
  })
  .catch((err) => {
    console.error('Ошибка при загрузке товаров:', err);
  });
