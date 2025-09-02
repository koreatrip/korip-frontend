import { motion } from 'framer-motion';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';

const MobileSlideMenu = () => {
  const { t } = useTranslation();

  const menuItems = useMemo(
    () => [
      { to: '/mypage', labelKey: 'user.edit_profile' },
      { to: '/mypage/plan', labelKey: 'travel.my_travel_plans' },
      { to: '/mypage/places', labelKey: 'places.favorite_places' },
      { to: '/mypage/regions', labelKey: 'places.favorite_regions' },
    ],
    []
  ); // 의존성 배열 비워둠 (정적 데이터이므로)

  const scrollRef = useRef<HTMLUListElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const listEl = scrollRef.current;
    if (!listEl) return;

    const activeIndex = menuItems.findIndex((item) =>
      item.to === '/mypage'
        ? location.pathname === '/mypage'
        : location.pathname.startsWith(item.to)
    );

    const activeEl = listEl.children[activeIndex] as HTMLElement;

    if (activeEl) {
      const listRect = listEl.getBoundingClientRect();
      const itemRect = activeEl.getBoundingClientRect();

      const left = itemRect.left - listRect.left + listEl.scrollLeft;
      const width = itemRect.width;

      setIndicatorStyle({ left, width });

      // 자동 스크롤 중앙 정렬
      const scrollAmount =
        activeEl.offsetLeft - listEl.clientWidth / 2 + activeEl.clientWidth / 2;
      listEl.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }
  }, [location.pathname, t]);
  return (
    <nav className='bg-bg-white block w-full md:hidden'>
      <div className='relative'>
        <ul
          ref={scrollRef}
          className='scrollbar-hide flex gap-4 overflow-x-auto px-4 py-3 text-base whitespace-nowrap select-none'
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {menuItems.map((item) => (
            <li key={item.to} className='h-[65px] w-[107px] shrink-0'>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex h-full items-center justify-center transition-colors duration-200 ${
                    isActive
                      ? 'font-semibold text-red-400'
                      : 'text-gray-700 hover:text-red-400'
                  }`
                }
                end={item.to === '/mypage'}
              >
                {t(item.labelKey)}
              </NavLink>
            </li>
          ))}
        </ul>

        <motion.div
          ref={indicatorRef}
          className='absolute bottom-0 h-[2px] bg-red-400'
          animate={indicatorStyle}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      </div>
    </nav>
  );
};

export default MobileSlideMenu;
