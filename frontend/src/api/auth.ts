import type { AuthResponse, User } from '../types';
import api from './client';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const registerUser = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const { data } = await api.post('/auth/register', payload);
  return data.data;
};

export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await api.post('/auth/login', payload);
  return data.data;
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get('/auth/me');
  return data.data;
};