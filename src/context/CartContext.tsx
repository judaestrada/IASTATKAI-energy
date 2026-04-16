import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

export type CartItem = {
  id: string;
  name: string;
  category: string;
  type: 'product' | 'service';
  price: number;
  quantity: number;
  image: string;
};

export type OrderStatus = 'pending_payment' | 'processing' | 'shipped' | 'delivered' | 'failed';

export type Order = {
  trackingId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  date: string;
  paymentMethod: string;
};

interface CartContextType {
  cartItems: CartItem[];
  orders: Order[];
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  placeOrder: (order: Order) => void;
  updateOrderStatus: (trackingId: string, status: OrderStatus) => void;
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

  const [orders, setOrders] = useState<Order[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setOrders([]);
      return;
    }

    const q = query(collection(db, 'orders'), where('userId', '==', currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedOrders = snapshot.docs.map(doc => {
        const data = doc.data();
        let itemsField = [];
        try {
          itemsField = JSON.parse(data.items);
        } catch(e) {}
        
        return {
          trackingId: data.trackingId,
          userId: data.userId,
          items: itemsField,
          total: data.total,
          status: data.status,
          paymentMethod: data.paymentMethod,
          date: data.date,
          docId: doc.id
        } as Order & { docId: string };
      });
      
      // Sort newest first
      fetchedOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setOrders(fetchedOrders);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const placeOrder = async (order: Order) => {
    if (currentUser) {
      const orderToSave = {
        trackingId: order.trackingId,
        userId: currentUser.uid,
        items: JSON.stringify(order.items), // Array of objects not well supported in simplified security rules unless stringified
        total: order.total,
        status: order.status,
        paymentMethod: order.paymentMethod,
        date: order.date
      };
      
      try {
        await addDoc(collection(db, 'orders'), orderToSave);
      } catch (error) {
        console.error("Error saving order:", error);
      }
    } else {
      setOrders(prev => [order, ...prev]);
    }
  };

  const updateOrderStatus = (trackingId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.trackingId === trackingId ? { ...o, status } : o));
  };

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
    <CartContext.Provider value={{ cartItems, orders, addToCart, updateQuantity, removeItem, clearCart, placeOrder, updateOrderStatus }}>
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
