import React, { createContext, useContext, useState } from 'react';

const OrderContext = createContext();

export const useOrder = () => {
  return useContext(OrderContext);
};

export const OrderProvider = ({ children }) => {
  const [order, setOrder] = useState(null);

  const setOrderDetails = (orderDetails) => {
    setOrder(orderDetails);
  };

  return (
    <OrderContext.Provider value={{ order, setOrderDetails }}>
      {children}
    </OrderContext.Provider>
  );
};
