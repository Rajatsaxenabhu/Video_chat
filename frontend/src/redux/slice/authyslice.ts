import { combineReducers } from 'redux';
import authReducer from './authslice';

const rootReducer = combineReducers({
  auth: authReducer, // Ensures 'auth' is part of the state
});

export default rootReducer;