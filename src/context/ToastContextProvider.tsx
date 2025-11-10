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
    // ✨ 핵심 수정: 기존 토스트를 제거하고 새 토스트만 표시
    setToasts([{ message, type, id }]);

    // 또는 최대 3개까지만 허용하려면 이렇게:
    // setToasts((prev) => [...prev, { message, type, id }].slice(-3));
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext value={{ showToast }}>
      {children}

      {/* ✨ 토스트 컨테이너로 감싸기 */}
      <div className='pointer-events-none fixed inset-0 z-50 flex items-end justify-center px-4 pb-32'>
        <div className='flex flex-col gap-2'>
          {toasts.map((toast) => (
            <ToastMessage
              key={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </div>
      </div>
    </ToastContext>
  );
};
