import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [requirements, setRequirements] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [platters, setPlatters] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);

  const addPlatterToCart = (item) => {
    setPlatters(prev => {
      const exists = prev.find(p => p.id === item.id);
      if (exists) return prev.map(p => p.id === item.id ? item : p);
      return [...prev, item];
    });
  };

  const removePlatterFromCart = (id) => {
    setPlatters(prev => prev.filter(p => p.id !== id));
  };

  const placeOrder = () => {
    const order = {
      platters,
      requirements,
      orderId: `FF${Date.now().toString().slice(-6)}`,
      placedAt: new Date(),
      status: 0,
    };
    setActiveOrder(order);
    setPlatters([]);
    return order;
  };

  const clearCart = () => {
    setPlatters([]);
    setRequirements(null);
    setSelectedService(null);
  };

  const totalAmount = platters.reduce((sum, item) => {
    const base = item.platter.pricePerPerson * item.guestCount;
    const serviceCharge = item.deliveryDetails?.charge || 0;
    return sum + base + serviceCharge;
  }, 0);

  return (
    <CartContext.Provider value={{
      requirements, selectedService, platters, activeOrder, totalAmount,
      setRequirements, setSelectedService,
      addPlatterToCart, removePlatterFromCart, placeOrder, clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
