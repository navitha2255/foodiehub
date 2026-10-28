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
export type Role = 'customer' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  user: User;
  token: string;
}
export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface Address {
  id: number;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface OrderItem {
  id: number;
  quantity: number;
  price: number | string;
  food?: { id: number; name: string; imageUrl: string | null };
}

export interface Order {
  id: number;
  totalAmount: number | string;
  status: OrderStatus;
  createdAt: string;
  items: OrderItem[];
  address?: Address;
}
export interface CartItem {
  id: number;
  foodId: number;
  quantity: number;
  food: {
    id: number;
    name: string;
    price: number;
    imageUrl: string | null;
    isAvailable: boolean;
  };
}

export interface Cart {
  id: number;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
}