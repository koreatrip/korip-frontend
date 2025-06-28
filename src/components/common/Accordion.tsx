import { ChevronUpIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
const Accordion = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className='bg-sub-green shadow-light w-full overflow-hidden rounded-lg'>
      {/* 헤더: 클릭하면 isOpen 상태를 토글합니다. */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='text-bg-white flex w-full items-center justify-between p-5 text-left'
      >
        <h3 className='text-lg font-medium'>{title}</h3>
        <ChevronUpIcon
          className={`h-6 w-6 transform transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* 콘텐츠 영역: AnimatePresence와 motion.div로 애니메이션을 적용합니다. */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key='content'
            initial='collapsed'
            animate='open'
            exit='collapsed'
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            className='overflow-hidden'
          >
            <div className='text-main-text-navy bg-bg-white p-6'>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Accordion;
