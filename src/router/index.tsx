import Button from '@/components/common/Button';
import Header from '@/components/common/Header';
import Input from '@/components/common/Input';
import SearchBar from '@/components/common/searchBar/SearchBar';
import ToastMessage from '@/components/common/ToastMessage';
import AuthInput from '@/components/domain/auth/AuthInput';
import ProfileCard from '@/components/MyPage/ProfileCard';
import defaultLayout from '@/layouts/defaultLayout';

import MyPage from '@/pages/myPage';
import FavoritePlacesPage from '@/pages/myPage/places';
import TravelPlanPage from '@/pages/myPage/plan';
import FavoriteRegionsPage from '@/pages/myPage/regions';

import DistrictListPage from '@/pages/districtListPage';
import ExamplePage from '@/pages/examplePage';
import InterestPage from '@/pages/interestPage';
import PlannerPage from '@/pages/plannerPage';
import RegionsPage from '@/pages/regionsPage';
import SignUpPage from '@/pages/signUpPage';
import TravelTipsPage from '@/pages/travelTipsPage';

import { createBrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/loginPage';

// 컴포넌트 테스트용 페이지
const TestPage = () => {
  return (
    <>
      <AuthInput
        type='text'
        label='인증번호'
        placeholder='인증번호를 입력하세요'
      />
      <Button variant='cancel'>취소</Button>
      <Button>로그인</Button>
      <Button className='bg-sub-green rounded-full'>선택완료</Button>
      <Input />
      <ToastMessage message='테스트' />
      <Header />
      <Header variant='search' />
      <SearchBar placeholder='왈랄랄라' />
      <SearchBar height='h-12' />
      <ExamplePage />
    </>
  );
};

export const router = createBrowserRouter([
  {
    path: '/',
    Component: defaultLayout,
    children: [
      {
        index: true,
        element: <TestPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <SignUpPage />,
      },
      {
        path: 'explore/regions',
        element: <RegionsPage />,
      },
      {
        path: 'explore/districts',
        element: <DistrictListPage />,
      },
      {
        path: 'planner',
        element: <PlannerPage />,
      },
      {
        path: 'tips',
        element: <TravelTipsPage />,
      },
      {
        path: 'mypage',
        element: <MyPage />,
        children: [
          {
            index: true,
            element: (
              <ProfileCard
                onSave={(data) => {
                  console.log('프로필 저장:', data);
                  // 나중에 API 호출 로직 추가
                }}
                onCancel={() => {
                  console.log('프로필 수정 취소');
                }}
              />
            ),
          },
          { path: 'plan', element: <TravelPlanPage /> },
          { path: 'places', element: <FavoritePlacesPage /> },
          { path: 'regions', element: <FavoriteRegionsPage /> },
        ],
      },
      {
        path: 'interest',
        element: <InterestPage />,
      },
    ],
  },
]);
