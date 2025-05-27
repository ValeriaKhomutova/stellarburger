import store from './store';
import { createNewOrder } from './slices/add-slice';
import { clearConstructor } from './slices/build-burger-slice';

// Мокаем clearConstructor, чтобы отследить его вызов
jest.mock('./slices/build-burger-slice', () => ({
  ...jest.requireActual('./slices/build-burger-slice'),
  clearConstructor: jest.fn(() => ({ type: 'CLEAR_CONSTRUCTOR' }))
}));

describe('Redux Store', () => {
  it('должен содержать все необходимые редьюсеры в состоянии', () => {
    const state = store.getState();

    expect(state).toHaveProperty('ordersReducer');
    expect(state).toHaveProperty('authReducer');
    expect(state).toHaveProperty('burgerReducer');
    expect(state).toHaveProperty('feedReducer');
    expect(state).toHaveProperty('ingredientsReducer');
  });

  it('должен безопасно обрабатывать неизвестные действия', () => {
    const unknownAction = { type: 'NON_EXISTENT_ACTION' };

    expect(() => {
      store.dispatch(unknownAction);
    }).not.toThrow();
  });

  it('middleware должен вызывать clearConstructor при fulfilled-действии createNewOrder', () => {
    const fulfilledAction = {
      type: createNewOrder.fulfilled.type,
      payload: {},
      meta: {},
    };

    store.dispatch(fulfilledAction);

    expect(clearConstructor).toHaveBeenCalled();
  });
});