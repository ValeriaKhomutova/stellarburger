import { burgerReducer } from './build-burger-slice';
import { v4 as uuidv4 } from 'uuid';
import {
  updateBun,
  addConstructorItem,
  deleteConstructorItem,
  reorderConstructorItem,
  clearConstructor
} from './build-burger-slice';
import { TIngredient } from '@utils-types';

// Мокируем генерацию UUID
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-unique-id')
}));

describe('Тесты для burgerConstructorSlice', () => {
  const mockIngredient: TIngredient = {
    _id: 'ingredient-1',
    name: 'Котлета',
    type: 'main',
    proteins: 200,
    fat: 50,
    carbohydrates: 20,
    calories: 300,
    price: 100,
    image: 'image.jpg',
    image_large: 'image-large.jpg',
    image_mobile: 'image-mobile.jpg'
  };

  const mockBun: TIngredient = {
    ...mockIngredient,
    _id: 'bun-1',
    name: 'Булочка',
    type: 'bun'
  };

  it('Начальное состояние пустое', () => {
    expect(burgerReducer(undefined, { type: 'unknown' })).toEqual({
      bun: null,
      ingredients: []
    });
  });

  describe('Экшен updateBun', () => {
    it('обновление булки в конструкторе', () => {
      const result = burgerReducer(undefined, updateBun(mockBun));
      expect(result.bun).toEqual(mockBun);
    });

    it('сброс булки при передаче null', () => {
      const state = { bun: mockBun, ingredients: [] };
      const result = burgerReducer(state, updateBun(null));
      expect(result.bun).toBeNull();
    });
  });

  describe('Экшен addConstructorItem', () => {
    it('добавить ингредиент с уникальным ID', () => {
      const result = burgerReducer(
        undefined,
        addConstructorItem(mockIngredient)
      );

      expect(result.ingredients).toHaveLength(1);
      expect(result.ingredients[0]).toMatchObject({
        ...mockIngredient,
        id: 'test-unique-id'
      });
    });

    it('замена булки, если добавляется новая', () => {
      const result = burgerReducer(
        { bun: mockBun, ingredients: [] },
        addConstructorItem({ ...mockBun, _id: 'bun-2' })
      );

      expect(result.bun?._id).toBe('bun-2');
      expect(result.ingredients).toHaveLength(0);
    });
  });

  describe('Экшен deleteConstructorItem', () => {
    it('Удаление ингредиента по ID', () => {
      const state = {
        bun: null,
        ingredients: [
          { ...mockIngredient, id: 'to-keep' },
          { ...mockIngredient, id: 'to-delete' }
        ]
      };

      const result = burgerReducer(state, deleteConstructorItem('to-delete'));

      expect(result.ingredients).toHaveLength(1);
      expect(result.ingredients[0].id).toBe('to-keep');
    });
  });

  describe('Экшен reorderConstructorItem', () => {
    const ingredients = [
      { ...mockIngredient, id: '1' },
      { ...mockIngredient, id: '2' },
      { ...mockIngredient, id: '3' }
    ];

    it('Должен перемещать ингредиент вверх', () => {
      const state = { bun: null, ingredients };
      const result = burgerReducer(
        state,
        reorderConstructorItem({ index: 1, moveUp: true })
      );

      expect(result.ingredients.map((i) => i.id)).toEqual(['2', '1', '3']);
    });

    it('Должен перемещать ингредиент вниз', () => {
      const state = { bun: null, ingredients };
      const result = burgerReducer(
        state,
        reorderConstructorItem({ index: 1, moveUp: false })
      );

      expect(result.ingredients.map((i) => i.id)).toEqual(['1', '3', '2']);
    });
  });

  describe('Экшен clearConstructor', () => {
    it('Очищение конструктора', () => {
      const state = {
        bun: mockBun,
        ingredients: [
          { ...mockIngredient, id: '1' },
          { ...mockIngredient, id: '2' }
        ]
      };

      const result = burgerReducer(state, clearConstructor());

      expect(result).toEqual({
        bun: null,
        ingredients: []
      });
    });
  });
});
