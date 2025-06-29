import React from 'react';
import MyPageMenu from './MyPageMenu';

const MyPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='mx-auto flex w-full max-w-6xl gap-8 p-6'>
      {/* 왼쪽 메뉴 */}
      <aside className='w-1/4'>
        <MyPageMenu />
      </aside>

      {/* 오른쪽 콘텐츠 */}
      <section className='w-3/4'>{children}</section>
    </div>
  );
};

export default MyPageLayout;
