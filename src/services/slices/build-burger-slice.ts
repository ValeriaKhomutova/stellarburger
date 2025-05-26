import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { v4 as generateId } from 'uuid';

interface BurgerConstructorState {
  selectedBun: TIngredient | null;
  fillingIngredients: TConstructorIngredient[];
}

const initialConstructorState: BurgerConstructorState = {
  selectedBun: null,
  fillingIngredients: []
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState: initialConstructorState,
  reducers: {
    updateBun: (state, action: PayloadAction<TIngredient | null>) => {
      state.selectedBun = action.payload;
    },
    addConstructorItem: {
      prepare: (itemData: TIngredient) => ({
        payload: { ...itemData, id: generateId() }
      }),
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.selectedBun = action.payload;
        } else {
          state.fillingIngredients.push(action.payload);
        }
      }
    },
    deleteConstructorItem: (state, action: PayloadAction<string>) => {
      state.fillingIngredients = state.fillingIngredients.filter(
        (item) => item.id !== action.payload
      );
    },
    reorderConstructorItem: (
      state,
      action: PayloadAction<{ itemIndex: number; moveUp: boolean }>
    ) => {
      const { itemIndex, moveUp } = action.payload;
      const items = [...state.fillingIngredients];
      const targetIndex = moveUp ? itemIndex - 1 : itemIndex + 1;

      [items[itemIndex], items[targetIndex]] = [
        items[targetIndex],
        items[itemIndex]
      ];

      state.fillingIngredients = items;
    },
    clearConstructor: (state) => {
      state.selectedBun = null;
      state.fillingIngredients = [];
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
