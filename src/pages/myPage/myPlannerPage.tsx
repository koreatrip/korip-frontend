import type { TravelPlan } from '@/api/user/userType';
import SortDropdown from '@/components/common/dropdown/SortDropdown';
import SearchBar from '@/components/common/searchBar/SearchBar';
import PlannerAddButton from '@/components/domain/planner/PlannerAddButton';
import PlannerAddButtonMini from '@/components/domain/planner/PlannerAddButtonMini';
import PlannerCard from '@/components/domain/planner/PlannerCard';
import { SortOption, type DropdownItem } from '@/types/dropdown';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

// 플래너 데이터 타입
type TPlannerData = {
  id: number;
  title: string;
  description: string;
  dateRange: string;
  isNew?: boolean;
  createdAt: string;
};

const MyPlannerPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>(
    SortOption.DATE_DESC
  );

  // API에서 사용자 정보와 여행 일정 조회 - 임시로 비활성화
  // const { data: userProfileData } = useUserProfile();
  // const userId = userProfileData?.data?.id;
  // const { data: travelPlansData, isLoading, error } = useTravelPlans(userId || 0);

  // 임시 목 데이터
  const mockTravelPlansData = {
    data: [
      {
        id: 1,
        title: '제주도 여행',
        description: '가족과 함께하는 제주도 3박 4일 여행',
        dateRange: '2024-03-15 ~ 2024-03-18',
        startDate: '2024-03-15',
        endDate: '2024-03-18',
        isNew: true,
        createdAt: '2024-02-20',
        updatedAt: '2024-02-20',
      },
      {
        id: 2,
        title: '부산 여행',
        description: '친구들과 함께하는 부산 2박 3일 여행',
        dateRange: '2024-04-10 ~ 2024-04-12',
        startDate: '2024-04-10',
        endDate: '2024-04-12',
        isNew: false,
        createdAt: '2024-02-15',
        updatedAt: '2024-02-15',
      },
    ],
  };

  const travelPlansData = mockTravelPlansData;
  const isLoading = false;
  const error = null;

  // API 데이터를 로컬 형식으로 변환
  const planners: TPlannerData[] = useMemo(() => {
    if (!travelPlansData?.data) return [];

    return travelPlansData.data.map((plan: TravelPlan) => ({
      id: plan.id,
      title: plan.title,
      description: plan.description,
      dateRange: plan.dateRange,
      isNew: plan.isNew,
      createdAt: plan.createdAt,
    }));
  }, [travelPlansData]);

  // 정렬 옵션들 - Places 컴포넌트와 동일
  const sortOptions: DropdownItem[] = [
    {
      value: SortOption.DATE_DESC,
      label: t('common.date_descending'),
      onClick: () => setSortOption(SortOption.DATE_DESC),
    },
    {
      value: SortOption.DATE_ASC,
      label: t('common.date_ascending'),
      onClick: () => setSortOption(SortOption.DATE_ASC),
    },
    {
      value: SortOption.NAME_ASC,
      label: t('common.name_ascending'),
      onClick: () => setSortOption(SortOption.NAME_ASC),
    },
    {
      value: SortOption.NAME_DESC,
      label: t('common.name_descending'),
      onClick: () => setSortOption(SortOption.NAME_DESC),
    },
  ];

  // 검색 및 정렬 로직 - Places 컴포넌트와 동일한 구조
  const filteredAndSortedPlanners: TPlannerData[] = useMemo(() => {
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
  // 검색 이벤트 핸들러
  const handleSearchSubmit = (value: string): void => setSearchValue(value);

  // 편집 버튼 클릭 이벤트 핸들러
  const handleEditClick = (title: string) => {
    console.log(`${title} 수정`);
  };

  // 삭제 버튼 클릭 이벤트 핸들러
  const handleDeleteClick = (title: string) => {
    console.log(`${title} 삭제`);
  };

  // 플래너 추가 이벤트 핸들러 (API 연동 필요)
  const handleAddPlannerSubmit = (newPlanner: TPlannerData) => {
    setPlanners((prev) => [newPlanner, ...prev]);
  };

  // 플래너 카드 클릭 이벤트 핸들러
  const handlePlannerCardClick = (plannerId: number) => {
    navigate(`/trip/${plannerId}`);
  };

  return (
    <div className='flex min-h-screen'>
      {/* 메인 컨텐츠 */}
      <div className='flex-1 px-2 py-6'>
        {/* 헤더 */}
        <div className='mb-6'>
          <h1 className='text-main-text-navy mb-4 text-4xl font-semibold'>
            {t('travel.travel_schedule')}
          </h1>

          {/* 검색바와 정렬 드롭다운 */}
          <div className='mb-6 flex flex-col gap-4 md:flex-row'>
            <div className='flex-1'>
              <SearchBar
                className='w-full max-w-none md:!max-w-[876px]'
                placeholder={t('common.search_planner_title_or_description')}
                onSearch={handleSearchSubmit}
              />
            </div>
            <div className='flex gap-2'>
              <SortDropdown options={sortOptions} current={sortOption} />
              <PlannerAddButtonMini onAddPlanner={handleAddPlannerSubmit} />
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

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
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
                onEdit={() => handleEditClick(planner.title)}
                onDelete={() => handleDeleteClick(planner.title)}
                onClick={() => handlePlannerCardClick(planner.id)}
              />
            </div>
          ))}

          {/* 플래너 추가 버튼 */}

          <div className='h-[372px] w-[348px] justify-self-start'>
            <PlannerAddButton onAddPlanner={handleAddPlannerSubmit} />
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
