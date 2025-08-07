import type { DropdownItem } from '@/stores/useHeaderStore';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
type TMenuItem = {
  label: string;
  href: string;
};

type TSideMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  mainMenuItems: TMenuItem[];
  authMenuItems: TMenuItem[];
  languages: DropdownItem[];
  title?: string;
};

const SideMenu = ({
  isOpen,
  onClose,
  mainMenuItems,
  authMenuItems,
  languages,
  title = '메뉴',
}: TSideMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 오버레이 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='bg-opacity-50 bg-main-text-navy/40 tablet-bp:hidden fixed inset-0 z-40'
            onClick={onClose}
          />

          {/* 사이드 메뉴 */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className='tablet-bp:hidden bg-bg-white fixed top-0 right-0 z-50 h-full w-80 shadow-xl'
          >
            {/* 메뉴 헤더 */}
            <div className='border-outline-gray flex items-center justify-between border-b p-6'>
              <h2 className='text-lg font-semibold'>{title}</h2>
              <button
                onClick={onClose}
                className='hover:bg-hover-gray rounded-lg p-2'
              >
                <XMarkIcon className='h-6 w-6' />
              </button>
            </div>

            {/* 메뉴 아이템들 */}
            <div className='py-4'>
              {/* 메인 메뉴 아이템들 */}
              {mainMenuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className='border-outline-gray text-main-text-navy hover:bg-hover-gray block border-b px-6 py-4'
                >
                  {item.label}
                </a>
              ))}

              {/* 인증 메뉴 아이템들 */}
              {authMenuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className='border-outline-gray text-main-text-navy hover:bg-hover-gray block border-b px-6 py-4'
                >
                  {item.label}
                </a>
              ))}

              {/* 언어 선택 */}
              <div className='px-6 py-4'>
                <div className='mb-3 flex items-center gap-x-2'>
                  <GlobeAltIcon className='h-5 w-5 stroke-2' />
                  <span className='font-medium'>언어 선택</span>
                </div>
                <div className='space-y-2'>
                  {languages.map((lang) => (
                    <button
                      key={lang.value}
                      onClick={() => {
                        if (lang.onClick) {
                          lang.onClick();
                        }
                        onClose();
                      }}
                      className='text-main-text-navy hover:bg-hover-gray block w-full rounded-lg px-4 py-2 text-left'
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SideMenu;
