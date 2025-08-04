import React, { useState } from 'react';

interface PlannerCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (planner: {
    title: string;
    description: string;
    dateRange: string;
  }) => void;
}

const PlannerCreateModal: React.FC<PlannerCreateModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateRange, setDateRange] = useState('');

  const handleSave = () => {
    if (!title || !dateRange) {
      alert('제목과 날짜를 입력해주세요.');
      return;
    }
    onSave({ title, description, dateRange });
    setTitle('');
    setDescription('');
    setDateRange('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black'>
      <div className='w-full max-w-md rounded-xl bg-white p-6 shadow-lg'>
        <h2 className='mb-4 text-xl font-bold'>새 여행 일정 추가</h2>
        <input
          type='text'
          placeholder='제목'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='mb-3 w-full rounded border p-2'
        />
        <input
          type='text'
          placeholder='날짜 (예: 25.06.01 ~ 25.06.05)'
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className='mb-3 w-full rounded border p-2'
        />
        <textarea
          placeholder='설명'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className='mb-4 h-24 w-full resize-none rounded border p-2'
        />
        <div className='flex justify-end gap-2'>
          <button
            onClick={onClose}
            className='rounded bg-gray-200 px-4 py-2 hover:bg-gray-300'
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className='rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlannerCreateModal;
