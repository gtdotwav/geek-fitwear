'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Product } from '@/data/products';

export interface CartItem {
  product: Product;
  size: string;
  variant?: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, size: string, variant?: string) => void;
  removeItem: (productId: string, size: string, variant?: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number, variant?: string) => void;
  openCart: () => void;
  closeCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((product: Product, size: string, variant?: string) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.size === size && i.variant === variant);
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id && i.size === size && i.variant === variant
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, size, variant, quantity: 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((productId: string, size: string, variant?: string) => {
    setItems(prev => prev.filter(i => !(i.product.id === productId && i.size === size && i.variant === variant)));
  }, []);

  const updateQuantity = useCallback((productId: string, size: string, quantity: number, variant?: string) => {
    if (quantity <= 0) {
      removeItem(productId, size, variant);
      return;
    }
    setItems(prev =>
      prev.map(i =>
        i.product.id === productId && i.size === size && i.variant === variant ? { ...i, quantity } : i
      )
    );
  }, [removeItem]);

  const total = items.reduce((sum, i) => sum + i.product.pixPrice * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, isOpen, addItem, removeItem, updateQuantity,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      total, itemCount,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
