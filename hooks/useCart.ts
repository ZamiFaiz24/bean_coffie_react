import { useState, useCallback } from 'react';
import { CartItem, Product } from '@/types';

interface UseCartReturn {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string | number) => void; // ← ubah jadi string | number
  updateQuantity: (productId: string | number, quantity: number) => void; // ← ubah jadi string | number
  clearCart: () => void;
  getTotal: () => number;
  getSubtotal: () => number;
  getTax: () => number;
  cartCount: number;
}

export const useCart = (): UseCartReturn => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = useCallback((product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product_id === product.id);

      if (existingItem) {
        return prevCart.map((item) =>
          item.product_id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: (item.quantity + 1) * item.price,
              }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: Date.now(),
          product_id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          subtotal: product.price,
          image: product.image,
        };
        return [...prevCart, newItem];
      }
    });

    console.log('✅ [Cart] Product added:', product.name);
  }, []);

  const removeFromCart = useCallback((productId: string | number) => {
    setCart((prevCart) => {
      const item = prevCart.find((item) => item.product_id === String(productId));
      console.log('🗑️ [Cart] Product removed:', item?.name);
      return prevCart.filter((item) => item.product_id !== String(productId));
    });
  }, []);

  const updateQuantity = useCallback((productId: string | number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product_id === String(productId)
          ? {
              ...item,
              quantity,
              subtotal: quantity * item.price,
            }
          : item
      )
    );

    console.log('✏️ [Cart] Quantity updated for product:', productId, 'qty:', quantity);
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
    console.log('🧹 [Cart] Cart cleared');
  }, []);

  const getSubtotal = useCallback(() => {
    return cart.reduce((total, item) => total + item.subtotal, 0);
  }, [cart]);

  const getTax = useCallback(() => {
    return getSubtotal() * 0.1;
  }, [getSubtotal]);

  const getTotal = useCallback(() => {
    return getSubtotal() + getTax();
  }, [getSubtotal, getTax]);

  const cartCount = cart.length;

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    getSubtotal,
    getTax,
    cartCount,
  };
};