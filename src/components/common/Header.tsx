import { logo_sm } from '@/assets/assets';
import {
  GlobeAltIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { useHeaderStore } from '@/stores/useHeaderStore';
import { useState, useEffect, useRef } from 'react';
import SideMenu from './sideMenu/SideMenu';
import SearchBar from '../domain/searchBar/SearchBar';
import type { TDropdownItem } from './dropdown/Dropdown';
import Dropdown from './dropdown/Dropdown';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useModalStore } from '@/stores/useModalStore';
import CreateTripModal from '../modals/CreateTripModal';
import { useAuthStore } from '@/stores/useAuthStore';
import LoginPromptModal from '../domain/auth/LoginPromptModal';
import { useCreatePlanMutation } from '@/api/planner/plannerHooks';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/useToast';
import { plannerQueries } from '@/api/planner/plannerQueries';
import useClickOutside from '@/hooks/useClickOutside';

// --- Props 타입 정의 ---
type THeaderProps = {
  variant?: 'default' | 'search';
};

type TTripData = {
  tripName: string;
  tripDescription: string;
  location: string;
  selectedRegion: string;
};

// SideMenu에서 사용할 메뉴 아이템 타입
type TSideMenuItem = {
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

// --- 단일 Header 컴포넌트 ---
const Header = ({ variant = 'default' }: THeaderProps) => {
  const { t, i18n } = useTranslation();

  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { stack, actions } = useHeaderStore();
  const { stack: modalStack, actions: modalActions } = useModalStore();

  const [isScrolled, setIsScrolled] = useState(false);

  const isLogin = useAuthStore((state) => state.auth.isLogin);
  const { setLogout } = useAuthStore((state) => state.actions);

  // 드롭다운 외부 클릭 감지를 위한 ref
  const travelDropdownRef = useRef<HTMLLIElement>(null);
  const langDropdownRef = useRef<HTMLLIElement>(null);

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  //드롭다운 외부 클릭 감지
  useClickOutside(
    travelDropdownRef,
    actions.closeTravelDropdown,
    stack.isTravelDropdownOpen
  );
  useClickOutside(
    langDropdownRef,
    actions.closeLangDropdown,
    stack.isLangDropdownOpen
  );

  // 언어 변경 핸들러
  const handleLanguageChange = (languageCode: string) => {
    // 1. i18next의 현재 세션 언어 변경
    i18n.changeLanguage(languageCode);

    // ✨ 2. LocalStorage에 언어 설정 "수동으로" 덮어쓰기 (이것이 핵심!) ✨
    // 'i18nextLng'는 i18n.ts의 lookupLocalStorage에 설정된 키 이름입니다.
    localStorage.setItem('i18nextLng', languageCode);

    // 3. 현재 URL에 language 파라미터 추가/수정
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set('lang', languageCode);

    // 4. URL 업데이트 (페이지 리로드 없이)
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}?${currentParams}`
    );
    actions.closeLangDropdown();
  };

  // 여행 일정 생성 핸들러
  const createPlanMutation = useCreatePlanMutation({
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: plannerQueries.plans.all().queryKey,
      });
      showToast('새 여행 일정이 생성되었습니다.', 'success');
      modalActions.closeCreateTrip();
    },
    onError: (error) => {
      showToast(error.message || '여행 일정 생성에 실패했습니다.', 'error');
    },
  });

  const handleCreatePlanSubmit = (tripData: TTripData) => {
    createPlanMutation.mutate({
      name: tripData.tripName,
      description: tripData.tripDescription || `${tripData.location} 여행`,
      destination: tripData.location,
      subregion_id: Number(tripData.selectedRegion),
    });
  };

  // 데스크톱 헤더용 메뉴 아이템들
  const mainMenuItems = [
    {
      label: t('places.explore_regions'),
      href: `/explore/regions?region_id=1&lang=${i18n.language || 'ko'}`,
    },
    { label: t('common.travel'), href: '/travel' },
    { label: t('places.travel_tips'), href: '/tips' },
  ];

  // SideMenu용 메뉴 아이템들 (서브메뉴 포함)
  const sideMenuItems: TSideMenuItem[] = [
    // {
    //   label: t('common.mypage'),
    //   href: '/mypage',
    // },
    {
      label: t('places.explore_regions'),
      href: `/explore/regions?region_id=1&lang=${i18n.language || 'ko'}`,
    },
    {
      label: t('common.travel'),
      hasSubmenu: true,
      submenu: [
        {
          label: t('travel.my_travel_plans'),
          onClick: () => {
            if (!isLogin) {
              modalActions.openLoginPrompt();
              actions.closeMenu();
            } else {
              window.location.href = '/mypage/plan';
            }
          },
        },
        {
          label: t('travel.create_new_plan'),
          onClick: () => {
            if (!isLogin) {
              modalActions.openLoginPrompt();
              actions.closeMenu();
            } else {
              modalActions.openCreateTrip();
              actions.closeMenu();
            }
          },
        },
      ],
    },
    {
      label: t('places.travel_tips'),
      href: '/tips',
    },
  ];

  const authMenuItems = [
    { label: t('auth.login'), href: '/login' },
    { label: t('auth.signup'), href: '/register' },
  ];

  const logoutMenuItem = { label: t('auth.logout') };
  const handleLogout = () => {
    console.log('로그아웃 처리');
    setLogout();
  };

  // SideMenu용 인증 메뉴 (회원가입만)
  const sideAuthMenuItems: TSideMenuItem[] = [
    { label: t('auth.signup'), href: '/register' },
  ];

  const languages: TDropdownItem[] = [
    {
      label: t('languages.korean'),
      value: 'ko',
      onClick: () => handleLanguageChange('ko'),
    },
    {
      label: t('languages.english'),
      value: 'en',
      onClick: () => handleLanguageChange('en'),
    },
    {
      label: t('languages.japanese'),
      value: 'jp',
      onClick: () => handleLanguageChange('jp'),
    },
    {
      label: t('languages.chinese'),
      value: 'cn',
      onClick: () => handleLanguageChange('cn'),
    },
  ];

  const travelItems: TDropdownItem[] = [
    {
      label: t('travel.my_travel_plans'),
      value: 'my-itinerary',
      onClick: () => {
        if (!isLogin) {
          modalActions.openLoginPrompt();
          actions.closeTravelDropdown();
        } else {
          window.location.href = '/mypage/plan';
        }
      },
    },
    {
      label: t('travel.create_new_plan'),
      value: 'new-itinerary',
      onClick: () => {
        if (!isLogin) {
          modalActions.openLoginPrompt();
          actions.closeTravelDropdown();
        } else {
          modalActions.openCreateTrip();
          actions.closeTravelDropdown();
        }
      },
    },
  ];

  // 현재 언어에 맞는 표시명 가져오기
  const getCurrentLanguageLabel = () => {
    const currentLang = languages.find((lang) => lang.value === i18n.language);
    return currentLang?.label || t('languages.korean');
  };

  // 데스크톱에서만 보이는 메뉴
  const MainMenu = () => (
    <ul className='desktop-bp:flex hidden items-center font-medium'>
      {mainMenuItems.map((item) => (
        <li
          key={item.label}
          ref={item.label === t('common.travel') ? travelDropdownRef : null}
          className='hover:bg-hover-gray relative cursor-pointer rounded-lg px-5 py-[10px]'
        >
          {item.label === t('common.travel') ? (
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
    <div className='bg-bg-white border-b-outline-gray w-full border-b'>
      {/* 메인 헤더 */}
      <div className='flex h-20 w-full items-center justify-center'>
        <div className='flex w-full max-w-[1440px] items-center justify-between px-4'>
          {/* 로고 (공통) - 데스크톱에서는 flex-1 적용 */}
          <div className='desktop-bp:flex-1'>
            <Link to='/'>
              <img src={logo_sm} alt='Koriplogo' />
            </Link>
          </div>

          {/* variant에 따라 데스크톱의 가운데와 오른쪽 메뉴를 다르게 렌더링 --- */}

          {/* 기본 헤더 레이아웃 */}
          {variant === 'default' && (
            <>
              {/* 데스크톱: 중앙 메뉴 - flex-1로 공간 확보하고 center 정렬 */}
              <div className='desktop-bp:flex desktop-bp:flex-1 desktop-bp:justify-center hidden'>
                <MainMenu />
              </div>

              {/* 태블릿: 빈 공간 (검색바 제거) */}
              <div className='tablet-bp:flex desktop-bp:hidden hidden flex-grow'></div>

              {/* 데스크톱: 우측 메뉴 - flex-1로 공간 확보하고 end 정렬 */}
              <div className='desktop-bp:flex desktop-bp:flex-1 desktop-bp:justify-end hidden'>
                <ul className='flex items-center font-medium'>
                  {!isLogin ? (
                    authMenuItems.map((item) => (
                      <li
                        key={item.label}
                        className='hover:bg-hover-gray cursor-pointer rounded-lg px-3 py-1.5'
                      >
                        <a href={item.href}>
                          <p>{item.label}</p>
                        </a>
                      </li>
                    ))
                  ) : (
                    <>
                      <li className='hover:bg-hover-gray cursor-pointer rounded-lg px-3 py-1.5'>
                        <a href='/mypage' className='flex items-center gap-x-1'>
                          <UserCircleIcon className='text-main-text-navy h-6 w-6 stroke-2' />
                          {/* <p>{t('common.mypage')}</p> */}
                        </a>
                      </li>
                      <li
                        key={logoutMenuItem.label}
                        className='hover:bg-hover-gray cursor-pointer rounded-lg px-3 py-1.5'
                      >
                        <p onClick={handleLogout}>{logoutMenuItem.label}</p>
                      </li>
                    </>
                  )}

                  <li className='relative' ref={langDropdownRef}>
                    <button
                      onClick={actions.toggleLangDropdown}
                      className='hover:bg-hover-gray flex cursor-pointer items-center gap-x-1 rounded-lg px-3 py-1.5'
                    >
                      <GlobeAltIcon className='h-5 w-5 stroke-2' />
                      <p>{getCurrentLanguageLabel()}</p>
                    </button>
                    <Dropdown
                      isOpen={stack.isLangDropdownOpen}
                      items={languages}
                      onClose={actions.closeLangDropdown}
                    />
                  </li>
                </ul>
              </div>

              {/* 태블릿: 우측 메뉴 (로그인 + 햄버거만) */}
              <div className='tablet-bp:flex desktop-bp:hidden hidden items-center gap-x-2'>
                {!isLogin ? (
                  <a
                    href={authMenuItems[0].href}
                    className='hover:bg-hover-gray cursor-pointer rounded-lg px-3 py-1.5 font-medium'
                  >
                    <p>{authMenuItems[0].label}</p>
                  </a>
                ) : (
                  <>
                    <a
                      href='/mypage'
                      className='hover:bg-hover-gray cursor-pointer rounded-lg p-2'
                      title={t('common.mypage')}
                    >
                      <UserCircleIcon className='text-main-text-navy h-6 w-6' />
                    </a>
                    <a
                      className='hover:bg-hover-gray cursor-pointer rounded-lg px-3 py-1.5 font-medium'
                      onClick={handleLogout}
                    >
                      <p>{logoutMenuItem.label}</p>
                    </a>
                  </>
                )}

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
            </>
          )}

          {/* 검색 헤더 레이아웃 */}
          {variant === 'search' && (
            <>
              {/* 데스크톱 + 태블릿: 검색바 */}
              <div className='tablet-bp:flex hidden flex-grow px-10'>
                <SearchBar
                  height='h-12'
                  placeholder={t('places.search_region_placeholder')}
                />
              </div>
              <div className='desktop-bp:flex hidden items-center'>
                <MainMenu />
              </div>

              {/* 데스크톱: 우측 메뉴 (햄버거 없음) */}
              <div className='desktop-bp:flex desktop-bp:flex-1 desktop-bp:justify-end hidden'>
                <ul className='flex items-center font-medium'>
                  {!isLogin ? (
                    authMenuItems.map((item) => (
                      <li
                        key={item.label}
                        className='hover:bg-hover-gray cursor-pointer rounded-lg px-3 py-1.5'
                      >
                        <a href={item.href}>
                          <p>{item.label}</p>
                        </a>
                      </li>
                    ))
                  ) : (
                    <>
                      <li className='hover:bg-hover-gray cursor-pointer rounded-lg px-3 py-1.5'>
                        <a href='/mypage' className='flex items-center gap-x-1'>
                          <UserCircleIcon className='text-main-text-navy h-6 w-6 stroke-2' />
                          {/* <p>{t('common.mypage')}</p> */}
                        </a>
                      </li>
                      <li
                        key={logoutMenuItem.label}
                        className='hover:bg-hover-gray cursor-pointer rounded-lg px-3 py-1.5'
                      >
                        <p onClick={handleLogout}>{logoutMenuItem.label}</p>
                      </li>
                    </>
                  )}

                  <li className='relative' ref={langDropdownRef}>
                    <button
                      onClick={actions.toggleLangDropdown}
                      className='hover:bg-hover-gray flex cursor-pointer items-center gap-x-1 rounded-lg px-3 py-1.5'
                    >
                      <GlobeAltIcon className='h-5 w-5 stroke-2' />
                      <p>{getCurrentLanguageLabel()}</p>
                    </button>
                    <Dropdown
                      isOpen={stack.isLangDropdownOpen}
                      items={languages}
                      onClose={actions.closeLangDropdown}
                    />
                  </li>
                </ul>
              </div>

              {/* 태블릿: 우측 메뉴 (로그인 + 햄버거만) */}
              <div className='tablet-bp:flex desktop-bp:hidden hidden items-center gap-x-2'>
                {!isLogin ? (
                  <a
                    href={authMenuItems[0].href}
                    className='hover:bg-hover-gray cursor-pointer rounded-lg px-3 py-1.5 font-medium'
                  >
                    <p>{authMenuItems[0].label}</p>
                  </a>
                ) : (
                  <a
                    href='/mypage'
                    className='hover:bg-hover-gray cursor-pointer rounded-lg p-2'
                    title={t('common.mypage')}
                  >
                    <UserCircleIcon className='text-main-text-navy h-6 w-6' />
                  </a>
                )}

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
            </>
          )}

          {/* 모바일 우측 메뉴 (공통) */}
          <div className='tablet-bp:hidden flex items-center gap-x-2'>
            {!isLogin ? (
              <a
                href='/login'
                className='hover:bg-hover-gray cursor-pointer rounded-lg px-3 py-1.5 font-semibold'
              >
                <p>{t('auth.login')}</p>
              </a>
            ) : (
              <>
                <a
                  href='/mypage'
                  className='hover:bg-hover-gray cursor-pointer rounded-lg p-2'
                  title={t('common.mypage')}
                >
                  <UserCircleIcon className='text-main-text-navy h-6 w-6' />
                </a>
                <a className='hover:bg-hover-gray cursor-pointer rounded-lg px-3 py-1.5 font-semibold'>
                  <p onClick={handleLogout}>{t('auth.logout')}</p>
                </a>
              </>
            )}

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
      </div>

      {/* 모바일 스크롤 시 나타나는 검색바 - search variant일 때만 */}
      {variant === 'search' && isScrolled && (
        <div className='tablet-bp:hidden bg-bg-white border-t-outline-gray border-t px-4 py-2'>
          <SearchBar
            height='h-12'
            placeholder={t('places.search_region_placeholder')}
          />
        </div>
      )}

      {/* 모바일 사이드 메뉴 (공통) */}
      <SideMenu
        isOpen={stack.isMenuOpen}
        onClose={actions.closeMenu}
        mainMenuItems={sideMenuItems}
        authMenuItems={sideAuthMenuItems}
        languages={languages}
        title={t('common.menu')}
      />

      <CreateTripModal
        isOpen={modalStack.isCreateTripOpen}
        onClose={modalActions.closeCreateTrip}
        onSubmit={handleCreatePlanSubmit}
      />

      <LoginPromptModal
        isOpen={modalStack.isLoginPromptOpen}
        onClose={modalActions.closeLoginPrompt}
      />
    </div>
  );
};

export default Header;
