import { usePlansQuery } from '@/api/planner/plannerHooks';
import SortDropdown from '@/components/common/dropdown/SortDropdown';
import SearchBar from '@/components/common/searchBar/SearchBar';
import Spinner from '@/components/common/Spinner';
import PlannerAddButton from '@/components/domain/planner/PlannerAddButton';
import PlannerAddButtonMini from '@/components/domain/planner/PlannerAddButtonMini';
import PlannerCard from '@/components/domain/planner/PlannerCard';
import { SortOption, type DropdownItem } from '@/types/dropdown';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

type TPlannerData = {
  id: number;
  title: string;
  description: string;
  dateRange: string;
  isNew?: boolean;
  createdAt: string;
};

const MyPlannerPage = () => {
  const { data: plansData, isLoading, error } = usePlansQuery();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>(
    SortOption.DATE_DESC
  );

  // API 데이터를 컴포넌트 형식에 맞게 변환
  const planners: TPlannerData[] = useMemo(() => {
    if (!plansData?.plans) return [];

    return plansData.plans.map((plan) => ({
      id: plan.id,
      title: plan.title,
      description: plan.description,
      dateRange: '날짜 정보 없음', // API에 날짜 필드가 없어서 임시
      isNew: false, // API에 isNew 필드가 없어서 기본값
      createdAt: plan.created_at,
    }));
  }, [plansData]);

  // 검색 + 정렬
  const filteredAndSortedPlanners: TPlannerData[] = useMemo(() => {
    const lower = searchValue.trim().toLowerCase();

    const filtered = lower
      ? planners.filter((p) =>
          [p.title, p.description, p.dateRange]
            .filter(Boolean)
            .some((f) => f!.toLowerCase().includes(lower))
        )
      : planners;

    const sorted = [...filtered].sort((a, b) => {
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

    return sorted;
  }, [planners, searchValue, sortOption]);

  // 드롭다운 옵션
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

  // 이벤트 핸들러
  const handleSearchSubmit = (value: string) => setSearchValue(value);

  const handleEditClick = (title: string) => {
    console.log(`${title} ${t('common.edit')}`);
  };

  const handleDeleteClick = (title: string) => {
    console.log(`${title} ${t('common.delete')}`);
  };

  const handleAddPlannerSubmit = (newPlanner: TPlannerData) => {
    // TODO: 실제로는 여기서 API 호출해서 새 플래너 추가하고 리프레시해야 함
    console.log('새 플래너 추가:', newPlanner);
  };

  const handlePlannerCardClick = (plannerId: number) => {
    navigate(`/trip/${plannerId}`);
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className='flex min-h-screen w-full items-center justify-center'>
        <div className='flex flex-col items-center text-center'>
          <Spinner />
          <p className='text-gray-500'>플래너를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className='flex min-h-screen w-full items-center justify-center'>
        <div className='text-center'>
          <p className='text-error-red mb-2'>
            플래너를 불러오는데 실패했습니다.
          </p>
          <p className='text-sm text-gray-500'>페이지를 새로고침해주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen w-full'>
      <div className='w-full flex-1 px-2 py-6'>
        {/* 헤더 */}
        <div className='mb-6'>
          <h1 className='text-main-text-navy mb-4 text-4xl font-semibold'>
            {t('travel.travel_schedule')}
          </h1>

          {/* 검색/정렬/추가 */}
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

          {/* 검색 결과 문구 */}
          {searchValue && (
            <div className='mb-4 text-sm text-gray-600'>
              "{searchValue}" {t('common.search_results')}{' '}
              {filteredAndSortedPlanners.length}
              {t('common.count_suffix')}
            </div>
          )}
        </div>

        {/* 그리드 (고정 w/h 제거 → 반응형) */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {filteredAndSortedPlanners.map((planner) => (
            <div key={planner.id} className='justify-self-start'>
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

          {/* 플래너 추가 카드를 맨 뒤로 배치 */}
          <div className='justify-self-center'>
            <PlannerAddButton onAddPlanner={handleAddPlannerSubmit} />
          </div>
        </div>

        {/* 빈 상태 */}
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
                <p className='text-gray-500'>
                  {t('planner.search_empty_title')}
                </p>
                <p className='mt-2 text-sm text-gray-400'>
                  {t('planner.search_empty_desc')}
                </p>
              </>
            ) : (
              <>
                <p className='text-gray-500'>{t('planner.empty_title')}</p>
                <p className='mt-2 text-sm text-gray-400'>
                  {t('planner.empty_desc')}
                </p>
              </>
            )}
          </div>
        )}

        {/* 총 개수 */}
        <div className='mt-12 text-right text-sm text-gray-400'>
          {t('common.total_count', { count: filteredAndSortedPlanners.length })}
        </div>
      </div>
    </div>
  );
};

export default MyPlannerPage;
