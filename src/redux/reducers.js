
import { combineReducers } from '@reduxjs/toolkit';
import expenseReducer from './expenseSlice';
import userReducer from './userSlice';

const rootReducer = combineReducers({
  expenses: expenseReducer,
  user: userReducer,
});

export default rootReducer;
