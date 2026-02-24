/**
 * Typed Redux Hooks
 *
 * WHY CUSTOM HOOKS:
 * - useSelector and useDispatch don't know our state shape
 * - These hooks are pre-typed with RootState and AppDispatch
 * - No need to import types everywhere
 *
 * USAGE:
 * // Instead of:
 * import { useSelector, useDispatch } from 'react-redux';
 * import type { RootState, AppDispatch } from '@/core/store';
 * const dispatch = useDispatch<AppDispatch>();
 * const movies = useSelector((state: RootState) => state.movies);
 *
 * // Use:
 * import { useAppDispatch, useAppSelector } from '@/core/store';
 * const dispatch = useAppDispatch();
 * const movies = useAppSelector((state) => state.movies); // state is typed!
 */

import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Typed dispatch hook
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

// Typed selector hook
export const useAppSelector = useSelector.withTypes<RootState>();
