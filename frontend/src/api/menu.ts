import type { Category, Food, Pagination } from '../types';
import api from './client';

interface ApiFood {
  id: number;
  name: string;
  description: string | null;
  price: number | string;
  imageUrl: string | null;
  rating: number | string;
  category?: { id: number; name: string };
}

const toFood = (f: ApiFood): Food => ({
  id: f.id,
  name: f.name,
  description: f.description ?? '',
  price: Number(f.price),
  imageUrl: f.imageUrl ?? '',
  rating: Number(f.rating),
  category: f.category?.name ?? '',
});

export interface FoodQuery {
  search?: string;
  category?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await api.get('/categories');
  return data.data;
};

export const getFoods = async (
  params: FoodQuery = {},
): Promise<{ foods: Food[]; pagination: Pagination }> => {
  const { data } = await api.get('/foods', { params: { ...params, available: true } });
  return { foods: data.data.map(toFood), pagination: data.pagination };
};