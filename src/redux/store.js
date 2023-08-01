import { configureStore } from '@reduxjs/toolkit';

import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];

const store = configureStore({
  reducer: rootReducer,
  middleware: middlewares,
});

sagaMiddleware.run(rootSaga);

export default store;
