import Button from '@/components/common/Button';
import Container from '@/components/common/Container';
import Input from '@/components/common/Input';
import SelectButtonGroup from '@/components/domain/interest/selectButton/SelectButtonGroup';
import WelcomeCard from '@/components/domain/login/WelcomeCard';
import { useInterestContext } from '@/context/InterestContext';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import SelectedInterests from '@/components/domain/interest/SelectedInterests';

const InterestPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { selectedInterests, setSelectedInterests } = useInterestContext();

  const interests = [
    { id: 'travel', label: '여행' },
    { id: 'food', label: '맛집' },
    { id: 'sports', label: '운동' },
    { id: 'music', label: '음악' },
    { id: 'art', label: '미술' },
    { id: 'tech', label: 'IT' },
    { id: 'book', label: '도서' },
    { id: 'movie', label: '영화' },
    { id: 'fashion', label: '패션' },
    { id: 'game', label: '게임' },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleInterestsSelectionChange = (newSelectedIds: string[]) => {
    setSelectedInterests(newSelectedIds);
    console.log('선택된 관심사 ID:', newSelectedIds);
  };

  return (
    <Container>
      <div className='m-auto max-w-[540px] flex-col items-center justify-center p-8'>
        <WelcomeCard
          mainText='관심사를 선택하세요'
          accountQuestionText='Korip에서 추천하는 관심사예요.'
        />
        {/* 서치바 */}
        <div className='flex min-w-full gap-2 pb-3'>
          {/* 인풋안에 서치아이콘 */}
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
            search
          </Button>
        </div>

        {/* 해시태그 필터링 */}
        <SelectButtonGroup
          options={interests}
          initialSelectedIds={selectedInterests}
          onSelectionChange={handleInterestsSelectionChange}
          singleSelect={false}
          className='py-2'
        />
        {/* 선택한 관심사 */}
        <SelectedInterests interests={interests} />
        <Button>완료</Button>
      </div>
    </Container>
  );
};

export default InterestPage;
