import { airplane } from '@/assets/assets';
import { motion } from 'framer-motion';
import LoadingText from '@/components/common/LoadingText';

const LoadingPage = () => {
  return (
    <div className='bg-bg-white text-sub-text-gray flex min-h-screen flex-col items-center justify-center'>
      <motion.div
        animate={{ y: [0, -10, 0] }} // y축으로 0 -> -10 -> 0 으로 움직임
        transition={{
          duration: 3,
          ease: 'easeInOut',
          repeat: Infinity, // 무한 반복
        }}
      >
        <img src={airplane} alt='airplane' />
      </motion.div>
      <div className='mt-8'>
        <LoadingText />
      </div>
    </div>
  );
};

export default LoadingPage;
