import Button from '@/components/common/Button';
import React from 'react';
import { twMerge } from 'tailwind-merge';

// 각 소셜 로그인 버튼에 대한 타입을 정의합니다. (이전과 동일)
type SocialButton = {
  id: string;
  content: React.ReactNode;
  onClick: () => void;
  className?: string; // 개별 버튼에 대한 클래스
};

// SocialLoginButtons 컴포넌트의 Props 타입 정의를 간소화합니다.
// 이제 buttons prop은 외부에서 받지 않으므로 제거합니다.
type SocialLoginButtonsProps = {
  /**
   * 전체 버튼 그룹 컨테이너에 적용될 추가 Tailwind CSS 클래스입니다. (선택 사항)
   * twMerge를 통해 기본 스타일에 안전하게 병합됩니다.
   */
  className?: string; // 그룹 컨테이너에 대한 클래스
};

/**
 * SocialLoginButtons 컴포넌트는 미리 정의된 소셜 로그인 버튼들을 렌더링합니다.
 * 컴포넌트 외부에서 'buttons' prop을 통해 목록을 전달받는 대신,
 * 내부적으로 정의된 버튼 목록을 사용합니다.
 */
const SocialLoginButtons = ({ className }: SocialLoginButtonsProps) => {
  // buttons prop 제거

  // [수정] socialButtons 데이터는 이제 SocialButton[] 타입으로 정의합니다.
  // SocialLoginButtonsProps 타입이 아닙니다.
  const socialButtons: SocialButton[] = [
    {
      id: 'google',
      content: 'Google', // 실제 아이콘 컴포넌트를 여기에 넣을 수 있습니다. 예: <GoogleIcon />
      onClick: () => console.log('Google 로그인'),
    },
    {
      id: 'apple',
      content: 'Apple', // 실제 아이콘 컴포넌트를 여기에 넣을 수 있습니다. 예: <AppleIcon />
      onClick: () => console.log('Apple 로그인'),
    },
    // 추가 소셜 로그인 버튼을 여기에 정의할 수 있습니다.
    // {
    //   id: 'kakao',
    //   content: 'Kakao',
    //   onClick: () => console.log('Kakao 로그인'),
    // },
  ];

  return (
    <div
      className={twMerge(
        'flex justify-center gap-2', // 기본 스타일: flex 컨테이너, 중앙 정렬, 간격
        className // 외부에서 전달받은 className을 병합
      )}
    >
      {socialButtons.map((button) => (
        <Button
          key={button.id} // 리스트 렌더링 시 고유 key 사용
          variant='cancel' // 'cancel' variant (테두리 있는 버튼)
          onClick={button.onClick}
          // [수정] 개별 Button 컴포넌트에 대한 클래스는 button.className에서 가져옵니다.
          className={twMerge(
            'flex-1 py-3.5', // 각 버튼이 동일한 너비로 확장되도록 flex-1 적용, 기본 패딩
            button.className // <-- 여기에 button.className 사용 (socialButtons.className은 틀림)
          )}
        >
          {button.content}
        </Button>
      ))}
    </div>
  );
};

export default SocialLoginButtons;
