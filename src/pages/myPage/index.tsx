import MyPageLayout from '@/components/domain/myPage/MyPageLayout';
import { Outlet } from 'react-router-dom';

const MyPage = () => {
  return (
    <MyPageLayout>
      <Outlet />
    </MyPageLayout>
  );
};

export default MyPage;
