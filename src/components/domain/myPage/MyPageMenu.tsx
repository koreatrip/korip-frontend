import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

const MyPageMenu = () => {
  const { t } = useTranslation();

  return (
    <nav className='hidden h-[291px] w-[326px] rounded-xl bg-white p-10 shadow-md md:ml-[-40px] md:block'>
      {/* 사용자 이름 */}
      <div className='mb-6 text-4xl font-normal text-slate-800'>김태율</div>

      {/* 메뉴 목록 */}
      <ul className='m-4 flex flex-col gap-4 text-sm'>
        <li>
          <NavLink
            to='/mypage'
            end
            className={({ isActive }) =>
              isActive
                ? 'font-semibold text-red-400'
                : 'text-gray-700 hover:text-red-400'
            }
          >
            {t('user.edit_profile')}
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/mypage/plan'
            className={({ isActive }) =>
              isActive
                ? 'font-semibold text-red-400'
                : 'text-gray-700 hover:text-red-400'
            }
          >
            {t('travel.my_travel_plans')}
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/mypage/places'
            className={({ isActive }) =>
              isActive
                ? 'font-semibold text-red-400'
                : 'text-gray-700 hover:text-red-400'
            }
          >
            {t('places.favorite_places')}
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/mypage/regions'
            className={({ isActive }) =>
              isActive
                ? 'font-semibold text-red-400'
                : 'text-gray-700 hover:text-red-400'
            }
          >
            {t('places.favorite_regions')}
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default MyPageMenu;
