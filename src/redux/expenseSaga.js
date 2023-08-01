import { put, call, takeLatest } from 'redux-saga/effects';
import { removeExpense, setExpenses, addExpenseSuccess, updateExpenseSuccess, setUpsertError } from './expenseSlice';

const BASE_URL = '/api/expenses'; 

const fetchExpenses = async () => {
  const response = await fetch(BASE_URL);
  return await response.json();
};

const saveExpenseToServer = async (expense) => {
  const { id, ...data } = expense;
  if (id) {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  } else {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  }
};

const deleteExpenseFromServer = async (expenseId) => {
  await fetch(`${BASE_URL}/${expenseId}`, { method: 'DELETE' });
};

function* fetchExpensesSaga() {
  try {
    const result = yield call(fetchExpenses);
    yield put(setExpenses(result?.expenses?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) || []));
  } catch (error) {
    console.error('Error fetching expenses:', error);
  }
}

function* addExpenseSaga(action) {
  try {
    const { id, ...body } = action.payload || {};
    const savedExpense = yield call(saveExpenseToServer, body);
    yield put(addExpenseSuccess(savedExpense.expense));
  } catch (error) {
    yield put(setUpsertError(error.message));
    __DEV__ && console.error('Error saving expense to server:', error);
  }
}

function* updateExpenseSaga(action) {
  try {
    const body = action.payload || {};
    const savedExpense = yield call(saveExpenseToServer, body);
    yield put(updateExpenseSuccess(savedExpense.expense));
  } catch (error) {
    yield put(setUpsertError(error.message));
    __DEV__ && console.error('Error updating expense to server:', error);
  }
}

function* removeExpenseSaga(action) {
  try {
    yield call(deleteExpenseFromServer, action.payload);
    yield put(removeExpense(action.payload));
  } catch (error) {
    console.error('Error deleting expense from server:', error);
  }
}

export default function* expenseSaga() {
  yield takeLatest('expenses/fetchExpenses', fetchExpensesSaga);
  yield takeLatest('expenses/addExpense', addExpenseSaga);
  yield takeLatest('expenses/updateExpense', updateExpenseSaga);
  yield takeLatest('expenses/removeExpense', removeExpenseSaga);
}