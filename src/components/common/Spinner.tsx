import { motion } from 'framer-motion';

type SpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
};

const Spinner = ({ size = 'md' }: SpinnerProps) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.15,
        repeat: Infinity,
        repeatType: 'loop' as const, // 타입 명시
      },
    },
  };

  const dotVariants = {
    animate: {
      scale: [1, 1.5, 1],
      opacity: [0.7, 1, 0.7],
      backgroundColor: ['#2c3e50', '#ff5566', '#ff6b7a', '#2c3e50'],
      transition: {
        duration: 1.2,
        ease: 'easeInOut' as const,
        repeat: Infinity,
      },
    },
  };

  return (
    <motion.div
      className='flex space-x-1.5'
      variants={containerVariants}
      animate='animate'
    >
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className={`${sizeClasses[size]} rounded-full`}
          variants={dotVariants}
        />
      ))}
    </motion.div>
  );
};

export default Spinner;
