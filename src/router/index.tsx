import { createBrowserRouter } from 'react-router-dom';
import AuthInput from '@/components/auth/AuthInput';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import ToastMessage from '@/components/common/ToastMessage';
import defaultLayout from '@/layouts/defaultLayout';
import Header from '@/components/header/Header';
import SearchHeader from '@/components/header/SearchHeader';

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
    </>
  );
};

export const router = createBrowserRouter([
  {
    path: '/', // path 추가
    Component: defaultLayout, // 띄어쓰기 수정
    children: [
      {
        index: true, // 또는 path: ''
        element: <TestPage />,
      },
    ],
  },
]);
