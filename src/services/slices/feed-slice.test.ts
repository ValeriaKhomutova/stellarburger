import { configureStore } from '@reduxjs/toolkit';
import { feedReducer, fetchFeedData } from './feed-slice';
import { TOrdersData } from '@utils-types';

describe('Тесты для feedSlice', () => {
  // Мокируем данные для тестов
  const mockFeedData: TOrdersData = {
    orders: [
      {
        _id: 'order1',
        ingredients: ['ing1', 'ing2'],
        status: 'done',
        name: 'Space Burger',
        createdAt: '2023-10-10T12:00:00.000Z',
        updatedAt: '2023-10-10T12:00:00.000Z',
        number: 1
      }
    ],
    total: 100,
    totalToday: 5
  };

  const createTestStore = () =>
    configureStore({
      reducer: {
        feed: feedReducer
      }
    });

  it('Начальное состояние должно быть корректным', () => {
    const store = createTestStore();
    const state = store.getState().feed;

    expect(state).toEqual({
      loading: true,
      error: null,
      feedData: {
        orders: [],
        total: NaN,
        totalToday: NaN
      }
    });
  });

  describe('Экшен fetchFeedData', () => {
    it('устанавка loading в true', () => {
      const store = createTestStore();
      store.dispatch({ type: fetchFeedData.pending.type });
      const state = store.getState().feed;

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('Должен сохранять данные и сбрасывать loading при fulfilled', () => {
      const store = createTestStore();
      store.dispatch({
        type: fetchFeedData.fulfilled.type,
        payload: mockFeedData
      });
      const state = store.getState().feed;

      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.feedData).toEqual(mockFeedData);
    });

    it('Должен сохранять ошибку и сбрасывать loading при rejected', () => {
      const testError = { message: 'Ошибка сети' };
      const store = createTestStore();
      store.dispatch({
        type: fetchFeedData.rejected.type,
        error: testError
      });
      const state = store.getState().feed;

      expect(state.loading).toBe(false);
      expect(state.error).toEqual(testError);
      expect(state.feedData.orders).toHaveLength(0);
    });
  });
});
