import React from 'react';
import { twMerge } from 'tailwind-merge';

type SelectButtonVariant = 'active' | 'cancel';

type SelectButtonProps = Omit<
  React.ComponentPropsWithoutRef<'button'>,
  'onClick' | 'disabled' | 'children'
> & {
  children: React.ReactNode;
  selected?: boolean;
  variant?: SelectButtonVariant;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
};

const SelectButton = React.forwardRef<HTMLButtonElement, SelectButtonProps>(
  (
    {
      children,
      className,
      selected = false,
      variant = 'active',
      disabled = false,
      onClick,
      ...rest
    },
    ref
  ) => {
    const baseStyles = `
      flex items-center justify-center
      rounded-full
      px-4 py-2.5 sm:px-4 sm:py-2.5 lg:px-4 lg:py-2.5
      transition-all duration-200
      cursor-pointer
    `;

    const variantStyles = {
      active: 'bg-main-pink text-bg-white hover:bg-main-hover-pink',
      cancel:
        'bg-bg-white text-gray-700 border border-outline-gray hover:bg-gray-100',
    };

    const selectedStyles = selected
      ? 'bg-main-pink text-bg-white'
      : 'bg-bg-white text-gray-700 border border-outline-gray hover:bg-gray-100';

    const disabledStyles = disabled
      ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
      : '';

    return (
      <button
        ref={ref}
        type='button'
        className={twMerge(
          baseStyles,
          selected !== undefined ? selectedStyles : variantStyles[variant],
          disabledStyles,
          className
        )}
        onClick={onClick}
        disabled={disabled}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

SelectButton.displayName = 'SelectButton';

export default SelectButton;
