export interface Category {
  id: number;
  name: string;
  description: string | null;
}

export interface Food {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  rating: number;
  category: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}