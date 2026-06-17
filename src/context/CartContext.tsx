'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image_url?: string;
  format?: string; // e.g. "250g", "500g", "1kg"
  unit: string; // e.g. "kg", "pièce", "pot", "format"
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (id: string, format?: string) => void;
  updateQuantity: (id: string, quantity: number, format?: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('warriors_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart from localStorage:', e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('warriors_cart', JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (i) => i.id === item.id && i.format === item.format
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      }

      return [...prevCart, { ...item, quantity }];
    });
  };

  const removeFromCart = (id: string, format?: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.id === id && item.format === format))
    );
  };

  const updateQuantity = (id: string, quantity: number, format?: string) => {
    if (quantity <= 0) {
      removeFromCart(id, format);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id && item.format === format ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
