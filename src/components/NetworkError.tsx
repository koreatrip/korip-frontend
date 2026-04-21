import { cn } from '@/utils/cn';
import { SignalSlashIcon } from '@heroicons/react/24/outline';
import { motion } from 'motion/react';
import Button from './common/Button';

type NetworkErrorProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
};

export function NetworkError({
  title = '인터넷 연결이 끊어졌어요',
  description = '네트워크 연결을 확인하고 다시 시도해주세요.',
  onRetry,
  className,
}: NetworkErrorProps) {
  const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease }}
      className={cn('relative overflow-hidden p-8 text-center', className)}
    >
      {/* 배경 패턴 */}
      <div className='pointer-events-none absolute inset-0 opacity-[0.02]'>
        <svg width='100%' height='100%'>
          <pattern
            id='wifi-pattern'
            x='0'
            y='0'
            width='40'
            height='40'
            patternUnits='userSpaceOnUse'
          >
            <circle cx='20' cy='20' r='1' fill='#8b9dc3' />
          </pattern>
          <rect width='100%' height='100%' fill='url(#wifi-pattern)' />
        </svg>
      </div>

      <div className='relative z-10'>
        {/* 애니메이션 아이콘 */}
        <motion.div
          animate={{
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className='mx-auto mb-4 inline-flex items-center justify-center rounded-full bg-[#8b9dc3]/10 p-4'
        >
          <SignalSlashIcon className='size-8 text-[#8b9dc3]' />
        </motion.div>

        {/* 텍스트 */}
        <h3 className='mb-2 text-[#2c3e50]'>{title}</h3>
        <p className='mx-auto mb-6 max-w-sm leading-relaxed text-[#8b9dc3]'>
          {description}
        </p>

        {/* 재시도 버튼 */}
        {onRetry && (
          <Button
            onClick={onRetry}
            // variant='outline'
          >
            다시 시도
          </Button>
        )}
      </div>
    </motion.div>
  );
}
