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
    sm: 'w-[512px]',
    md: 'w-[512px]',
    lg: 'w-[512px]',
    xl: 'w-[512px]',
    '2xl': 'w-[512px]',
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
        className={`relative ${maxWidthClasses[maxWidth]} mx-4 flex h-[634px] transform flex-col rounded-lg bg-white shadow-xl transition-all`}
        role='dialog'
        aria-modal='true'
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        {(title || showCloseButton) && (
          <div className='flex-shrink-0'>
            <div className='mx-4 mt-4 -mb-4 flex items-center justify-between p-6'>
              <h3 className='text-main-text-navy text-2xl font-semibold'>
                {title}
              </h3>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className='rounded-full p-1 text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-600'
                  aria-label='모달 닫기'
                >
                  <XMarkIcon className='h-8 w-8 stroke-3' />
                </button>
              )}
            </div>
            <hr className='mx-10 border-1 border-gray-100' />
          </div>
        )}

        {/* 바디 */}
        <div className='-mt-4 flex-1 overflow-y-auto p-10 font-medium'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
