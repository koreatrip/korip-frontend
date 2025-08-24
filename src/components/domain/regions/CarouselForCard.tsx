import { Children, type ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { left_arrow, right_arrow } from '@/assets/assets';

type CarouselProps = {
  children: ReactNode;
};

const CarouselForCard = ({ children }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const items = Children.toArray(children);
  const itemsPerPage = 4; // 한 번에 보여줄 아이템 수
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + newDirection;
      if (newIndex < 0) {
        return totalPages - 1;
      }
      if (newIndex >= totalPages) {
        return 0;
      }
      return newIndex;
    });
  };

  const getVisibleItems = () => {
    const startIndex = currentIndex * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  return (
    <div className='relative mx-auto w-full'>
      {/* 고정 높이를 가진 컨테이너로 수정 */}
      <div className='relative flex h-[380px] items-center overflow-hidden'>
        {/* mode="wait" 추가 */}
        <AnimatePresence initial={false} custom={direction} mode='wait'>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial='enter'
            animate='center'
            exit='exit'
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            // absolute 포지션으로 레이아웃 깨짐 방지
            className='absolute grid w-full grid-cols-4 gap-4'
          >
            {getVisibleItems()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 좌측 화살표 */}
      <motion.button
        className='text-main-text-navy absolute top-2/5 -left-5 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105'
        onClick={() => paginate(-1)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <img src={left_arrow} alt='Previous' />
      </motion.button>

      {/* 우측 화살표 */}
      <motion.button
        className='text-main-text-navy absolute top-2/5 -right-5 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105'
        onClick={() => paginate(1)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <img src={right_arrow} alt='Next' />
      </motion.button>
    </div>
  );
};

export default CarouselForCard;
