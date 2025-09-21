import Button from '@/components/common/Button';
import { useToast } from '@/hooks/useToast';

import { twMerge } from 'tailwind-merge';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_PUBLIC_GOOGLE_CLIENT_ID;
const GOOGLE_REDIRECT_URI = 'http://localhost:5173/callback'; // 콜백 페이지로 변경

// 배포용 주소
// const GOOGLE_REDIRECT_URI = 'https://korip.me/callback';

type SocialButton = {
  id: string;
  content: React.ReactNode;
  onClick: () => void;
  className?: string;
};

type SocialLoginButtonsProps = {
  className?: string;
};

const SocialLoginButtons = ({ className }: SocialLoginButtonsProps) => {
  const { showToast } = useToast();

  const redirectToGoogleAuth = () => {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}&response_type=code&scope=email profile openid`;
    window.location.href = googleAuthUrl;
  };

  const handleSnsLogin = (id: string) => {
    if (id === 'google') {
      redirectToGoogleAuth();
    } else {
      showToast('곧 만나볼 기능입니다.', 'error');
    }
  };
  const socialButtons: SocialButton[] = [
    {
      id: 'google',
      content: 'Google',
      onClick: () => handleSnsLogin('google'),
    },
    {
      id: 'apple',
      content: 'Apple',
      onClick: () => handleSnsLogin('apple'),
    },
  ];

  return (
    <div className={twMerge('flex justify-center gap-2', className)}>
      {socialButtons.map((button) => (
        <Button
          key={button.id}
          variant='cancel'
          onClick={button.onClick}
          className={twMerge('flex-1 py-3.5', button.className)}
        >
          {button.content}
        </Button>
      ))}
    </div>
  );
};

export default SocialLoginButtons;
