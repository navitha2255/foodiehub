import api from './client';
import type { Order } from '../types';

export const getMyOrders = async (): Promise<Order[]> => {
  const { data } = await api.get('/orders/my-orders');
  return data.data;
};

export const cancelOrder = async (id: number): Promise<Order> => {
  const { data } = await api.patch(`/orders/${id}/cancel`);
  return data.data;
};
export interface CreateOrderPayload {
  addressId: number;
  items: { foodId: number; quantity: number }[];
}

export const createOrder = async (payload: CreateOrderPayload): Promise<Order> => {
  const { data } = await api.post('/orders', payload);
  return data.data;
};