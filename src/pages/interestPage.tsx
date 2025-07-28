import React, { useState } from 'react';
import Button from '@/components/common/Button';
import Container from '@/components/common/Container';
import Input from '@/components/common/Input';
import SelectButtonGroup from '@/components/domain/interest/selectButton/SelectButtonGroup';
import WelcomeCard from '@/components/domain/login/WelcomeCard';
import SelectedInterests from '@/components/domain/interest/selectButton/SelectedInterests';
import IdolRequestModal from '@/components/domain/interest/IdolRequestModal';
import SelectDetailBox from '@/components/domain/interest/selectButton/SelectDetailBox';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useInterestContext } from '@/context/InterestContext';

const interestsData = [
  { id: 'kpop', label: 'K-POP', detail: ['아이돌'] },
  { id: 'drama', label: '드라마', detail: ['눈물의 여왕', '선재 업고 튀어', '경성크리처'] },
  { id: 'food', label: '맛집', detail: ['떡볶이', '치킨', '마라탕', '곱창'] },
  { id: 'sports', label: '운동', detail: ['축구', '야구', '농구'] },
  { id: 'music', label: '음악', detail: ['클래식', '재즈', '밴드'] },
  { id: 'art', label: '미술', detail: [] },
  { id: 'tech', label: 'IT', detail: [] },
  { id: 'book', label: '도서', detail: [] },
  { id: 'movie', label: '영화', detail: [] },
  { id: 'fashion', label: '패션', detail: [] },
  { id: 'game', label: '게임', detail: [] },
];

const idolData = ["아이유", "지민", "뷔", "지수", "현아", "정국", "태연", "수지", "강다니엘"];

const InterestPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMajorInterests, setSelectedMajorInterests] = useState<string[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);

  // Context에서 세부 관심사 상태와 setter 함수를 가져옵니다.
  const { selectedDetailInterests, setSelectedDetailInterests } = useInterestContext();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleMajorSelectionChange = (newSelectedIds: string[]) => {
    setSelectedMajorInterests(newSelectedIds);
  };

  const availableDetails = selectedMajorInterests.flatMap(
    (id) => interestsData.find((interest) => interest.id === id)?.detail || []
  );

  const handleDeleteInterest = (idToDelete: string) => {
    setSelectedDetailInterests((prev) => prev.filter((id) => id !== idToDelete));
  };

  const finalSelectedInterestsForDisplay = selectedDetailInterests.map((label) => ({
    id: label,
    label,
  }));

  return (
    <Container>
      <div className='m-auto max-w-[540px] flex-col items-center justify-center p-8'>
        <WelcomeCard
          mainText='관심사를 선택하세요'
          accountQuestionText='Korip에서 추천하는 관심사예요.'
        />
        <div className='flex min-w-full gap-2 pb-3'>
          <div className='relative w-full'>
            <Input
              type='text'
              placeholder='찾기'
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button
              type='button'
              className='absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-colors duration-200 hover:text-gray-600'
            >
              <MagnifyingGlassIcon className='h-6 w-6' />
            </button>
          </div>
          <Button variant='active' className='w-2/6'>
            Search
          </Button>
        </div>

        <SelectButtonGroup
          options={interestsData}
          initialSelectedIds={selectedMajorInterests}
          onSelectionChange={handleMajorSelectionChange}
          singleSelect={true}
          className='py-2'
        />

        {availableDetails.length > 0 && (
          <div className='flex flex-col gap-4 mt-4'>
            <SelectDetailBox
              details={availableDetails}
              selectedDetails={selectedDetailInterests}
              setSelectedDetailInterests={setSelectedDetailInterests}
            />


            {/* K-POP이 선택되었을 때만 아이돌 신청 버튼을 보여줍니다. */}
            {selectedMajorInterests.includes('kpop') && (
              <div className='mt-2 p-4 border rounded-3xl border-main-pink  bg-bg-section'>
                <p>관심있는 K-POP 아이돌/그룹을 선택하세요</p>
                <Input
                  type='text'
          
                  placeholder='아이돌 이름 검색'/>

                <p>원하는게 없쟈며</p>
                <Button
                  variant='active'
                  onClick={() => setModalOpen(true)}
                  className='w-fit px-5 m-auto  mt-4 rounded-full'
                >
                  아이돌 신청하기
                </Button>
              </div>
            )}
          </div>
        )}

        <h3 className='text-lg font-semibold mt-6 mb-2'>최종 선택된 관심사</h3>
        <SelectedInterests
          data={finalSelectedInterestsForDisplay}
          onDelete={handleDeleteInterest}
        />

        <div className='mt-8'>
          <Button className='w-full'>완료</Button>
        </div>
      </div>

      <IdolRequestModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </Container>
  );
};

export default InterestPage;
