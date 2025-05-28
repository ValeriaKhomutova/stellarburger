import { describe, it, expect } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import {
  authReducer,
  initialAuthState,
  fetchUserData,
  loginUser,
  registerUser,
  logoutUser,
  updateUserData
} from './auth-slice';

const setupStore = () =>
  configureStore({
    reducer: {
      auth: authReducer
    }
  });

describe('Тесты authSlice', () => {
  describe('Экшен fetchUserData (получение данных пользователя)', () => {
    it('Должен корректно обрабатывать pending', () => {
      const store = setupStore();
      store.dispatch({ type: fetchUserData.pending.type });
      const state = store.getState().auth;

      expect(state.authChecked).toBe(false);
      expect(state.loginError).toBeNull();
    });

    it('Должен корректно обрабатывать fulfilled', () => {
      const mockUser = { name: 'Иван', email: 'ivan@example.com' };
      const store = setupStore();
      store.dispatch({
        type: fetchUserData.fulfilled.type,
        payload: mockUser
      });
      const state = store.getState().auth;

      expect(state.userData).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.authChecked).toBe(true);
    });

    it('Должен корректно обрабатывать rejected', () => {
      const store = setupStore();
      store.dispatch({ type: fetchUserData.rejected.type });
      const state = store.getState().auth;

      expect(state.authChecked).toBe(true);
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('Экшен loginUser (авторизация)', () => {
    it('Должен очищать ошибку при pending', () => {
      const store = setupStore();
      store.dispatch({ type: loginUser.pending.type });
      const state = store.getState().auth;

      expect(state.loginError).toBeNull();
    });

    it('Должен устанавливать пользователя при fulfilled', () => {
      const mockUser = { name: 'Петр', email: 'peter@example.com' };
      const store = setupStore();
      store.dispatch({
        type: loginUser.fulfilled.type,
        payload: mockUser
      });
      const state = store.getState().auth;

      expect(state.userData).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.loginError).toBeNull();
    });

    it('Должен сохранять ошибку при rejected', () => {
      const mockError = { message: 'Ошибка авторизации' };
      const store = setupStore();
      store.dispatch({
        type: loginUser.rejected.type,
        payload: mockError, // Используем payload вместо error
        meta: { rejectedWithValue: true } // Добавляем мета-данные
      });
      const state = store.getState().auth;

      expect(state.loginError).toEqual(mockError);
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('Экшен registerUser (регистрация)', () => {
    it('Должен очищать ошибку при pending', () => {
      const store = setupStore();
      store.dispatch({ type: registerUser.pending.type });
      const state = store.getState().auth;

      expect(state.registrationError).toBeNull();
    });

    it('Должен устанавливать пользователя при fulfilled', () => {
      const mockUser = { name: 'Сергей', email: 'sergey@example.com' };
      const store = setupStore();
      store.dispatch({
        type: registerUser.fulfilled.type,
        payload: mockUser
      });
      const state = store.getState().auth;

      expect(state.userData).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.registrationError).toBeNull();
    });

    it('Должен сохранять ошибку при rejected', () => {
      const mockError = { message: 'Ошибка регистрации' };
      const store = setupStore();
      store.dispatch({
        type: registerUser.rejected.type,
        payload: mockError, // Используем payload вместо error
        meta: { rejectedWithValue: true } // Добавляем мета-данные
      });
      const state = store.getState().auth;

      expect(state.registrationError).toEqual(mockError);
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('Экшен logoutUser (выход)', () => {
    it('Должен сбрасывать состояние при fulfilled', () => {
      const store = setupStore();
      // Сначала авторизуем пользователя
      store.dispatch({
        type: loginUser.fulfilled.type,
        payload: { name: 'Иван', email: 'ivan@example.com' }
      });
      // Затем выходим
      store.dispatch({ type: logoutUser.fulfilled.type });
      const state = store.getState().auth;

      expect(state.userData).toEqual(initialAuthState.userData);
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('Экшен updateUserData (обновление данных)', () => {
    it('Должен обновлять данные пользователя при fulfilled', () => {
      const mockUser = { name: 'Новое имя', email: 'new@example.com' };
      const store = setupStore();
      store.dispatch({
        type: updateUserData.fulfilled.type,
        payload: mockUser
      });
      const state = store.getState().auth;

      expect(state.userData).toEqual(mockUser);
    });
  });
});
