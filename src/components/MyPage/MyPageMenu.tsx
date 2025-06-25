import { NavLink } from 'react-router-dom';

const MyPageMenu = () => {
  return (
    <nav className='w-full rounded-md bg-white p-6 shadow-md'>
      {/* 사용자 이름 */}
      <div className='mb-6 text-xl font-bold text-slate-800'>김태율</div>

      {/* 메뉴 목록 */}
      <ul className='flex flex-col gap-4 text-sm'>
        <li>
          <NavLink
            to='/mypage'
            end
            className={({ isActive }) =>
              isActive
                ? 'font-semibold text-red-500'
                : 'text-gray-700 hover:text-red-400'
            }
          >
            개인정보 수정
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/mypage/plan'
            className={({ isActive }) =>
              isActive
                ? 'font-semibold text-red-500'
                : 'text-gray-700 hover:text-red-400'
            }
          >
            내 여행일정
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/mypage/places'
            className={({ isActive }) =>
              isActive
                ? 'font-semibold text-red-500'
                : 'text-gray-700 hover:text-red-400'
            }
          >
            즐겨찾는 장소
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/mypage/regions'
            className={({ isActive }) =>
              isActive
                ? 'font-semibold text-red-500'
                : 'text-gray-700 hover:text-red-400'
            }
          >
            즐겨찾는 지역
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default MyPageMenu;
