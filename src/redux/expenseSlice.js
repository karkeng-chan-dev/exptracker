import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  expenses: [],
  upsertSuccess: null,
  upsertError: null,
};

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    setExpenses: (state, action) => {
      state.expenses = action.payload;
    },
    addExpenseSuccess: (state, action) => {
      __DEV__ && console.log('action', action);
      state.expenses.push(action.payload);
      state.upsertSuccess = true;
    },
    removeExpense: (state, action) => {
      state.expenses = state.expenses.filter((expense) => expense.id !== action.payload);
    },
    updateExpenseSuccess: (state, action) => {
      const index = state.expenses.findIndex((expense) => expense.id === action.payload.id);
      if (index !== -1) {
        state.expenses[index] = action.payload;
      }
      state.upsertSuccess = true;
    },
    resetUpsertSuccess: (state) => {
      state.upsertSuccess = null;
    },
    setUpsertError: (state, action) => {
      state.upsertError = action.payload;
    },
    resetUpsertError: (state) => {
      state.upsertError = null;
    }
  },
});

export const { 
  addExpenseSuccess, 
  removeExpense, 
  updateExpenseSuccess, 
  setExpenses ,
  resetUpsertSuccess,
  setUpsertError,
  resetUpsertError,
} = expenseSlice.actions;
export default expenseSlice.reducer;
