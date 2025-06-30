import MyPageLayout from '@/components/domain/myPage/MyPageLayout';
import React from 'react';
import { Outlet } from 'react-router-dom';

const MyPage: React.FC = () => {
  return (
    <MyPageLayout>
      <Outlet />
    </MyPageLayout>
  );
};

export default MyPage;
