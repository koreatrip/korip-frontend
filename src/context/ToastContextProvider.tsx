import ToastMessage from '@/components/common/ToastMessage';
import React, { createContext, useCallback, useState } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

type ToastData = {
  message: string;
  type: ToastType;
  id: number;
};

type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void;
};

export const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { message, type, id }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext value={{ showToast }}>
      {children}
      {toasts.map((toast) => (
        <ToastMessage
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </ToastContext>
  );
};
