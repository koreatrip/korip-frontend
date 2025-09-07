import { AnimatePresence, motion } from 'framer-motion';

export type TDropdownItem = {
  value: string;
  label: string;
  onClick?: () => void;
  href?: string;
};

export type TDropdownProps = {
  isOpen: boolean;
  items: TDropdownItem[];
  onClose: () => void;
  className?: string;
  position?: 'left' | 'right' | 'center';
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
          className={`shadow-light border-outline-gray bg-bg-white absolute top-full z-50 mt-2 rounded-2xl border py-3 ${width} ${positionClass} ${className}`}
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
