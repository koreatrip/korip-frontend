import { twMerge } from 'tailwind-merge';

type ButtonVariant = 'active' | 'cancel';

type ButtonProps = Omit<React.ComponentPropsWithoutRef<'button'>, 'variant'> & {
  variant?: ButtonVariant;
};
const Button = (props: ButtonProps) => {
  const {
    children,
    className,
    variant = props.disabled ? 'cancel' : 'active',
    ...rest
  } = props;

  const variantStyles = {
    active: 'bg-main-pink text-bg-white hover:bg-main-hover-pink',
    cancel:
      'bg-bg-white flex items-center rounded-lg  border border-outline-gray px-4 py-3 transition-all duration-200',
  };

  return (
    <>
      <button
        className={twMerge(
          `text-main-text-navy shadow-light flex w-full cursor-pointer items-center justify-center rounded-lg py-3.5 transition-colors`,
          variantStyles[variant],
          className
        )}
        {...rest}
      >
        {children}
      </button>
    </>
  );
};
export default Button;
