'use client';

import { useState, useCallback } from 'react';
import { CartItem } from '@/types';

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = useCallback((product: any) => {
    console.log('✅ [useCart] Adding to cart:', product.id);
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => String(item.id) === String(product.id));
      
      if (existingItem) {
        console.log('✅ [useCart] Item exists, updating quantity from', existingItem.quantity, 'to', existingItem.quantity + 1);
        const newCart = prevCart.map(item =>
          String(item.id) === String(product.id)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        console.log('✅ [useCart] New cart after add:', newCart);
        return newCart;
      }
      
      console.log('✅ [useCart] Adding new item to cart');
      return [...prevCart, { ...product, quantity: 1 }];
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    console.log('✅ [useCart] updateQuantity called:', productId, 'qty:', quantity);
    setCart((prevCart) => {
      const newCart = prevCart.map(item =>
        String(item.id) === String(productId) 
          ? { ...item, quantity } 
          : item
      );
      console.log('✅ [useCart] Updated cart:', newCart);
      return newCart;
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    console.log('✅ [useCart] removeFromCart called:', productId);
    setCart((prevCart) => {
      const newCart = prevCart.filter(item => String(item.id) !== String(productId));
      console.log('✅ [useCart] Removed item, new cart:', newCart);
      return newCart;
    });
  }, []);

  const clearCart = useCallback(() => {
    console.log('✅ [useCart] clearCart called');
    setCart([]);
  }, []);

  console.log('🛒 [useCart] Current cart state:', cart);

  return {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };
}