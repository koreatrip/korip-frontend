import SortDropdown from '@/components/common/dropdown/SortDropdown';
import SearchBar from '@/components/common/searchBar/SearchBar';
import PlannerAddButton from '@/components/domain/planner/PlannerAddButton';
import PlannerAddButtonMini from '@/components/domain/planner/PlannerAddButtonMini';
import PlannerCard from '@/components/domain/planner/PlannerCard';
import { SortOption, type DropdownItem } from '@/types/dropdown';
import React, { useMemo, useState } from 'react';

// 플래너 데이터 타입
interface PlannerData {
  id: number;
  title: string;
  description: string;
  dateRange: string;
  isNew?: boolean;
  createdAt: string;
}

const MyPlannerPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>(
    SortOption.DATE_DESC
  );

  // 플래너 더미 데이터 (createdAt 추가)
  const [planners, setPlanners] = useState<PlannerData[]>([
    {
      id: 1,
      title: '길동이와 동에번쩍 서에번쩍',
      isNew: true,
      description: '친구들과 떠나는 국내여행',
      dateRange: '25.05.13 ~ 25.06.01',
      createdAt: '2025-05-10',
    },
    {
      id: 2,
      title: '가족과 함께한 제주도 여행',
      description: '힐링 가득한 자연 속으로',
      dateRange: '25.03.01 ~ 25.03.05',
      createdAt: '2025-02-20',
    },
    {
      id: 3,
      title: '서울 미식 투어',
      description: '맛집만 골라가는 하루 코스',
      dateRange: '25.04.10 ~ 25.04.11',
      createdAt: '2025-04-05',
    },
    {
      id: 4,
      title: '부산에서의 낭만',
      description: '해운대, 광안리, 감천문화마을',
      dateRange: '25.02.18 ~ 25.02.22',
      createdAt: '2025-02-15',
    },
    {
      id: 5,
      title: '동해 드라이브 여행',
      description: '차박과 함께하는 자유로운 여행',
      dateRange: '25.01.03 ~ 25.01.07',
      createdAt: '2025-01-01',
    },
    {
      id: 6,
      title: '길동이와 동에번쩍 서에번쩍',
      isNew: true,
      description: '친구들과 떠나는 국내여행',
      dateRange: '25.05.13 ~ 25.06.01',
      createdAt: '2025-05-10',
    },
    {
      id: 7,
      title: '길동이와 동에번쩍 서에번쩍',
      isNew: true,
      description: '친구들과 떠나는 국내여행',
      dateRange: '25.05.13 ~ 25.06.01',
      createdAt: '2025-05-10',
    },
    {
      id: 8,
      title: '길동이와 동에번쩍 서에번쩍',
      isNew: true,
      description: '친구들과 떠나는 국내여행',
      dateRange: '25.05.13 ~ 25.06.01',
      createdAt: '2025-05-10',
    },
  ]);

  // 정렬 옵션들 - Places 컴포넌트와 동일
  const sortOptions: DropdownItem[] = [
    {
      value: SortOption.DATE_DESC,
      label: '날짜 내림차순',
      onClick: () => setSortOption(SortOption.DATE_DESC),
    },
    {
      value: SortOption.DATE_ASC,
      label: '날짜 오름차순',
      onClick: () => setSortOption(SortOption.DATE_ASC),
    },
    {
      value: SortOption.NAME_ASC,
      label: '이름 오름차순',
      onClick: () => setSortOption(SortOption.NAME_ASC),
    },
    {
      value: SortOption.NAME_DESC,
      label: '이름 내림차순',
      onClick: () => setSortOption(SortOption.NAME_DESC),
    },
  ];

  // 검색 및 정렬 로직 - Places 컴포넌트와 동일한 구조
  const filteredAndSortedPlanners: PlannerData[] = useMemo(() => {
    let filtered = planners;

    // 검색 필터링
    if (searchValue.trim()) {
      const lower = searchValue.toLowerCase();
      filtered = filtered.filter((planner) =>
        [planner.title, planner.description, planner.dateRange]
          .filter(Boolean)
          .some((field) => field!.toLowerCase().includes(lower))
      );
    }

    // 정렬
    return filtered.sort((a, b) => {
      switch (sortOption) {
        case SortOption.DATE_DESC:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case SortOption.DATE_ASC:
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case SortOption.NAME_ASC:
          return a.title.localeCompare(b.title);
        case SortOption.NAME_DESC:
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
  }, [planners, searchValue, sortOption]);

  // 이벤트 핸들러들
  const handleSearch = (value: string): void => setSearchValue(value);

  const handleEdit = (title: string) => {
    console.log(`${title} 수정`);
  };

  const handleDelete = (title: string) => {
    console.log(`${title} 삭제`);
  };

  const handleAddPlanner = (newPlanner: PlannerData) => {
    setPlanners(prev => [newPlanner, ...prev]);
  };

  return (
    <div className='flex min-h-screen bg-white'>
      {/* 메인 컨텐츠 */}
      <div className='flex-1 px-2 py-6'>
        {/* 헤더 */}
        <div className='mb-6'>
          <h1 className='mb-4 text-2xl font-bold text-gray-900'>
            내 여행 일정
          </h1>

          {/* 검색바와 정렬 드롭다운 */}
          <div className='mb-6 flex flex-col gap-4 md:flex-row'>
            <div className='flex-1'>
              <SearchBar
                className='w-full max-w-none md:!max-w-[876px]'
                placeholder='플래너 제목이나 설명을 검색해보세요'
                onSearch={handleSearch}
              />
            </div>
            <div className='flex gap-2'>
              <SortDropdown options={sortOptions} current={sortOption} />
              <PlannerAddButtonMini onAddPlanner={handleAddPlanner} />
            </div>
          </div>

          {/* 검색 결과 표시 */}
          {searchValue && (
            <div className='mb-4 text-sm text-gray-600'>
              "{searchValue}"에 대한 검색 결과:{' '}
              {filteredAndSortedPlanners.length}개
            </div>
          )}
        </div>

        {/* 플래너 카드 그리드 - 23px gap */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredAndSortedPlanners.map((planner) => (
            <div
              key={planner.id}
              className='h-[372px] w-[348px] justify-self-start'
            >
              <PlannerCard
                title={planner.title}
                description={planner.description}
                dateRange={planner.dateRange}
                isNew={planner.isNew ?? false}
                onEdit={() => handleEdit(planner.title)}
                onDelete={() => handleDelete(planner.title)}
              />
            </div>
          ))}

          {/* 플래너 추가 버튼 */}
          <div className='h-[372px] w-[348px] justify-self-start'>
            <PlannerAddButton onAddPlanner={handleAddPlanner} />
          </div>
        </div>

        {/* 검색 결과가 없을 때 */}
        {filteredAndSortedPlanners.length === 0 && (
          <div className='py-16 text-center'>
            <div className='mb-4 text-gray-300'>
              <svg
                className='mx-auto h-16 w-16'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                />
              </svg>
            </div>
            {searchValue ? (
              <>
                <p className='text-gray-500'>검색한 플래너가 없습니다.</p>
                <p className='mt-2 text-sm text-gray-400'>
                  다른 키워드로 검색해보세요.
                </p>
              </>
            ) : (
              <>
                <p className='text-gray-500'>아직 생성된 플래너가 없습니다.</p>
                <p className='mt-2 text-sm text-gray-400'>
                  새로운 여행 계획을 세워보세요.
                </p>
              </>
            )}
          </div>
        )}

        {/* 총 개수 표시 */}
        <div className='mt-12 text-right text-sm text-gray-400'>
          총 {filteredAndSortedPlanners.length}개의 플래너
        </div>
      </div>
    </div>
  );
};

export default MyPlannerPage;
