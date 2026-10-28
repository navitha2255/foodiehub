import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { CartContext, emptyCart } from './cartContext';
import * as cartApi from '../api/cart';
import { useAuth } from '../hooks/useAuth';
import type { Cart } from '../types';

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart>(emptyCart);

  const refreshCart = useCallback(async () => {
    setCart(await cartApi.getCart());
  }, []);

  // Load the cart when a user logs in, empty it when they log out
  useEffect(() => {
    if (!user) {
      setCart(emptyCart);
      return;
    }
    cartApi
      .getCart()
      .then(setCart)
      .catch(() => {});
  }, [user]);

  const addItem = async (foodId: number, quantity = 1) => {
    setCart(await cartApi.addToCart(foodId, quantity));
  };

  const updateItem = async (itemId: number, quantity: number) => {
    setCart(await cartApi.updateCartItem(itemId, quantity));
  };

  const removeItem = async (itemId: number) => {
    setCart(await cartApi.removeCartItem(itemId));
  };

  const clearCart = async () => {
    setCart(await cartApi.clearCart());
  };

  return (
    <CartContext.Provider
      value={{ cart, addItem, updateItem, removeItem, clearCart, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  );
}