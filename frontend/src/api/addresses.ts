import api from './client';
import type { Address } from '../types';

export type AddressPayload = Omit<Address, 'id'>;

export const getAddresses = async (): Promise<Address[]> => {
  const { data } = await api.get('/addresses');
  return data.data;
};

export const createAddress = async (payload: AddressPayload): Promise<Address> => {
  const { data } = await api.post('/addresses', payload);
  return data.data;
};