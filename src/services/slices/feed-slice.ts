import { getFeedsApi } from '../../../src/utils/burger-api'; 
import {
  createAsyncThunk,
  createSlice,
  SerializedError
} from '@reduxjs/toolkit';
import { TOrdersData } from '@utils-types';

type FeedState = {
  loading: boolean;
  error: SerializedError | null;
  feedData: TOrdersData;
};

const initialFeedState: FeedState = {
  loading: true,
  error: null,
  feedData: {
    orders: [],
    total: NaN,
    totalToday: NaN
  }
};

/*Redux Toolkit автоматически создаёт три действия на основе этого типа:

feed/fetch/pending — когда запрос начался.

feed/fetch/fulfilled — когда запрос успешен.

feed/fetch/rejected — когда запрос провален.*/

export const fetchFeedData = createAsyncThunk('feed/fetch', async () => {
  const response = await getFeedsApi();
  return response;
});

const feedSlice = createSlice({
  name: 'feed',
  initialState: initialFeedState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedData.fulfilled, (state, action) => {
        state.loading = false;
        state.feedData = action.payload;
      })
      .addCase(fetchFeedData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  }
});

export const feedReducer = feedSlice.reducer;
