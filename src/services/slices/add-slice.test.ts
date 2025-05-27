import { configureStore } from '@reduxjs/toolkit';
import {
  ordersReducer,
  initialOrdersState,
  fetchOrderDetails,
  loadAllOrders,
  createNewOrder,
  clearCurrentOrder
} from './add-slice';

describe('ordersSlice тесты', () => {
  let store: ReturnType<typeof createTestStore>;

  const createTestStore = () =>
    configureStore({
      reducer: {
        orders: ordersReducer
      }
    });

  beforeEach(() => {
    store = createTestStore();
  });

  describe('Экшен fetchOrderDetails (получение деталей заказа)', () => {
    it('должен устанавливать loadingOrder в true при pending', () => {
      store.dispatch({ type: fetchOrderDetails.pending.type });
      const state = store.getState().orders;
      expect(state.loadingOrder).toBe(true);
    });

    it('должен сохранять заказ и устанавливать loadingOrder в false при fulfilled', () => {
      const mockOrder = {
        _id: '1',
        number: 123,
        ingredients: ['ing1', 'ing2'],
        status: 'done',
        name: 'Test order',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01'
      };
      
      store.dispatch({
        type: fetchOrderDetails.fulfilled.type,
        payload: mockOrder
      });
      
      const state = store.getState().orders;
      expect(state.currentOrder).toEqual(mockOrder);
      expect(state.loadingOrder).toBe(false);
    });

    it('должен сбрасывать loadingOrder при rejected', () => {
      store.dispatch({ type: fetchOrderDetails.rejected.type });
      const state = store.getState().orders;
      expect(state.loadingOrder).toBe(false);
    });
  });

  describe('Экшен loadAllOrders (загрузка всех заказов)', () => {
    it('должен устанавливать loadingOrders в true и сбрасывать ошибку при pending', () => {
      // Предварительно устанавливаем ошибку
      store.dispatch({
        type: loadAllOrders.rejected.type,
        error: { message: 'Test error' }
      });
      
      store.dispatch({ type: loadAllOrders.pending.type });
      const state = store.getState().orders;
      
      expect(state.loadingOrders).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен сохранять список заказов и сбрасывать loadingOrders при fulfilled', () => {
      const mockOrders = [
        {
          _id: '1',
          number: 1,
          ingredients: ['ing1'],
          status: 'done',
          name: 'Order 1',
          createdAt: '2023-01-01',
          updatedAt: '2023-01-01'
        },
        {
          _id: '2',
          number: 2,
          ingredients: ['ing2'],
          status: 'pending',
          name: 'Order 2',
          createdAt: '2023-01-02',
          updatedAt: '2023-01-02'
        }
      ];
      
      store.dispatch({
        type: loadAllOrders.fulfilled.type,
        payload: mockOrders
      });
      
      const state = store.getState().orders;
      expect(state.ordersList).toEqual(mockOrders);
      expect(state.loadingOrders).toBe(false);
    });

    it('должен сохранять ошибку и сбрасывать loadingOrders при rejected', () => {
      const mockError = { message: 'Failed to load orders' };
      
      store.dispatch({
        type: loadAllOrders.rejected.type,
        error: mockError
      });
      
      const state = store.getState().orders;
      expect(state.error).toEqual(mockError);
      expect(state.loadingOrders).toBe(false);
    });
  });

  describe('Экшен createNewOrder (создание нового заказа)', () => {
    it('должен устанавливать creatingOrder в true при pending', () => {
      store.dispatch({ type: createNewOrder.pending.type });
      const state = store.getState().orders;
      expect(state.creatingOrder).toBe(true);
    });

    it('должен сохранять новый заказ и сбрасывать creatingOrder при fulfilled', () => {
      const mockResponse = {
        order: {
          _id: '3',
          number: 3,
          ingredients: ['ing1', 'ing2'],
          status: 'created',
          name: 'New order',
          createdAt: '2023-01-03',
          updatedAt: '2023-01-03'
        },
        name: 'New order'
      };
      
      store.dispatch({
        type: createNewOrder.fulfilled.type,
        payload: mockResponse
      });
      
      const state = store.getState().orders;
      expect(state.currentOrder).toEqual(mockResponse.order);
      expect(state.creatingOrder).toBe(false);
    });

    it('должен сбрасывать creatingOrder при rejected', () => {
      store.dispatch({ type: createNewOrder.rejected.type });
      const state = store.getState().orders;
      expect(state.creatingOrder).toBe(false);
    });
  });

  describe('Редьюсер clearCurrentOrder', () => {
    it('должен сбрасывать currentOrder в null', () => {
      // Сначала устанавливаем текущий заказ
      store.dispatch({
        type: fetchOrderDetails.fulfilled.type,
        payload: {
          _id: '1',
          number: 1,
          ingredients: ['ing1'],
          status: 'done',
          name: 'Test order',
          createdAt: '2023-01-01',
          updatedAt: '2023-01-01'
        }
      });
      
      // Затем очищаем
      store.dispatch(clearCurrentOrder());
      
      const state = store.getState().orders;
      expect(state.currentOrder).toBeNull();
    });
  });

  describe('Начальное состояние', () => {
    it('должно соответствовать initialOrdersState', () => {
      const state = store.getState().orders;
      expect(state).toEqual(initialOrdersState);
    });
  });
});