import React, { useEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './src/redux/reducers';
import AppNavigator from './src/navigation/AppNavigator';
import { makeServer } from './src/mirage-server';
import rootSaga from './src/redux/sagas';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

window.server?.shutdown?.();
window.server = makeServer();

const App = () => {
  return (
    <StoreProvider store={store}>
      <PaperProvider>
        <AppNavigator />
      </PaperProvider>
    </StoreProvider>
  );
};

export default App;
