import {
  useDeletePlaceFromPlanMutation,
  usePlanDetailQuery,
  useUpdatePlanMutation,
} from '@/api/planner/plannerHooks';
import MyPageMenu from '@/components/domain/myPage/MyPageMenu';
import ItineraryMap from '@/components/domain/planner/ItineraryMap';
import SchedulePlanner from '@/components/domain/planner/SchedulePlanner';
import SelectedPlacesList from '@/components/domain/planner/SelectedPlacesList';
import TripSummary from '@/components/domain/planner/TripSummary';
import { usePlannerStore } from '@/stores/usePlannerStore';
import type { PlannerPlace, TimeSlotData } from '@/types/plannerType';
import React, { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useToast } from '@/hooks/useToast';
import Button from '@/components/common/Button';
import { useFavoritePlacesQuery } from '@/api/favorites/favoriteHooks';
import { Trans, useTranslation } from 'react-i18next';
import LoadingPage from './statusPage/loadingPage';
import { useQueryClient } from '@tanstack/react-query';

const TripEditPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { schedule, removePlace, movePlace, initializeSchedule } =
    usePlannerStore();
  const { startDate, endDate } = usePlannerStore.getState();
  const { showToast } = useToast();

  const { t, i18n } = useTranslation();

  const scheduledCount = schedule.filter((slot) => slot.place !== null).length;

  const {
    data: planDetail,
    isLoading,
    error,
  } = usePlanDetailQuery(id!, i18n.language || 'ko', {
    enabled: !!id,
  });

  const { data: favoritePlacesData } = useFavoritePlacesQuery({
    lang: i18n.language,
  });

  const handleSave = async () => {
    if (!id || !planDetail) {
      showToast('플랜 정보를 찾을 수 없습니다.', 'error');
      return;
    }
    if (!startDate || !endDate) {
      showToast('날짜를 선택해주세요.', 'error');
      return;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    const getDayDate = (day: number): string => {
      const date = new Date(start);
      date.setDate(start.getDate() + (day - 1));
      return date.toISOString().split('T')[0];
    };
    const places = schedule.map((slot) => ({
      place_id: slot.place ? Number(slot.place.id) : null,
      visit_date: getDayDate(slot.day),
      visit_time: slot.time,
    }));
    const updateData = {
      title: planDetail.title,
      description: planDetail.description,
      start_date: start.toISOString().split('T')[0],
      end_date: end.toISOString().split('T')[0],
      places: places,
    };
    try {
      await updatePlanMutation.mutateAsync({
        planId: id,
        planData: updateData,
      });
      navigate(`/trip/${id}`);
    } catch (error) {
      // onError에서 처리됨
    }
  };

  const calculateDuration = (
    startDate: string | null,
    endDate: string | null
  ): number => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  };

  const availablePlaces = useMemo(() => {
    return (
      planDetail?.selected_places.map((place) => ({
        id: String(place.id),
        title: place.name,
        category: place.category.name,
        imageUrl: place.image_url,
        address: place.address,
      })) || []
    );
  }, [planDetail?.selected_places]);

  const favoritePlaces: PlannerPlace[] = useMemo(() => {
    if (!favoritePlacesData?.favorite_places) {
      return [];
    }
    return favoritePlacesData.favorite_places.map((favPlace) => ({
      id: String(favPlace.id),
      title: favPlace.name,
      category: favPlace.category?.name || '',
      imageUrl: favPlace.image_url,
      address: favPlace.address,
    }));
  }, [favoritePlacesData]);

  const convertToScheduleData = (): TimeSlotData[] => {
    if (!planDetail?.time_slots || !planDetail.start_date) return [];
    const startDate = new Date(planDetail.start_date);
    return planDetail.time_slots.map((slot) => {
      const visitDate = new Date(slot.visit_date);
      const dayDiff = Math.floor(
        (visitDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const day = dayDiff + 1;
      return {
        id: `${slot.visit_date}-${slot.visit_time}`,
        time: slot.visit_time.slice(0, 5),
        day: day,
        timeSlotId: `day${day}-time${slot.visit_time.slice(0, 5)}`,
        place: slot.place
          ? {
              id: String(slot.place.id),
              title: slot.place.name,
              category: slot.place.category.name,
              imageUrl: slot.place.image_url,
              address: slot.place.address,
            }
          : null,
      };
    });
  };

  const initialStartDate = useMemo(
    () => (planDetail?.start_date ? new Date(planDetail.start_date) : null),
    [planDetail?.start_date]
  );

  const initialEndDate = useMemo(
    () => (planDetail?.end_date ? new Date(planDetail.end_date) : null),
    [planDetail?.end_date]
  );

  const updatePlanMutation = useUpdatePlanMutation({
    onSuccess: () => {
      showToast('일정이 수정되었습니다.', 'success');
    },
    onError: () => {
      showToast('일정 수정에 실패했습니다.', 'error');
    },
  });

  const deletePlaceMutation = useDeletePlaceFromPlanMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['plans'],
      });

      // invalidate 완료 후 토스트
      showToast('장소가 삭제되었습니다.', 'success');
    },
    onError: () => {
      showToast('장소 삭제에 실패했습니다.', 'error');
    },
  });

  const handleRemovePlaceFromPlan = (placeId: string) => {
    if (!id) return;

    deletePlaceMutation.mutate({
      planId: id,
      placeId: placeId,
    });
  };

  useEffect(() => {
    const cleanup = monitorForElements({
      onDrop(args) {
        const { location, source } = args;
        if (!location.current.dropTargets.length) return;
        const target = location.current.dropTargets[0];
        const sourceData = source.data;
        const targetData = target.data;
        const draggedPlace = sourceData.place as PlannerPlace;
        const sourceTime = (sourceData.originTime as string) || null;
        const sourceDay = (sourceData.originDay as number) || null;
        const targetTime = targetData.time as string;
        const targetDay = targetData.day as number;
        if (sourceDay === targetDay && sourceTime === targetTime) return;
        movePlace({
          sourceTime,
          sourceDay,
          targetTime,
          targetDay,
          place: draggedPlace,
        });
      },
    });
    return cleanup;
  }, [movePlace]);

  useEffect(() => {
    if (planDetail?.time_slots) {
      const convertedData = convertToScheduleData();
      initializeSchedule(convertedData);
    }
  }, [planDetail, initializeSchedule]);

  if (isLoading) return <LoadingPage />;
  if (error || !planDetail) return <div>플랜을 불러올 수 없습니다.</div>;

  return (
    <div className='mx-auto w-full max-w-[1440px] px-4 md:px-6'>
      {/* ✨ 변경된 부분: md:flex -> lg:flex로 변경하여 PC에서만 보이도록 수정 */}
      <div className='hidden items-start py-6 lg:flex lg:gap-10'>
        {/* 왼쪽 컬럼 */}
        <div className='flex flex-col gap-y-6'>
          <MyPageMenu />
          <div className='w-72 space-y-6'>
            <TripSummary
              duration={calculateDuration(
                planDetail.start_date,
                planDetail.end_date
              )}
              totalPlaces={planDetail.selected_places.length}
              completedPlaces={scheduledCount}
              progress={
                planDetail.selected_places.length
                  ? Math.round(
                      (scheduledCount / planDetail.selected_places.length) * 100
                    )
                  : 0
              }
            />
            <SelectedPlacesList
              listType='selected'
              places={availablePlaces}
              onRemovePlace={handleRemovePlaceFromPlan} // 전달
            />
            <SelectedPlacesList listType='favorites' places={favoritePlaces} />
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className='min-w-0 flex-1 space-y-6'>
          <div>
            <h1 className='text-main-text-navy mb-2 text-3xl font-semibold'>
              {t('travel.edit_schedule')}
            </h1>
            <p className='text-gray-600'>{t('travel.try_edit_schedule')}</p>
          </div>
          <div className='flex items-center rounded-lg border border-[#D4A574] bg-[#F7F0E8] p-4'>
            <Trans
              i18nKey='travel.drag_instructions'
              components={{
                IconText: <span className='font-semibold' />,
              }}
            />
          </div>
          <div className='h-96 w-full rounded-lg bg-white shadow-sm'>
            <ItineraryMap places={planDetail?.selected_places || []} />
          </div>
          <SchedulePlanner
            schedule={schedule}
            onRemovePlace={removePlace}
            initialStartDate={initialStartDate}
            initialEndDate={initialEndDate}
          />
          <div className='flex justify-end'>
            <Button
              onClick={handleSave}
              className='bg-main-pink hover:bg-main-hover-pink rounded-lg font-medium text-white transition-colors'
            >
              {t('travel.schedule_complete')}
            </Button>
          </div>
        </div>
      </div>

      {/* 태블릿 레이아웃 (md 이상, lg 미만에서만 보임) */}
      <div className='hidden py-6 md:block lg:hidden'>
        <div className='space-y-6'>
          <div>
            <h1 className='text-main-text-navy mb-2 text-2xl font-semibold'>
              {t('travel.edit_schedule')}
            </h1>
            <p className='text-gray-600'>{t('travel.try_edit_schedule')}</p>
          </div>
          <div className='flex items-center rounded-lg border border-[#D4A574] bg-[#F7F0E8] p-4'>
            <Trans
              i18nKey='travel.drag_instructions'
              components={{
                IconText: <span className='font-semibold' />,
              }}
            />
          </div>
          <div className='grid grid-cols-3 gap-4'>
            <TripSummary
              duration={calculateDuration(
                planDetail.start_date,
                planDetail.end_date
              )}
              totalPlaces={planDetail.selected_places.length}
              completedPlaces={scheduledCount}
              progress={
                planDetail.selected_places.length
                  ? Math.round(
                      (scheduledCount / planDetail.selected_places.length) * 100
                    )
                  : 0
              }
            />
            <SelectedPlacesList
              listType='selected'
              places={availablePlaces}
              onRemovePlace={handleRemovePlaceFromPlan} // 전달
            />
            <SelectedPlacesList listType='favorites' places={favoritePlaces} />
          </div>
          <SchedulePlanner
            schedule={schedule}
            onRemovePlace={removePlace}
            initialStartDate={initialStartDate}
            initialEndDate={initialEndDate}
          />
          <div className='flex justify-end'>
            <button
              onClick={handleSave}
              className='rounded-lg bg-[#FF6B7A] font-medium text-white transition-colors hover:bg-[#e55a6e]'
              style={{ width: '200px', height: '48px' }}
            >
              {t('travel.schedule_complete')}
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 레이아웃 (md 미만에서만 보임) */}
      <div className='block py-4 md:hidden'>
        <div className='space-y-4'>
          <div>
            <h1 className='text-main-text-navy mb-2 text-xl font-semibold'>
              {t('travel.edit_schedule')}
            </h1>
            <p className='text-sm text-gray-600'>
              {t('travel.try_edit_schedule')}
            </p>
          </div>
          <div className='rounded-lg border border-[#D4A574] bg-[#F7F0E8] p-3'>
            <Trans
              i18nKey='travel.drag_instructions'
              components={{
                IconText: <span className='font-semibold' />,
              }}
            />
          </div>
          <SchedulePlanner
            schedule={schedule}
            onRemovePlace={removePlace}
            initialStartDate={initialStartDate}
            initialEndDate={initialEndDate}
          />
          <SelectedPlacesList
            listType='selected'
            places={availablePlaces}
            onRemovePlace={handleRemovePlaceFromPlan} // 전달
          />
          <SelectedPlacesList listType='favorites' places={favoritePlaces} />
          <button
            onClick={handleSave}
            className='w-full rounded-lg bg-[#FF6B7A] py-3 font-medium text-white transition-colors hover:bg-[#e55a6e]'
          >
            {t('travel.schedule_complete')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripEditPage;
