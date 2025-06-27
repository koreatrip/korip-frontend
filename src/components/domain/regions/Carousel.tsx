import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { left_arrow, right_arrow } from '@/assets/assets';

// 샘플 데이터 타입
type TCarouselItem = {
  id: number;
  title: string;
  image: string;
};

// 샘플 데이터
const sampleItems: TCarouselItem[] = [
  {
    id: 1,
    title: '슬라이드 1',
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop',
  },
  {
    id: 2,
    title: '슬라이드 2',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop',
  },
  {
    id: 3,
    title: '슬라이드 3',
    image:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=500&fit=crop',
  },
  {
    id: 4,
    title: '슬라이드 4',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=500&fit=crop',
  },
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

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

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      if (newDirection === 1) {
        return prevIndex === sampleItems.length - 1 ? 0 : prevIndex + 1;
      } else {
        return prevIndex === 0 ? sampleItems.length - 1 : prevIndex - 1;
      }
    });
  };

  return (
    <div className='mx-auto w-full'>
      <div className='relative h-96 overflow-hidden rounded-2xl bg-gray-50 shadow-lg'>
        <AnimatePresence initial={false} custom={direction}>
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
            drag='x'
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className='absolute inset-0 cursor-grab active:cursor-grabbing'
          >
            <img
              src={sampleItems[currentIndex].image}
              alt={sampleItems[currentIndex].title}
              className='h-full w-full object-cover'
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>

        {/* 좌측 화살표 - 사진처럼 원형 배경 */}
        <motion.button
          className='text-main-text-navy absolute top-1/2 left-4 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105'
          onClick={() => paginate(-1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <img src={left_arrow} />
        </motion.button>

        {/* 우측 화살표 - 사진처럼 원형 배경 */}
        <motion.button
          className='text-main-text-navy absolute top-1/2 right-4 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105'
          onClick={() => paginate(1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <img src={right_arrow} />
        </motion.button>
      </div>
    </div>
  );
};

export default Carousel;
