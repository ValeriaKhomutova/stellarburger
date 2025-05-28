import {
  combineReducers,
  configureStore,
  Middleware,
  MiddlewareAPI
} from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import { burgerReducer, clearConstructor } from './slices/build-burger-slice';
import { feedReducer } from './slices/feed-slice';
import { ingredientsReducer } from './slices/ingregient-slice';
//import { middleware } from './middleware';
import { ordersReducer, createNewOrder } from './slices/add-slice';
import { authReducer } from './slices/auth-slice';

// Заменить на импорт настоящего редьюсера
const rootReducer = combineReducers({
  ordersReducer,
  authReducer,
  burgerReducer,

  feedReducer,
  ingredientsReducer
});

export const middleware: Middleware =
  (store: MiddlewareAPI<AppDispatch, RootState>) => (next) => (action) => {
    if (createNewOrder.fulfilled.match(action)) {
      store.dispatch(clearConstructor());
    }
    return next(action);
  };

const store = configureStore({
  reducer: rootReducer,
  middleware: (DefaultMiddleware) => DefaultMiddleware().concat(middleware),
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
