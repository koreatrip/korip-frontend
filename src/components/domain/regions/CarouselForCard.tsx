import { Children, type ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { left_arrow, right_arrow } from '@/assets/assets';

type CarouselProps = {
  children: ReactNode;
  length: number;
};

const CarouselForCard = ({ children, length }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(2); // 동적으로 변경될 값

  const items = Children.toArray(children);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  useEffect(() => {
    const handleResize = () => {
      // Tailwind CSS의 lg breakpoint(1024px)를 기준으로 아이템 수를 결정합니다.
      if (window.innerWidth >= 1024) {
        setItemsPerPage(4);
      } else {
        setItemsPerPage(2);
      }
    };

    // 초기 로드 시 한 번 실행
    handleResize();

    // resize 이벤트 리스너 등록
    window.addEventListener('resize', handleResize);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
    }),
    center: {
      zIndex: 1,
      x: 0,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
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

  // 드래그 임계값 설정
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  // 드래그 종료 시 페이지 전환 처리
  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    {
      offset,
      velocity,
    }: { offset: { x: number; y: number }; velocity: { x: number; y: number } }
  ) => {
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      // 왼쪽으로 스와이프 -> 다음 페이지
      paginate(1);
    } else if (swipe > swipeConfidenceThreshold) {
      // 오른쪽으로 스와이프 -> 이전 페이지
      paginate(-1);
    }
  };

  return (
    <div className='relative mx-auto w-full'>
      <div className='relative flex w-full items-center overflow-hidden'>
        <AnimatePresence initial={false} custom={direction} mode='popLayout'>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial='enter'
            animate='center'
            exit='exit'
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
            }}
            drag='x'
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={handleDragEnd}
            className='absolute grid w-full grid-cols-2 gap-5 lg:grid-cols-4'
            style={{ minHeight: '200px', minWidth: '100%', cursor: 'grab' }}
          >
            {getVisibleItems()}
          </motion.div>
        </AnimatePresence>
        {/* 높이 유지를 위한 placeholder */}
        <div
          className='invisible grid w-full grid-cols-2 gap-5 lg:grid-cols-4'
          style={{ minHeight: '200px' }}
        >
          {getVisibleItems()}
        </div>
      </div>
      {length > itemsPerPage && ( // 동적 itemsPerPage 값을 사용
        <>
          {/* 좌측 화살표 */}
          <motion.button
            className='text-main-text-navy absolute top-1/2 -left-5 z-20 flex h-10 w-10 -translate-y-[50px] items-center justify-center rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105'
            onClick={() => paginate(-1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img src={left_arrow} alt='Previous' />
          </motion.button>
          {/* 우측 화살표 */}
          <motion.button
            className='text-main-text-navy absolute top-1/2 -right-5 z-20 flex h-10 w-10 -translate-y-[50px] items-center justify-center rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105'
            onClick={() => paginate(1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img src={right_arrow} alt='Next' />
          </motion.button>
        </>
      )}
    </div>
  );
};

export default CarouselForCard;
