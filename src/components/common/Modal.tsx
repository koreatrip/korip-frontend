import { XMarkIcon } from '@heroicons/react/24/outline';
import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
  showCloseButton = true,
}) => {
  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // 배경 스크롤 방지
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* 배경 오버레이 */}
      <div
        className='fixed inset-0 transition-opacity'
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={onClose}
        aria-hidden='true'
      />

      {/* 모달 컨텐츠 */}
      <div
        className={`relative w-full ${maxWidthClasses[maxWidth]} mx-4 transform rounded-lg bg-white shadow-xl transition-all`}
        role='dialog'
        aria-modal='true'
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        {(title || showCloseButton) && (
          <div className='flex items-center justify-between border-b border-gray-200 p-6'>
            <h3 className='text-main-text-navy text-lg font-semibold'>
              {title}
            </h3>
            {showCloseButton && (
              <button
                onClick={onClose}
                className='rounded-full p-1 text-black transition-colors'
                aria-label='모달 닫기'
              >
                <XMarkIcon className='h-6 w-6' />
              </button>
            )}
          </div>
        )}

        {/* 바디 */}
        <div className='p-6'>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
