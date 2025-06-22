import { useEffect, useState } from 'react';
import {
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

type ToastType = 'success' | 'error' | 'info' | 'warning';

type ToastProps = {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
};

const ToastMessage = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
}: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  // 타입별 스타일과 아이콘
  const getToastConfig = (type: ToastType) => {
    const configs = {
      success: {
        icon: CheckCircleIcon,
        bgColor: 'bg-sub-green',
        borderColor: 'border-sub-green/20',
        iconColor: 'text-white',
      },
      error: {
        icon: XCircleIcon,
        bgColor: 'bg-error-red',
        borderColor: 'border-error-red/20',
        iconColor: 'text-white',
      },
      warning: {
        icon: ExclamationTriangleIcon,
        bgColor: 'bg-point-gold',
        borderColor: 'border-point-gold/20',
        iconColor: 'text-white',
      },
      info: {
        icon: InformationCircleIcon,
        bgColor: 'bg-main-pink',
        borderColor: 'border-main-pink/20',
        iconColor: 'text-white',
      },
    };
    return configs[type];
  };

  const config = getToastConfig(type);
  const Icon = config.icon;

  useEffect(() => {
    // 입장 애니메이션
    const showTimer = setTimeout(() => setIsVisible(true), 50);

    // 자동 종료
    const hideTimer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, 300);
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [duration, onClose]);

  return (
    <div
      className={`fixed bottom-32 left-1/2 z-50 -translate-x-1/2 transition-all duration-300 ease-out ${
        isVisible && !isLeaving
          ? 'translate-y-0 scale-100 opacity-100'
          : 'translate-y-4 scale-95 opacity-0'
      }`}
    >
      <div
        className={` ${config.bgColor} ${config.borderColor} shadow-large flex max-w-[400px] min-w-[200px] items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium text-white backdrop-blur-sm`}
      >
        {/* 아이콘 */}
        <Icon className={`h-5 w-5 flex-shrink-0 ${config.iconColor}`} />

        {/* 메시지 */}
        <span className='flex-1'>{message}</span>

        {/* 진행 바 (선택사항) */}
        <div className='absolute bottom-0 left-0 h-1 overflow-hidden rounded-b-xl bg-white/30'>
          <div
            className='h-full animate-[shrink_3s_linear_forwards] rounded-b-xl bg-white/60'
            style={{
              animationDuration: `${duration}ms`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ToastMessage;
