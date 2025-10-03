import {
  useCreatePlanMutation,
  usePlansQuery,
} from '@/api/planner/plannerHooks';
import SortDropdown from '@/components/common/dropdown/SortDropdown';
import SearchBar from '@/components/common/searchBar/SearchBar';
import Spinner from '@/components/common/Spinner';
import PlannerAddButton from '@/components/domain/planner/PlannerAddButton';
import PlannerAddButtonMini from '@/components/domain/planner/PlannerAddButtonMini';
import PlannerCard from '@/components/domain/planner/PlannerCard';
import PlannerDeleteModal from '@/components/domain/planner/PlannerDeleteModal';
import CreateTripModal, {
  type TTripData,
} from '@/components/modals/CreateTripModal';
import { usePlannerDelete } from '@/hooks/usePlannerDelete';
import { useToast } from '@/hooks/useToast';
import { SortOption, type DropdownItem } from '@/types/dropdown';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { plannerQueries } from '@/api/planner/plannerQueries';

type TPlannerData = {
  id: number;
  title: string;
  description: string;
  dateRange: string;
  isNew?: boolean;
  created_at: string;
  start_date: string | null;
  end_date: string | null;
};

const MyPlannerPage = () => {
  const { data: plansData, isLoading, error } = usePlansQuery();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { openDeleteModal, deleteModalProps } = usePlannerDelete();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>(
    SortOption.DATE_DESC
  );

  const formatDateRange = (
    startDate: string | null,
    endDate: string | null
  ): string => {
    if (!startDate && !endDate) {
      return '날짜 미정';
    }

    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    };

    if (startDate && endDate) {
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    } else if (startDate) {
      return `${formatDate(startDate)} -`;
    } else if (endDate) {
      return `- ${formatDate(endDate)}`;
    }

    return '날짜 미정';
  };

  const planners: TPlannerData[] = useMemo(() => {
    if (!plansData?.plans) return [];

    return plansData.plans.map((plan) => ({
      id: plan.id,
      title: plan.title,
      description: plan.description,
      dateRange: formatDateRange(plan.start_date, plan.end_date),
      isNew: false,
      created_at: plan.created_at,
      start_date: plan.start_date,
      end_date: plan.end_date,
    }));
  }, [plansData]);

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
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case SortOption.DATE_ASC:
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
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

  const handleSearchSubmit = (value: string) => setSearchValue(value);

  const handleEditClick = (plannerId: number) => {
    const planner = filteredAndSortedPlanners.find((p) => p.id === plannerId);
    if (planner?.start_date && planner?.end_date) {
      navigate(`/trip/${plannerId}/edit`);
    } else {
      navigate(`/planner/${plannerId}`);
    }
  };

  const handleDeleteClick = (plannerId: number) => {
    openDeleteModal(plannerId);
  };

  const handlePlannerCardClick = (planner: TPlannerData) => {
    if (!planner.start_date && !planner.end_date) {
      navigate(`/planner/${planner.id}`);
    } else {
      navigate(`/trip/${planner.id}`);
    }
  };

  const createPlanMutation = useCreatePlanMutation({
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: plannerQueries.plans.all().queryKey,
      });

      showToast('새 여행 일정이 생성되었습니다.', 'success');
      setIsCreateModalOpen(false);
    },
    onError: (error) => {
      showToast(error.message || '여행 일정 생성에 실패했습니다.', 'error');
    },
  });

  const handleCreatePlanSubmit = (tripData: TTripData) => {
    createPlanMutation.mutate({
      name: tripData.tripName,
      description: tripData.tripDescription || `${tripData.location} 여행`,
      destination: tripData.location,
      subregion_id: Number(tripData.selectedRegion),
    });
  };

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
        <div className='mb-6'>
          <h1 className='text-main-text-navy mb-4 text-4xl font-semibold'>
            {t('travel.travel_schedule')}
          </h1>

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
              <PlannerAddButtonMini
                onClick={() => setIsCreateModalOpen(true)}
              />
            </div>
          </div>

          {searchValue && (
            <div className='mb-4 text-sm text-gray-600'>
              "{searchValue}" {t('common.search_results')}{' '}
              {filteredAndSortedPlanners.length}
              {t('common.count_suffix')}
            </div>
          )}
        </div>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {filteredAndSortedPlanners.map((planner) => (
            <div key={planner.id} className='justify-self-start'>
              <PlannerCard
                title={planner.title}
                description={planner.description}
                dateRange={planner.dateRange}
                hasSchedule={!!(planner.start_date && planner.end_date)}
                onEdit={() => handleEditClick(planner.id)}
                onDelete={() => handleDeleteClick(planner.id)}
                onClick={() => handlePlannerCardClick(planner)}
              />
            </div>
          ))}

          <div className='justify-self-center'>
            <PlannerAddButton onClick={() => setIsCreateModalOpen(true)} />
          </div>
        </div>

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

        <div className='mt-12 text-right text-sm text-gray-400'>
          {t('common.total_count', { count: filteredAndSortedPlanners.length })}
        </div>
      </div>

      <PlannerDeleteModal {...deleteModalProps} />
      <CreateTripModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePlanSubmit}
        isPending={createPlanMutation.isPending}
      />
    </div>
  );
};

export default MyPlannerPage;
