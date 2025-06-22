import type { DropdownItem } from '@/stores/useHeaderStore';
import { motion, AnimatePresence } from 'framer-motion';
type TDropdownProps = {
  isOpen: boolean;
  items: DropdownItem[];
  onClose: () => void;
  className?: string;
  position?: 'left' | 'right';
  width?: string;
};
const Dropdown = ({
  isOpen,
  items,
  onClose,
  className = '',
  position = 'right',
  width = 'w-40',
}: TDropdownProps) => {
  const positionClass = position === 'left' ? 'left-0' : 'right-0';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={`shadow-light border-outline-gray absolute top-full z-50 mt-2 rounded-2xl border bg-white py-3 ${width} ${positionClass} ${className}`}
        >
          {items.map((item) => (
            <button
              key={item.value}
              onClick={() => {
                if (item.onClick) {
                  item.onClick();
                } else if (item.href) {
                  window.location.href = item.href;
                }
                onClose();
              }}
              className='w-full px-6 py-3 text-left font-medium text-gray-800 hover:bg-gray-50'
            >
              {item.label}
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Dropdown;
