import Logo from '@/assets/header/logo_sm.svg';

type WelcomeCardProps = {
  mainText: string;
  accountQuestionText: string;
  linkText?: string;
  linkHref?: string;
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
      <h1 className='text-main-text-navy p-2 text-2xl font-bold md:text-3xl'>
        {mainText}
      </h1>
      <p className='md:text-md text-sub-text-gray text-sm'>
        {' '}
        {accountQuestionText}{' '}
        {linkText && linkHref && (
          <a
            href={linkHref}
            className='text-sub-text-gray hover:text-main-text-navy underline'
          >
            {linkText}
          </a>
        )}
      </p>
    </div>
  );
};

export default WelcomeCard;
