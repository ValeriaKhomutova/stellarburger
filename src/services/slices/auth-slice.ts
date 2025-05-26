import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import {
  createAsyncThunk,
  createSlice,
  SerializedError
} from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
//import { clearTokens, storeTokens } from "../../utils/cookie";
import { authTokenManager } from '../../utils/cookie';
/* // Вместо storeTokens(refreshToken, accessToken)
authTokenManager.persistAuthCredential(refreshToken, accessToken);

// Вместо clearTokens()
authTokenManager.clearAuthCredentials();*/

type AuthState = {
  authChecked: boolean;
  isAuthenticated: boolean;
  loginError: SerializedError | null;
  registrationError: SerializedError | null;
  userData: TUser;
};

const initialAuthState: AuthState = {
  authChecked: false,
  isAuthenticated: false,
  loginError: null,
  registrationError: null,
  userData: {
    name: '',
    email: ''
  }
};

export const registerUser = createAsyncThunk<TUser, TRegisterData>(
  'auth/register',
  async (registrationData, { rejectWithValue }) => {
    const response = await registerUserApi(registrationData);

    if (!response.success) {
      return rejectWithValue(response);
    }

    const { user, refreshToken, accessToken } = response;
    authTokenManager.persistAuthCredential(refreshToken, accessToken);

    return user;
  }
);

export const loginUser = createAsyncThunk<TUser, TLoginData>(
  'auth/login',
  async (loginData, { rejectWithValue }) => {
    const response = await loginUserApi(loginData);

    if (!response.success) {
      return rejectWithValue(response);
    }

    const { user, refreshToken, accessToken } = response;
    authTokenManager.persistAuthCredential(refreshToken, accessToken);

    return user;
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    const response = await logoutApi();

    if (!response.success) {
      return rejectWithValue(response);
    }

    authTokenManager.clearAuthCredentials();
  }
);

export const fetchUserData = createAsyncThunk(
  'auth/fetchUser',
  async (_, { rejectWithValue }) => {
    const response = await getUserApi();

    if (!response?.success) {
      return rejectWithValue(response);
    }

    return response.user;
  }
);

export const updateUserData = createAsyncThunk<TUser, Partial<TRegisterData>>(
  'auth/updateUser',
  async (userData, { rejectWithValue }) => {
    const response = await updateUserApi(userData);

    if (!response?.success) {
      return rejectWithValue(response);
    }

    return response.user;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.registrationError = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.registrationError = null;
        state.isAuthenticated = true;
        state.userData = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registrationError = action.meta.rejectedWithValue
          ? (action.payload as SerializedError)
          : action.error;
      })
      .addCase(loginUser.pending, (state) => {
        state.loginError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginError = null;
        state.isAuthenticated = true;
        state.userData = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginError = action.meta.rejectedWithValue
          ? (action.payload as SerializedError)
          : action.error;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.userData = {
          email: '',
          name: ''
        };
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.authChecked = true;
        state.userData = action.payload;
      })
      .addCase(fetchUserData.rejected, (state) => {
        state.authChecked = true;
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.userData = action.payload;
      });
  }
});

export const authReducer = authSlice.reducer;
