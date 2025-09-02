import Container from '@/components/common/Container';
import React from 'react';
import MobileSlideMenu from './MobileSlideMenu';
import MyPageMenu from './MyPageMenu';

const MyPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {/* 모바일 슬라이드 메뉴 */}
      <div className='block overflow-x-visible md:hidden'>
        <MobileSlideMenu />
      </div>
      <div className='bg-bg-section mx-auto min-h-screen w-full px-4 md:px-6'>
        <Container>
          {/* PC용 레이아웃 */}
          <div className='hidden py-6 md:flex md:gap-10'>
            {/* 왼쪽 메뉴 - 고정 너비 */}
            <aside className='flex-shrink-0'>
              <MyPageMenu />
            </aside>

            {/* 오른쪽 콘텐츠 - 나머지 공간 */}
            <section className='relative flex min-w-0 flex-1 flex-col gap-3 overflow-visible'>
              {children}
            </section>
          </div>
        </Container>
        {/* 모바일 콘텐츠 */}
        <div className='block pt-4 md:hidden'>{children}</div>
      </div>
    </>
  );
};

export default MyPageLayout;
