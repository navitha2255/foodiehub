import api from './client';
import type { Cart } from '../types';

export const getCart = async (): Promise<Cart> => {
  const { data } = await api.get('/cart');
  return data.data;
};

export const addToCart = async (foodId: number, quantity = 1): Promise<Cart> => {
  const { data } = await api.post('/cart/items', { foodId, quantity });
  return data.data;
};

export const updateCartItem = async (itemId: number, quantity: number): Promise<Cart> => {
  const { data } = await api.patch(`/cart/items/${itemId}`, { quantity });
  return data.data;
};

export const removeCartItem = async (itemId: number): Promise<Cart> => {
  const { data } = await api.delete(`/cart/items/${itemId}`);
  return data.data;
};

export const clearCart = async (): Promise<Cart> => {
  const { data } = await api.delete('/cart');
  return data.data;
};