/// <reference types="cypress" />
import * as orderFixture from '../fixtures/order.json';
import * as ingredientsFixture from '../fixtures/ingredients.json';
import * as userFixture from '../fixtures/user.json';

const testUrl = 'http://localhost:4000';
const bunSelector = '[data-testid="ingredient-bun"]';
const mainSelector = '[data-testid="ingredient-main"]';
const sauceSelector = '[data-testid="ingredient-sauce"]';
const constructorSelector = '[data-testid="burger-constructor"]';
const orderButtonSelector = '[data-testid="order-button"]';
const modalSelector = '[data-testid="modal"]';

describe('Тестирование конструктора бургеров', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.visit(testUrl);
  });

  it('Должен отображать ингредиенты', () => {
    cy.get(bunSelector).should('have.length.at.least', 2);
    cy.get(mainSelector).should('have.length.at.least', 1);
    cy.get(sauceSelector).should('have.length.at.least', 1);
  });

  describe('Работа с модальными окнами', () => {
    it('Должен открывать модальное окно с деталями ингредиента', () => {
      cy.get(`${bunSelector}:first`).click();
      cy.get(modalSelector).should('be.visible');
      cy.get(modalSelector).contains(ingredientsFixture[0].name);
    });

    it('Должен закрывать модальное окно по клику на крестик', () => {
      cy.get(`${bunSelector}:first`).click();
      cy.get(`${modalSelector} [data-testid="modal-close"]`).click();
      cy.get(modalSelector).should('not.exist');
    });
  });

  describe('Процесс оформления заказа', () => {
    beforeEach(() => {
      cy.setCookie('accessToken', 'test-token');
      localStorage.setItem('refreshToken', 'test-refresh-token');
      cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
      cy.intercept('POST', 'api/orders', { fixture: 'order.json' });
    });

    it('Должен оформлять заказ для авторизованного пользователя', () => {
      // Добавляем булку
      cy.get(`${bunSelector}:first`).trigger('dragstart');
      cy.get(constructorSelector).trigger('drop');
      
      // Добавляем начинку
      cy.get(`${mainSelector}:first`).trigger('dragstart');
      cy.get(constructorSelector).trigger('drop');

      // Проверяем активность кнопки
      cy.get(orderButtonSelector).should('not.be.disabled');
      
      // Оформляем заказ
      cy.get(orderButtonSelector).click();
      
      // Проверяем модальное окно заказа
      cy.get(modalSelector).should('be.visible');
      cy.get(modalSelector).contains(`#${orderFixture.order.number}`);
      
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
    // Добавляем ингредиенты
    cy.get(`${bunSelector}:first`).trigger('dragstart');
    cy.get(constructorSelector).trigger('drop');
    
    // Пытаемся оформить заказ
    cy.get(orderButtonSelector).click();
    
    // Проверяем перенаправление
    cy.url().should('include', '/login');
  });
});