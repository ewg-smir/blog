import { configureStore } from '@reduxjs/toolkit';
import { articlesApi } from './articlesApi';
import { authApi } from './authApi';
import { registerApi } from './registerApi';
import { editApi } from './editApi';
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    [articlesApi.reducerPath]: articlesApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [registerApi.reducerPath]: registerApi.reducer,
    [editApi.reducerPath]: editApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(
      articlesApi.middleware,
      authApi.middleware,
      registerApi.middleware,
      // eslint-disable-next-line comma-dangle
      editApi.middleware
    );
  },
});

export default store;
