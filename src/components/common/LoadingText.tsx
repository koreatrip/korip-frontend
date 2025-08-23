import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const LoadingText = () => {
  const [textIndex, setTextIndex] = useState(0);
  const { t } = useTranslation();
  const loadingTexts = [
    t('common.finding_beautiful_places'),
    t('common.discovering_hidden_gems'),
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prevIndex) => (prevIndex + 1) % loadingTexts.length);
    }, 3000); // 3초마다 텍스트 변경

    return () => clearInterval(interval);
  }, [loadingTexts.length]);

  // Framer Motion을 위한 애니메이션 variants
  const textVariants = {
    enter: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className='relative flex h-6 w-64 items-center justify-center text-center'>
      <AnimatePresence mode='wait'>
        <motion.span
          key={textIndex}
          variants={textVariants}
          initial='exit'
          animate='enter'
          exit='exit'
          className='absolute'
        >
          {loadingTexts[textIndex]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export default LoadingText;
