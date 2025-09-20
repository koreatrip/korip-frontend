import type { Category } from '@/api/category/categoryType';
import { XMarkIcon } from '@heroicons/react/24/solid';
import type { Dispatch, SetStateAction } from 'react';

type SelectedBoxProps = {
  subSelected: any[];
  setSubSelected: Dispatch<SetStateAction<Category[]>>;
};

const SelectedBox = ({ subSelected, setSubSelected }: SelectedBoxProps) => {
  const handleRemoveSlected = (id: number) => {
    setSubSelected((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className='flex min-h-[4.5rem] flex-wrap gap-2 py-4'>
      {subSelected.length > 0 ? (
        subSelected.map((data) => (
          <div
            key={data.id}
            className='bg-main-pink animate-in fade-in-50 flex h-8 items-center gap-x-1.5 rounded-full py-1 pr-2 pl-3 text-sm text-white'
          >
            <span># {data.name}</span>
            <button
              type='button'
              onClick={() => handleRemoveSlected(data.id)}
              className='flex h-4 w-4 items-center justify-center rounded-full bg-white/20 transition-colors hover:bg-white/40'
            >
              <XMarkIcon className='h-3 w-3 text-white' />
            </button>
          </div>
        ))
      ) : (
        <p className='self-center text-gray-500'>선택된 관심사가 없습니다.</p>
      )}
    </div>
  );
};

export default SelectedBox;
