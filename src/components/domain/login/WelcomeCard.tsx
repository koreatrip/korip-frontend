import Logo from '@/assets/header/logo_sm.svg';

type WelcomeCardProps = {
  mainText: string;
  accountQuestionText: string | React.ReactNode;
  linkText: string;
  linkHref: string;
};

const WelcomeCard = ({
  mainText,
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
      <h1 className='p-2 text-2xl font-bold text-gray-800 md:text-3xl'>
        {mainText}
      </h1>
      <p className='md:text-md text-sm text-gray-600'>
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
