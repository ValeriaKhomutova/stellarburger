import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { v4 as generateId } from 'uuid';

interface BurgerConstructorState {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
}

const initialConstructorState: BurgerConstructorState = {
  bun: null,
  ingredients: []
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState: initialConstructorState,
  reducers: {
    updateBun: (state, action: PayloadAction<TIngredient | null>) => {
      state.bun = action.payload;
    },
    addConstructorItem: {
      prepare: (itemData: TIngredient) => ({
        payload: { ...itemData, id: generateId() }
      }),
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      }
    },
    deleteConstructorItem: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    reorderConstructorItem: (
      state,
      action: PayloadAction<{ index: number; moveUp: boolean }>
    ) => {
      const { index, moveUp } = action.payload;
      const items = [...state.ingredients];
      const targetIndex = moveUp ? index - 1 : index + 1;

      [items[index], items[targetIndex]] = [items[targetIndex], items[index]];

      state.ingredients = items;
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  updateBun,
  addConstructorItem,
  deleteConstructorItem,
  reorderConstructorItem,
  clearConstructor
} = burgerConstructorSlice.actions;

export const burgerReducer = burgerConstructorSlice.reducer;
