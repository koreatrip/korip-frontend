import { XMarkIcon } from '@heroicons/react/24/solid';

interface Tdata {
  id: string;
  label: string;
}

interface SelectedInterestsProps {
  data: Tdata[];
  onDelete: (id: string) => void;
}

const SelectedInterests = ({ data, onDelete }: SelectedInterestsProps) => {
  return (
    <div className='flex flex-wrap gap-2 py-4 min-h-[4.5rem]'>
      {data.length > 0 ? (
        data.map((interest) => (
          <div
            key={interest.id}
            className='flex items-center gap-x-1.5 bg-main-pink rounded-full pl-3 pr-2 py-1 text-sm text-white animate-in fade-in-50'
          >
            <span># {interest.label}</span>
            <button
              type='button'
              onClick={() => onDelete(interest.id)}
              className='flex items-center justify-center w-4 h-4 rounded-full bg-white/20 hover:bg-white/40 transition-colors'
              aria-label={`Delete ${interest.label}`}
            >
              <XMarkIcon className='w-3 h-3 text-white' />
            </button>
          </div>
        ))
      ) : (
        <p className='text-gray-500 self-center'>선택된 관심사가 없습니다.</p>
      )}
    </div>
  );
};

export default SelectedInterests;