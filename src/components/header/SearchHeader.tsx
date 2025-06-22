import { logo_sm } from '@/assets/assets';
import { useHeaderStore, type DropdownItem } from '@/stores/useHeaderStore';
import Dropdown from '../dropdown/Dropdown';
import {
  Bars3Icon,
  GlobeAltIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import SideMenu from '../sideMenu/SideMenu';
import SearchBar from '../searchBar/SearchBar';

const SearchHeader = () => {
  const { stack, actions } = useHeaderStore();

  const mainMenuItems = [
    { label: '지역별 둘러보기', href: '/regions' },
    { label: '여행', href: '/travel' },
    { label: '한국 여행 팁', href: '/tips' },
  ];

  const authMenuItems = [
    { label: '로그인', href: '/login' },
    // { label: '회원가입', href: '/register' },
  ];

  const languages: DropdownItem[] = [
    { label: '한국어', value: 'ko', onClick: () => console.log('한국어 선택') },
    { label: '영어', value: 'en', onClick: () => console.log('영어 선택') },
    { label: '일본어', value: 'ja', onClick: () => console.log('일본어 선택') },
    { label: '중국어', value: 'zh', onClick: () => console.log('중국어 선택') },
  ];

  // 여행 드롭다운 아이템들 (예시)
  const travelItems: DropdownItem[] = [
    { label: '내 여행 일정', value: 'my-itinerary', href: '/my-itinerary' },
    {
      label: '새로운 일정 만들기',
      value: 'new-itinerary',
      href: '/create-itinerary',
    },
  ];

  return (
    <div className='bg-bg-white border-b-outline-gray flex h-20 w-full items-center justify-center border-b'>
      <div className='flex w-full items-center justify-between px-4'>
        {/* 로고 */}
        <div>
          <img src={logo_sm} alt='Koriplogo' />
        </div>

        <SearchBar height='h-12' />

        {/* 데스크톱 메뉴 (425px 이상에서만 표시) */}
        <ul className='hidden items-center font-semibold sm:flex'>
          {mainMenuItems.map((item) => (
            <li
              key={item.label}
              className='hover:bg-hover-gray relative cursor-pointer rounded-lg px-5 py-[10px]'
            >
              {item.label === '여행' ? (
                <>
                  <button
                    onClick={actions.toggleTravelDropdown}
                    className='flex items-center gap-x-1'
                  >
                    <p>{item.label}</p>
                  </button>
                  <Dropdown
                    isOpen={stack.isTravelDropdownOpen}
                    items={travelItems}
                    onClose={actions.closeTravelDropdown}
                    position='left'
                    width='w-48'
                  />
                </>
              ) : (
                <a href={item.href}>
                  <p>{item.label}</p>
                </a>
              )}
            </li>
          ))}
        </ul>

        {/* 데스크톱 우측 메뉴 (425px 이상에서만 표시) */}
        <ul className='hidden items-center font-semibold sm:flex'>
          <li className='relative'>
            <button
              onClick={actions.toggleLangDropdown}
              className='hover:bg-hover-gray flex cursor-pointer items-center gap-x-1 rounded-lg px-3 py-1.5'
            >
              <GlobeAltIcon className='h-5 w-5 stroke-2' />
              <p>언어별</p>
            </button>

            <Dropdown
              isOpen={stack.isLangDropdownOpen}
              items={languages}
              onClose={actions.closeLangDropdown}
            />
          </li>
          {authMenuItems.map((item) => (
            <li
              key={item.label}
              className='hover:bg-hover-gray cursor-pointer rounded-lg px-3 py-1.5'
            >
              <a href={item.href}>
                <p>{item.label}</p>
              </a>
            </li>
          ))}
        </ul>

        {/* 모바일 우측 (425px 미만에서만 표시) */}
        <div className='flex items-center gap-x-2 sm:hidden'>
          {/* 로그인 버튼 */}
          <a
            href='/login'
            className='hover:bg-hover-gray cursor-pointer rounded-lg px-3 py-1.5'
          >
            <p>로그인</p>
          </a>

          {/* 햄버거 메뉴 버튼 */}
          <button
            onClick={actions.toggleMenu}
            className='hover:bg-hover-gray rounded-lg p-2'
            aria-label={stack.isMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
          >
            {stack.isMenuOpen ? (
              <XMarkIcon className='h-6 w-6' />
            ) : (
              <Bars3Icon className='h-6 w-6' />
            )}
          </button>
        </div>
      </div>

      {/* 모바일 사이드 메뉴 */}
      <SideMenu
        isOpen={stack.isMenuOpen}
        onClose={actions.closeMenu}
        mainMenuItems={mainMenuItems}
        authMenuItems={authMenuItems.slice(1)} // 로그인 제외 (이미 상단에 있음)
        languages={languages}
      />
    </div>
  );
};

export default SearchHeader;
