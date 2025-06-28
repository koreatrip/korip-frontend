import React from 'react';

/**
 * 1440px 크기 정해주는 컨테이너
 * @param param0
 * @returns
 */
const Container = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`mx-auto w-full max-w-[1440px] px-4 ${className}`}>
      {children}
    </div>
  );
};

export default Container;
