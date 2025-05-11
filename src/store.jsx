// src/store.js
import { createStore, combineReducers } from 'redux';
import authReducer from './actions/authReducer';

// Combine reducers if you have more in the future
const rootReducer = combineReducers({
  auth: authReducer,
});

const store = createStore(rootReducer);

export default store;
