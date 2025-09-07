import { useState } from 'react';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import IdolRequestModal from '@/components/domain/interest/IdolRequestModal';
const IdolCateBox = () => {
  const [idolInput, setIdolInput] = useState<string>('');
  const [isModalOpen, setModalOpen] = useState(false); // 아이돌 모달 온오프 여부
  const handleSerchIdol = (value: string) => {
    setIdolInput(value);
  };
  return (
    <>
      <div>
        <div className='border-main-pink bg-main-pink/2 my-6 rounded-3xl border p-6'>
          <p className='mb-4'>관심있는 K-POP 아이돌/그룹을 선택하세요</p>
          <Input
            type='text'
            placeholder='아이돌 그룹 검색 (예: BTS, BLACKPINK)'
            value={idolInput}
            onChange={(e) => handleSerchIdol(e.target.value)}
          />
          <p className='my-2 text-center'>원하는 아이돌이 없나요?</p>
          <Button
            variant='active'
            onClick={() => setModalOpen(true)}
            className='m-auto mt-4 w-fit rounded-full px-5'
          >
            아이돌 신청하기
          </Button>
        </div>
      </div>

      <IdolRequestModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default IdolCateBox;
