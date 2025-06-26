import Logo from '@/assets/header/logo_sm.svg';

type WelcomeCardProps = {
  accountQuestionText: string;
  linkText: string;
  linkHref: string;
};

const WelcomeCard = ({
  accountQuestionText,
  linkText,
  linkHref,
}: WelcomeCardProps) => {
  return (
    <div className='flex flex-col items-center justify-center p-8 text-center'>
      <img
        src={Logo}
        alt='Small Logo'
        width='117'
        height='30'
        className='mb-8'
      />
      <h1 className='text-3xl font-bold text-gray-800'>Welcome to Korip.</h1>
      <p className='text-md text-gray-600'>
        {' '}
        {accountQuestionText}{' '}
        <a
          href={linkHref}
          className='text-gray-800 underline hover:text-gray-900'
        >
          {linkText}
        </a>
      </p>
    </div>
  );
};

export default WelcomeCard;
