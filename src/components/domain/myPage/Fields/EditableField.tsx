import React from 'react';

type EditableFieldProps = {
  label: string;
  value: string;
  isEditing: boolean;
  type?: 'text' | 'email' | 'tel';
  placeholder?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

const EditableField: React.FC<EditableFieldProps> = ({
  label,
  value,
  isEditing,
  type = 'text',
  placeholder,
  onChange,
}) => {
  if (isEditing) {
    return (
      <div className='focus-within:border-main-pink focus-within:ring-main-pink bg-bg-white border-outline-gray flex h-10 items-center rounded-lg border px-4 focus-within:ring-1'>
        <div className='flex w-full items-center justify-between'>
          <span className='text-main-text-navy w-auto font-medium'>
            {label}
          </span>
          <div className='ml-4 flex-1'>
            <input
              type={type}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className='w-full border-none bg-transparent text-right text-gray-800 outline-none'
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='flex h-10 items-center justify-between'>
        <span className='text-main-text-navy w-auto font-medium'>{label}</span>
        <span className='text-gray-400'>{value}</span>
      </div>
      <hr className='border-outline-gray -mt-4 border-t' />
    </>
  );
};

export default EditableField;
