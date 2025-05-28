import { configureStore } from '@reduxjs/toolkit';
import { ingredientsReducer, loadIngredients } from './ingregient-slice';
import { TIngredient } from '@utils-types';

describe('Тесты для ingredientsSlice', () => {
  // Тестовые данные
  const mockIngredients: TIngredient[] = [
    {
      _id: '60d3b41abdacab0026a733c6',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
    },
    {
      _id: '60d3b41abdacab0026a733c7',
      name: 'Флюоресцентная булка R2-D3',
      type: 'bun',
      proteins: 44,
      fat: 26,
      carbohydrates: 85,
      calories: 643,
      price: 988,
      image: 'https://code.s3.yandex.net/react/code/bun-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png'
    }
  ];

  // Создаем тестовый store
  const setupTestStore = () =>
    configureStore({
      reducer: {
        ingredients: ingredientsReducer
      }
    });

  it('Начальное состояние должно быть корректным', () => {
    const store = setupTestStore();
    const initialState = store.getState().ingredients;

    expect(initialState).toEqual({
      loading: true,
      error: null,
      ingredients: []
    });
  });

  describe('Экшен loadIngredients', () => {
    it('Должен устанавливать loading=true при начале загрузки', () => {
      const store = setupTestStore();
      store.dispatch({ type: loadIngredients.pending.type });

      const state = store.getState().ingredients;
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('Должен сохранять ингредиенты и сбрасывать loading при успешной загрузке', () => {
      const store = setupTestStore();
      store.dispatch({
        type: loadIngredients.fulfilled.type,
        payload: mockIngredients
      });

      const state = store.getState().ingredients;
      expect(state.loading).toBe(false);
      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.error).toBeNull();
    });

    it('Должен сохранять ошибку и сбрасывать loading при неудачной загрузке', () => {
      const testError = { message: 'Ошибка загрузки ингредиентов' };
      const store = setupTestStore();
      store.dispatch({
        type: loadIngredients.rejected.type,
        error: testError
      });

      const state = store.getState().ingredients;
      expect(state.loading).toBe(false);
      expect(state.error).toEqual(testError);
      expect(state.ingredients).toEqual([]);
    });
  });
});
