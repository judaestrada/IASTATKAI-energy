import React, { createContext, useContext, useState, ReactNode } from 'react';

export type CartItem = {
  id: string;
  name: string;
  category: string;
  type: 'product' | 'service';
  price: number;
  quantity: number;
  image: string;
};

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'helios-01',
      name: 'Helios Pro Panel',
      category: 'Solar Panel',
      type: 'product',
      price: 450,
      quantity: 12,
      image: 'https://picsum.photos/seed/solar/100/100'
    },
    {
      id: 'inv-v2',
      name: 'Smart Inverter V2',
      category: 'Inverter',
      type: 'product',
      price: 1200,
      quantity: 1,
      image: 'https://picsum.photos/seed/inverter/100/100'
    },
    {
      id: 'inst-01',
      name: 'Premium Installation Service',
      category: 'Installation',
      type: 'service',
      price: 1500,
      quantity: 1,
      image: 'https://picsum.photos/seed/installation/100/100'
    }
  ]);

  const addToCart = (newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const quantityToAdd = newItem.quantity || 1;
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === newItem.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      }
      return [...prevItems, { ...newItem, quantity: quantityToAdd }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeItem, clearCart }}>
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
