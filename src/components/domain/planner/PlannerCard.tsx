import type { TPlannerCardProps } from '@/types/plannerType';

const PlannerCard = ({
  title,
  description,
  dateRange,
  isNew,
  onEdit,
  onDelete,
}: TPlannerCardProps) => {
  return (
    <div className='relative flex h-[372px] w-full flex-col rounded-2xl bg-white p-4 shadow-md'>
      {isNew && (
        <span className='absolute top-4 left-4 rounded bg-red-500 px-2 py-1 text-xs text-white'>
          NEW
        </span>
      )}
      <h2 className='mt-6 text-lg font-bold text-gray-800'>{title}</h2>
      <p className='mt-2 text-sm text-gray-500'>{description}</p>
      <span className='mt-2 text-xs text-gray-400'>{dateRange}</span>

      <div className='mt-auto flex justify-end gap-2'>
        <button
          onClick={onEdit}
          className='rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-100'
        >
          수정
        </button>
        <button
          onClick={onDelete}
          className='rounded-md border border-red-300 px-3 py-1 text-sm text-red-600 hover:bg-red-100'
        >
          삭제
        </button>
      </div>
    </div>
  );
};

export default PlannerCard;
