import type { DropdownItem } from '@/stores/useHeaderStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  GlobeAltIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/useAuthStore';

type TMenuItem = {
  label: string;
  href?: string;
  onClick?: () => void;
  hasSubmenu?: boolean;
  submenu?: {
    label: string;
    href?: string;
    onClick?: () => void;
  }[];
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
  const { t } = useTranslation();
  const isLogin = useAuthStore((state) => state.auth.isLogin);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const handleMenuClick = (item: TMenuItem) => {
    if (item.hasSubmenu) {
      // 서브메뉴가 있는 경우 토글
      setExpandedMenu(expandedMenu === item.label ? null : item.label);
    } else if (item.onClick) {
      // onClick이 있는 경우 실행하고 메뉴 닫기
      item.onClick();
      onClose();
    } else if (item.href) {
      // href가 있는 경우 링크 이동
      window.location.href = item.href;
      onClose();
    }
  };

  const handleSubmenuClick = (submenuItem: TMenuItem['submenu'][0]) => {
    if (submenuItem.onClick) {
      submenuItem.onClick();
      onClose();
    } else if (submenuItem.href) {
      window.location.href = submenuItem.href;
      onClose();
    }
  };

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
            className='fixed inset-0 z-40'
            onClick={onClose}
          />

          {/* 사이드 메뉴 */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className='bg-bg-white fixed top-0 right-0 z-50 h-full w-80 shadow-xl'
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
            <div className='overflow-y-auto py-4'>
              {/* 메인 메뉴 아이템들 */}
              {mainMenuItems.map((item) => (
                <div key={item.label}>
                  <button
                    onClick={() => handleMenuClick(item)}
                    className='border-outline-gray text-main-text-navy hover:bg-hover-gray flex w-full items-center justify-between border-b px-6 py-4 text-left'
                  >
                    <span>{item.label}</span>
                    {item.hasSubmenu && (
                      <ChevronDownIcon
                        className={`h-4 w-4 transform transition-transform ${
                          expandedMenu === item.label ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>

                  {/* 서브메뉴 */}
                  {item.hasSubmenu &&
                    item.submenu &&
                    expandedMenu === item.label && (
                      <div className='bg-bg-section'>
                        {item.submenu.map((submenuItem) => (
                          <button
                            key={submenuItem.label}
                            onClick={() => handleSubmenuClick(submenuItem)}
                            className='text-main-text-navy hover:bg-hover-gray border-outline-gray/50 w-full border-b px-8 py-3 text-left text-sm'
                          >
                            {submenuItem.label}
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              ))}

              {/* 인증 메뉴 아이템들 */}
              {!isLogin &&
                authMenuItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleMenuClick(item)}
                    className='border-outline-gray text-main-text-navy hover:bg-hover-gray w-full border-b px-6 py-4 text-left'
                  >
                    {item.label}
                  </button>
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
