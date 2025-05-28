import { getIngredientsApi } from '../../../src/utils/burger-api';
import {
  createAsyncThunk,
  createSlice,
  SerializedError
} from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

type IngredientsState = {
  loading: boolean;
  error: SerializedError | null;
  ingredients: TIngredient[];
};

const initialIngredientsState: IngredientsState = {
  loading: true,
  error: null,
  ingredients: []
};

export const loadIngredients = createAsyncThunk(
  'ingredients/load',
  async () => {
    const response = await getIngredientsApi();
    return response;
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: initialIngredientsState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      })
      .addCase(loadIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  }
});

export const ingredientsReducer = ingredientsSlice.reducer;
