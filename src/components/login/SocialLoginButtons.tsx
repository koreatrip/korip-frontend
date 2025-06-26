import Button from '@/components/common/Button';

const SocialLoginButtons = () => {
  const socialButtons = [
    {
      id: 'google',
      content: 'Google',
      onClick: () => console.log('Google 로그인'),
    },
    {
      id: 'apple',
      content: 'Apple',
      onClick: () => console.log('Apple 로그인'),
    },
  ];

  return (
    <div className='flex justify-center gap-2'>
      {socialButtons.map((button) => (
        <Button key={button.id} variant='cancel' onClick={button.onClick}>
          {button.content}
        </Button>
      ))}
    </div>
  );
};

export default SocialLoginButtons;
