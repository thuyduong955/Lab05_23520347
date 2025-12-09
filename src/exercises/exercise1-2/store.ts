/**
 * Redux Store Configuration
 * 
 * configureStore từ Redux Toolkit:
 * - Tự động setup Redux DevTools
 * - Tự động thêm middleware (thunk, serializableCheck, etc.)
 * - Đơn giản hơn nhiều so với createStore truyền thống!
 */

import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

// ============ Tạo Store ============
export const store = configureStore({
  reducer: {
    // Mỗi key ở đây tương ứng với một "slice" trong state
    cart: cartReducer,
    // Có thể thêm nhiều slice khác:
    // user: userReducer,
    // products: productsReducer,
  },
  // middleware được tự động cấu hình!
  // Nếu muốn thêm custom middleware:
  // middleware: (getDefaultMiddleware) => 
  //   getDefaultMiddleware().concat(logger)
});

// ============ TypeScript Types ============

// RootState: Type của toàn bộ state trong store
export type RootState = ReturnType<typeof store.getState>;

// AppDispatch: Type của dispatch function
export type AppDispatch = typeof store.dispatch;
