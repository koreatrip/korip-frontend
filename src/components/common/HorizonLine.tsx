import { twMerge } from 'tailwind-merge';

type HorizonLineProps = {
  text?: string;
  className?: string;
};

const HorizonLine = ({ text, className }: HorizonLineProps) => {
  return (
    <div
      className={twMerge(
        'my-8 flex w-full items-center justify-center',
        className
      )}
    >
      <hr className='flex-grow border-t border-gray-300' />
      {text && (
        <span className='z-10 mx-4 bg-white px-4 text-gray-500'>{text}</span>
      )}
      <hr className='flex-grow border-t border-gray-300' />
    </div>
  );
};

export default HorizonLine;
