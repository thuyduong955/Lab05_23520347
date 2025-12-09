/**
 * Exercise 1.2: The Global Store (Redux Toolkit)
 * 
 * File này định nghĩa "slice" cho Shopping Cart
 * 
 * Slice = Một "lát cắt" của Redux store, bao gồm:
 * - State ban đầu
 * - Các reducer (hàm xử lý action)
 * - Tự động tạo action creators
 */

import { createSlice, createSelector } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// ============ BƯỚC 1: Định nghĩa kiểu dữ liệu ============

// Sản phẩm trong giỏ hàng
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

// State của giỏ hàng
export interface CartState {
  items: CartItem[];
  totalAmount: number;
}

// State ban đầu - giỏ hàng rỗng
const initialState: CartState = {
  items: [],
  totalAmount: 0,
};

// ============ BƯỚC 2: Tạo Slice với createSlice ============

/**
 * createSlice là "magic" của Redux Toolkit!
 * - Tự động tạo action types (ví dụ: 'cart/addItem')
 * - Tự động tạo action creators (ví dụ: addItem())
 * - Cho phép viết code "mutation" nhưng Immer sẽ giữ immutability
 */
const cartSlice = createSlice({
  name: 'cart', // Prefix cho action types

  initialState,

  reducers: {
    /**
     * Thêm sản phẩm vào giỏ
     * - Nếu đã có: tăng quantity
     * - Nếu chưa có: thêm mới
     */
    addItem: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      const newItem = action.payload;
      
      // Tìm xem item đã có trong giỏ chưa
      const existingItem = state.items.find(item => item.id === newItem.id);

      if (existingItem) {
        // Đã có -> tăng quantity
        // ⚠️ Đây TRÔNG như mutation, nhưng Immer xử lý bên dưới!
        existingItem.quantity += 1;
      } else {
        // Chưa có -> thêm mới với quantity = 1
        state.items.push({
          ...newItem,
          quantity: 1,
        });
      }

      // Cập nhật tổng tiền
      state.totalAmount += newItem.price;
    },

    /**
     * Xóa/Giảm sản phẩm
     * - Nếu quantity > 1: giảm đi 1
     * - Nếu quantity = 1: xóa khỏi giỏ
     */
    removeItem: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      const existingItem = state.items.find(item => item.id === itemId);

      if (!existingItem) {
        console.warn('⚠️ Item không tồn tại trong giỏ hàng!');
        return;
      }

      if (existingItem.quantity === 1) {
        // Xóa khỏi giỏ
        state.items = state.items.filter(item => item.id !== itemId);
      } else {
        // Giảm quantity
        existingItem.quantity -= 1;
      }

      // Cập nhật tổng tiền
      state.totalAmount -= existingItem.price;
    },

    /**
     * Xóa toàn bộ giỏ hàng
     */
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
    },

    /**
     * Cập nhật quantity trực tiếp
     */
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(i => i.id === id);

      if (item && quantity > 0) {
        const diff = quantity - item.quantity;
        item.quantity = quantity;
        state.totalAmount += diff * item.price;
      }
    },
  },
});

// ============ BƯỚC 3: Export actions và reducer ============

// Action creators (tự động tạo bởi createSlice)
export const { addItem, removeItem, clearCart, updateQuantity } = cartSlice.actions;

// Reducer (dùng trong store)
export default cartSlice.reducer;

// ============ BƯỚC 4: Selectors ============

// Type helper cho RootState (sẽ định nghĩa đầy đủ ở store.ts)
interface RootState {
  cart: CartState;
}

// Selector cơ bản
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectTotalAmount = (state: RootState) => state.cart.totalAmount;
export const selectCartItemCount = (state: RootState) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

/**
 * CHALLENGE: Memoized Selector với createSelector
 * 
 * createSelector từ Reselect library:
 * - Cache kết quả tính toán
 * - Chỉ tính lại khi input thay đổi
 * - Tránh re-render không cần thiết!
 */
export const selectCartTax = createSelector(
  // Input selector - lấy totalAmount
  [selectTotalAmount],
  // Output selector - tính 10% tax
  (totalAmount) => {
    console.log('💰 Đang tính thuế...'); // Log để thấy khi nào hàm chạy
    return totalAmount * 0.1; // 10% tax
  }
);

// Selector tính tổng tiền bao gồm thuế
export const selectTotalWithTax = createSelector(
  [selectTotalAmount, selectCartTax],
  (total, tax) => {
    return total + tax;
  }
);

// Selector lấy item theo ID
export const selectItemById = (id: string) => 
  createSelector(
    [selectCartItems],
    (items) => items.find(item => item.id === id)
  );
