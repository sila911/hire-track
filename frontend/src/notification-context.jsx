import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Toast from './components/Toast';

const NotificationContext = createContext(null);

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addNotification = useCallback(({ type = 'info', title, description }) => {
    const id = Date.now() + Math.random();
    setNotifications((prev) => [...prev, { id, type, title, description }]);

    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  }, [removeNotification]);

  const value = useMemo(() => ({ addNotification }), [addNotification]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="fixed z-[200] pointer-events-none flex flex-col gap-3 p-4 
        top-4 left-1/2 -translate-x-1/2 w-full max-w-[90vw] sm:max-w-md
        lg:top-auto lg:left-auto lg:bottom-4 lg:right-4 lg:translate-x-0 lg:items-end">
        <AnimatePresence mode="popLayout">
          {notifications.map((notification) => (
            <Toast
              key={notification.id}
              {...notification}
              onClose={() => removeNotification(notification.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}
