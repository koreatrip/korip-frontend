import { NavLink } from 'react-router-dom';

const MyPageMenu = () => {
  return (
    <nav className='flex flex-col gap-4 text-sm'>
      <div className='mb-4 text-lg font-bold'>김태율</div>

      <NavLink
        to='/mypage'
        className={({ isActive }) =>
          isActive ? 'text-main underline' : 'text-gray-700'
        }
      >
        개인정보 수정
      </NavLink>

      <NavLink
        to='/mypage/plan'
        className={({ isActive }) =>
          isActive ? 'text-main underline' : 'text-gray-700'
        }
      >
        내 여행일정
      </NavLink>

      <NavLink
        to='/mypage/places'
        className={({ isActive }) =>
          isActive ? 'text-main underline' : 'text-gray-700'
        }
      >
        즐겨찾는 장소
      </NavLink>

      <NavLink
        to='/mypage/regions'
        className={({ isActive }) =>
          isActive ? 'text-main underline' : 'text-gray-700'
        }
      >
        즐겨찾는 지역
      </NavLink>
    </nav>
  );
};

export default MyPageMenu;
