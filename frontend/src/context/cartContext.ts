import { createContext } from 'react';
import type { Cart } from '../types';

export const emptyCart: Cart = { id: 0, items: [], totalItems: 0, subtotal: 0 };

export interface CartContextType {
  cart: Cart;
  addItem: (foodId: number, quantity?: number) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextType | null>(null);