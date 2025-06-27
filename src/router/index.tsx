import { createBrowserRouter } from 'react-router-dom';
import AuthInput from '@/components/auth/AuthInput';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import ToastMessage from '@/components/common/ToastMessage';
import defaultLayout from '@/layouts/defaultLayout';
import Header from '@/components/header/Header';
import SearchHeader from '@/components/header/SearchHeader';
import SearchBar from '@/components/searchBar/SearchBar';
import SearchLayout from '@/layouts/searchLayout';
import RegionsPage from '@/pages/regionsPage';

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
      <SearchHeader />
      <SearchBar placeholder='왈랄랄라' />
      <SearchBar height='h-12' />
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
    ],
  },
  {
    path: '/regions',
    Component: SearchLayout,
    children: [
      {
        path: '/regions/explore',
        element: <RegionsPage />,
      },
    ],
  },
]);
