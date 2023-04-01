import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from '../feateres/useSlice';
import classReducer from '../feateres/classSlice';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootPersistConfig = {
	key: 'root',
	storage,
	whiteList: ['user']
};

const rootReducer = combineReducers({
	classReducer,
	user: persistReducer(rootPersistConfig, userReducer)
});

export const store = configureStore({
	reducer: rootReducer,
	middleware: [thunk]
});

export const persistor = persistStore(store);
