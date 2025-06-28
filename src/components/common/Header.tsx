import { logo_sm } from '@/assets/assets';
import {
  GlobeAltIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useHeaderStore } from '@/stores/useHeaderStore';
// DropdownItem 타입도 여기서 가져온다고 가정
import SideMenu from './sideMenu/SideMenu';
import SearchBar from './searchBar/SearchBar';
import type { TDropdownItem } from './dropdown/Dropdown';
import Dropdown from './dropdown/Dropdown';

// --- Props 타입 정의 ---
type THeaderProps = {
  variant?: 'default' | 'search';
};

// --- 단일 Header 컴포넌트 ---
const Header = ({ variant = 'default' }: THeaderProps) => {
  // 1. 모든 상태와 데이터는 한 곳에서 관리합니다.
  const { stack, actions } = useHeaderStore();

  const mainMenuItems = [
    { label: '지역별 둘러보기', href: '/regions/explore' },
    { label: '여행', href: '/travel' },
    { label: '한국 여행 팁', href: '/tips' },
  ];

  const authMenuItems = [
    { label: '로그인', href: '/login' },
    { label: '회원가입', href: '/register' },
  ];

  const languages: TDropdownItem[] = [
    { label: '한국어', value: 'ko' },
    { label: '영어', value: 'en' },
    { label: '일본어', value: 'ja' },
    { label: '중국어', value: 'zh' },
  ];

  const travelItems: TDropdownItem[] = [
    { label: '내 여행 일정', value: 'my-itinerary', href: '/my-itinerary' },
    {
      label: '새로운 일정 만들기',
      value: 'new-itinerary',
      href: '/create-itinerary',
    },
  ];

  // 가독성을 위해 데스크톱 메뉴를 작은 컴포넌트로 분리
  const MainMenu = () => (
    <ul className='hidden items-center font-medium sm:flex'>
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
  );

  return (
    <div className='bg-bg-white border-b-outline-gray flex h-20 w-full items-center justify-center border-b'>
      <div className='flex w-full max-w-[1440px] items-center justify-between px-4'>
        {/* 로고 (공통) */}
        <div>
          <img src={logo_sm} alt='Koriplogo' />
        </div>

        {/* variant에 따라 데스크톱의 가운데와 오른쪽 메뉴를 다르게 렌더링 --- */}

        {/* 기본 헤더 레이아웃 */}
        {variant === 'default' && (
          <>
            <div className='flex flex-grow justify-center'>
              <MainMenu />
            </div>
            <ul className='hidden items-center font-medium sm:flex'>
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
            </ul>
          </>
        )}

        {/* 검색 헤더 레이아웃 */}
        {variant === 'search' && (
          <>
            <div className='flex-grow px-10'>
              <SearchBar height='h-12' />
            </div>
            <div className='hidden items-center sm:flex'>
              <MainMenu />
            </div>
            <ul className='hidden items-center font-medium sm:flex'>
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
              {/* '회원가입' 제외 */}
              <li className='hover:bg-hover-gray cursor-pointer rounded-lg px-3 py-1.5'>
                <a href={authMenuItems[0].href}>
                  <p>{authMenuItems[0].label}</p>
                </a>
              </li>
            </ul>
          </>
        )}

        {/* 모바일 우측 메뉴 (공통) */}
        <div className='flex items-center gap-x-2 sm:hidden'>
          <a
            href='/login'
            className='hover:bg-hover-gray cursor-pointer rounded-lg px-3 py-1.5 font-semibold'
          >
            <p>로그인</p>
          </a>
          <button
            onClick={actions.toggleMenu}
            className='hover:bg-hover-gray rounded-lg p-2'
          >
            {stack.isMenuOpen ? (
              <XMarkIcon className='h-6 w-6' />
            ) : (
              <Bars3Icon className='h-6 w-6' />
            )}
          </button>
        </div>
      </div>

      {/* 모바일 사이드 메뉴 (공통) */}
      <SideMenu
        isOpen={stack.isMenuOpen}
        onClose={actions.closeMenu}
        mainMenuItems={mainMenuItems}
        authMenuItems={authMenuItems.slice(1)}
        languages={languages}
      />
    </div>
  );
};

export default Header;
