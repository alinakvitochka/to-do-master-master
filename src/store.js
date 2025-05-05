import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './reducers/taskReducer';
import userReducer from './reducers/userReducer';
import authReducer from './reducers/authReducer';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    tasks: taskReducer,
    users: userReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export default store;