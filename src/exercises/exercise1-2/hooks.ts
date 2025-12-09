/**
 * Custom hooks cho Redux
 * 
 * Tại sao cần hooks riêng?
 * - useSelector và useDispatch từ react-redux cần được "typed"
 * - Tạo hooks typed sẵn để dùng trong toàn app
 */

import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Typed dispatch hook
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

// Typed selector hook
export const useAppSelector = useSelector.withTypes<RootState>();
