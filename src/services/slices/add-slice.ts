import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';
import {
  createAsyncThunk,
  createSlice,
  SerializedError
} from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type OrderResponse = {
  order: TOrder;
  name: string;
};

type OrdersState = {
  loadingOrder: boolean;
  loadingOrders: boolean;
  creatingOrder: boolean;
  currentOrder: TOrder | null;
  error: SerializedError | null;
  ordersList: TOrder[];
};

const initialOrdersState: OrdersState = {
  loadingOrder: true,
  loadingOrders: true,
  creatingOrder: false,
  currentOrder: null,
  error: null,
  ordersList: []
};

export const loadAllOrders = createAsyncThunk(
  'orders/loadAll',
  async () => await getOrdersApi()
);

export const createNewOrder = createAsyncThunk<OrderResponse, string[]>(
  'orders/create',
  async (ingredients, { rejectWithValue }) => {
    const response = await orderBurgerApi(ingredients);
    if (!response?.success) {
      return rejectWithValue(response);
    }
    return {
      order: response.order,
      name: response.name
    };
  }
);

export const fetchOrderDetails = createAsyncThunk<TOrder, number>(
  'orders/fetchDetails',
  async (orderNumber, { rejectWithValue }) => {
    const response = await getOrderByNumberApi(orderNumber);
    if (!response?.success) {
      return rejectWithValue(response);
    }
    return response.orders[0];
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState: initialOrdersState,
  reducers: {
    clearCurrentOrder(state) {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loadingOrder = true;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loadingOrder = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state) => {
        state.loadingOrder = false;
      })
      .addCase(loadAllOrders.pending, (state) => {
        state.loadingOrders = true;
        state.error = null;
      })
      .addCase(loadAllOrders.fulfilled, (state, action) => {
        state.loadingOrders = false;
        state.ordersList = action.payload;
      })
      .addCase(loadAllOrders.rejected, (state, action) => {
        state.loadingOrders = false;
        state.error = action.error;
      })
      .addCase(createNewOrder.pending, (state) => {
        state.creatingOrder = true;
      })

      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.creatingOrder = false;
        state.currentOrder = action.payload.order;
      })
      .addCase(createNewOrder.rejected, (state) => {
        state.creatingOrder = false;
      });
  }
});

export const { clearCurrentOrder } = ordersSlice.actions;
export const ordersReducer = ordersSlice.reducer;
