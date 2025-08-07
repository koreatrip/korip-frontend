import React from 'react';
import MobileSlideMenu from './MobileSlideMenu';
import MyPageMenu from './MyPageMenu';

const MyPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='mx-auto w-full max-w-[1440px] px-4 md:px-6'>
      {/* 모바일 슬라이드 메뉴 */}
      <div className='block overflow-x-visible md:hidden'>
        <MobileSlideMenu />
      </div>

      {/* PC용 레이아웃 - 40px gap */}
      <div className='hidden py-6 md:flex'>
        {/* 왼쪽 메뉴 */}
        <aside style={{ width: '20%' }}>
          <MyPageMenu />
        </aside>

        {/* 오른쪽 콘텐츠 */}
        <section
          className='relative flex flex-col gap-3 overflow-visible'
          style={{ width: '80%', marginLeft: '40px' }}
        >
          {children}
        </section>
      </div>

      {/* 모바일 콘텐츠 */}
      <div className='block pt-4 md:hidden'>{children}</div>
    </div>
  );
};

export default MyPageLayout;
