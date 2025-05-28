
import * as orderFixture from '../fixtures/order.json';
import * as ingredientsFixture from '../fixtures/ingredients.json';
import * as userFixture from '../fixtures/user.json';
const ingridientSelector = '[data-testid="ingredient"]';;
const constructorSelector = '[data-testid="burger-constructor"]';
const orderButtonSelector = '[data-testid="order-button"]';
const modalSelector = '[data-testid="modal"]';

describe('Тестирование конструктора бургеров', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.visit('');
  });

  it('Должен отображать ингредиенты', () => {
    cy.get(ingridientSelector).should('have.length.at.least', 1);
  });

  describe('Работа с модальными окнами', () => {
    it('Должен открывать модальное окно с деталями ингредиента', () => {
      cy.get(`${ingridientSelector}:first`).click();
      cy.get(modalSelector).should('be.visible');
      cy.get(modalSelector).contains("Краторная булка N-200i");
    });

    it('Должен закрывать модальное окно по клику на крестик', () => {
      cy.get(`${ingridientSelector}:first`).click();
      cy.get(`[data-testid="modal-close"]`).click();
      cy.get(modalSelector).should('not.exist');
    });
  });


  describe('Процесс оформления заказа', () => {
    beforeEach(() => {
      cy.setCookie('accessToken', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzY1NzlkYzJmMzBjMDAxY2IyN2NmMSIsImlhdCI6MTc0ODM5MjU0MCwiZXhwIjoxNzQ4MzkzNzQwfQ.rhSBYUb6_mRP76jBp3QO4NJZLzFRkcekx2ge1021IAc');
      localStorage.setItem('refreshToken', 'e346aa31fe1f9bdb77b92630d0b2cfd67efe0edd8911551dfd42b2df13867393a827b6b7fa338aec');
      cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
      cy.intercept('POST', 'api/orders', { fixture: 'order.json' });
    });

    it('Должен оформлять заказ для авторизованного пользователя', () => {
      cy.get(constructorSelector).as('constructorburger');
      // Добавляем булку
      //cy.addConstructorItem('Флюоресцентная булка R2-D3');
      cy.addConstructorItem('Булки')
      
      // Добавляем начинку
      //cy.addConstructorItem('Филе Люминесцентного тетраодонтимформа');
      cy.addConstructorItem('Начинки')

      // Добавим соус
      cy.addConstructorItem('Соусы')
      
      // Оформляем заказ
      cy.get('@constructorburger').children('div').children('button').click();
      
      // Проверяем модальное окно заказа
      cy.get(modalSelector).should('be.visible');
      cy.get(modalSelector).should('contain',`${orderFixture.order.number}`);
      
      // Закрываем модальное окно
      cy.get(`${modalSelector} [data-testid="modal-close"]`).click();
      cy.get(modalSelector).should('not.exist');
    });


    afterEach(() => {
      cy.clearCookie('accessToken');
      localStorage.removeItem('refreshToken');
    });
  });

  it('Должен перенаправлять на логин при попытке заказа без авторизации', () => {
    cy.get(constructorSelector).as('constructorburger');
    // Добавляем ингредиент
    cy.addConstructorItem('Булки')
    
    // Пытаемся оформить заказ
    cy.get('@constructorburger').children('div').children('button').click();
    
    // Проверяем перенаправление
    cy.url().should('include', '/login');
  });
  
});