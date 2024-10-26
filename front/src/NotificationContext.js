import React, { createContext, useState, useContext } from 'react';

const NotificationContext = createContext();

// Context Provider
export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  return (
    <NotificationContext.Provider value={{ unreadCount, setUnreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook for accessing the context
export const useNotification = () => {
  return useContext(NotificationContext);
};
