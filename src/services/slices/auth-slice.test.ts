import { expect, test, describe } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './auth-slice';
import {
  registerUser,
  loginUser,
  logoutUser,
  updateUserData,
  fetchUserData
} from './auth-slice';
import type {AuthState} from './auth-slice';
// Тип для состояния всего store
type RootState = {
  auth: AuthState;
};

const setupStore = (preloadedState?: Partial<RootState>) => 
  configureStore({
    reducer: {
      auth: authReducer
    },
    preloadedState: preloadedState as RootState
  });

describe('Тесты экшенов аутентификации', () => {
  describe('Тесты экшена регистрации', () => {
    test('pending: должен очистить ошибку регистрации', () => {
      const store = setupStore({
        auth: {
          ...initialAuthState,
          registrationError: { message: 'Previous error' }
        }
      });
      
      store.dispatch({ type: registerUser.pending.type });
      const state = store.getState().auth;
      expect(state.registrationError).toBeNull();
    });

    test('rejected: должен установить ошибку регистрации', () => {
      const store = setupStore();
      const error = { message: 'Registration failed' };
      
      store.dispatch({
        type: registerUser.rejected.type,
        error
      });
      
      const state = store.getState().auth;
      expect(state.registrationError).toEqual(error);
    });

    test('fulfilled: должен установить данные пользователя и флаг аутентификации', () => {
      const store = setupStore();
      const mockUser = { email: 'test@test.com', name: 'Test User' };
      
      store.dispatch({
        type: registerUser.fulfilled.type,
        payload: mockUser
      });
      
      const state = store.getState().auth;
      expect(state.userData).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.registrationError).toBeNull();
    });
  });

  describe('Тесты экшена входа', () => {
    test('pending: должен очистить ошибку входа', () => {
      const store = setupStore({
        auth: {
          ...initialAuthState,
          loginError: { message: 'Previous error' }
        }
      });
      
      store.dispatch({ type: loginUser.pending.type });
      const state = store.getState().auth;
      expect(state.loginError).toBeNull();
    });

    test('rejected: должен установить ошибку входа', () => {
      const store = setupStore();
      const error = { message: 'Login failed' };
      
      store.dispatch({
        type: loginUser.rejected.type,
        error
      });
      
      const state = store.getState().auth;
      expect(state.loginError).toEqual(error);
    });

    test('fulfilled: должен установить данные пользователя и флаг аутентификации', () => {
      const store = setupStore();
      const mockUser = { email: 'test@test.com', name: 'Test User' };
      
      store.dispatch({
        type: loginUser.fulfilled.type,
        payload: mockUser
      });
      
      const state = store.getState().auth;
      expect(state.userData).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.loginError).toBeNull();
    });
  });

  describe('Тесты экшена выхода', () => {
    test('fulfilled: должен сбросить данные пользователя и флаг аутентификации', () => {
      const initialState = {
        auth: {
          ...initialAuthState,
          isAuthenticated: true,
          userData: { email: 'test@test.com', name: 'Test User' }
        }
      };
      
      const store = setupStore(initialState);
      store.dispatch({ type: logoutUser.fulfilled.type });
      
      const state = store.getState().auth;
      expect(state.userData).toEqual({ email: '', name: '' });
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('Тесты экшена получения данных пользователя', () => {
    test('fulfilled: должен установить данные пользователя и флаги', () => {
      const store = setupStore();
      const mockUser = { email: 'test@test.com', name: 'Test User' };
      
      store.dispatch({
        type: fetchUserData.fulfilled.type,
        payload: mockUser
      });
      
      const state = store.getState().auth;
      expect(state.userData).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.authChecked).toBe(true);
    });

    test('rejected: должен установить флаг authChecked', () => {
      const store = setupStore();
      
      store.dispatch({ type: fetchUserData.rejected.type });
      
      const state = store.getState().auth;
      expect(state.authChecked).toBe(true);
    });
  });

  describe('Тесты экшена обновления данных пользователя', () => {
    test('fulfilled: должен обновить данные пользователя', () => {
      const initialState = {
        auth: {
          ...initialAuthState,
          isAuthenticated: true,
          userData: { email: 'old@test.com', name: 'Old User' }
        }
      };
      
      const store = setupStore(initialState);
      const updatedUser = { email: 'new@test.com', name: 'New User' };
      
      store.dispatch({
        type: updateUserData.fulfilled.type,
        payload: updatedUser
      });
      
      const state = store.getState().auth;
      expect(state.userData).toEqual(updatedUser);
    });
  });
});