import Button from '@/components/common/Button';
import Container from '@/components/common/Container';
import SchedulePlanner from '@/components/domain/planner/SchedulePlanner';
import PlannerSidebar from '@/components/domain/planner/PlannerSidebar';
import type { PlannerPlace } from '@/types/plannerType';
import { useEffect } from 'react';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { usePlannerStore } from '@/stores/usePlannerStore';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useDeletePlaceFromPlanMutation,
  usePlanDetailQuery,
  useUpdatePlanMutation,
} from '@/api/planner/plannerHooks';
import Spinner from '@/components/common/Spinner';
import ItineraryMap from '@/components/domain/planner/ItineraryMap';
import { useToast } from '@/hooks/useToast';
import type { UpdatePlanRequest } from '@/api/planner/plannerType';
import { useQueryClient } from '@tanstack/react-query';

const PlannerPage = () => {
  const queryClient = useQueryClient();

  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { planId } = useParams<{ planId: string }>();
  const { showToast } = useToast();

  const { schedule, movePlace, removePlace, startDate, endDate } =
    usePlannerStore();

  // Plan detail 조회
  const {
    data: planDetail,
    isLoading,
    error,
  } = usePlanDetailQuery(planId!, i18n.language || 'ko', {
    enabled: !!planId,
  });

  // Plan 업데이트 mutation
  const updatePlanMutation = useUpdatePlanMutation({
    onSuccess: () => {
      showToast('일정이 저장되었습니다.', 'success');
    },
    onError: () => {
      showToast('일정 저장에 실패했습니다.', 'error');
    },
  });

  const initialStartDate = planDetail?.start_date
    ? new Date(planDetail.start_date)
    : null;
  const initialEndDate = planDetail?.end_date
    ? new Date(planDetail.end_date)
    : null;

  // selected_places를 PlannerPlace 형식으로 변환
  const availablePlaces: PlannerPlace[] =
    planDetail?.selected_places.map((place) => ({
      id: String(place.id),
      title: place.name,
      category: place.category.name,
      imageUrl: place.image_url,
      address: place.address,
    })) || [];

  // 저장 핸들러
  // 저장 핸들러
  const handleSave = async () => {
    if (!planId || !planDetail) {
      showToast('플랜 정보를 찾을 수 없습니다.', 'error');
      return;
    }

    // startDate/endDate가 없으면 오늘 날짜를 기본값으로 사용
    const today = new Date().toISOString();
    const effectiveStartDate = startDate || today;
    const effectiveEndDate = endDate || today;

    const start = new Date(effectiveStartDate);
    const end = new Date(effectiveEndDate);

    // day를 실제 날짜로 변환하는 함수
    const getDayDate = (day: number): string => {
      const date = new Date(start);
      date.setDate(start.getDate() + (day - 1));
      return date.toISOString().split('T')[0];
    };

    // Zustand schedule을 API 형식으로 변환
    const places = schedule.map((slot) => ({
      place_id: slot.place ? Number(slot.place.id) : null,
      visit_date: getDayDate(slot.day),
      visit_time: slot.time,
    }));

    const updateData: UpdatePlanRequest = {
      title: planDetail.title,
      description: planDetail.description,
      start_date: start.toISOString().split('T')[0],
      end_date: end.toISOString().split('T')[0],
      places: places,
    };

    console.log('저장할 데이터:', updateData);

    try {
      await updatePlanMutation.mutateAsync({
        planId: planId,
        planData: updateData,
      });
      navigate(`/mypage/plan`);
    } catch (error) {
      // onError에서 처리됨
    }
  };

  // 장소 삭제 mutation 추가
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

  // 장소 삭제 핸들러
  const handleRemovePlaceFromPlan = (placeId: string) => {
    if (!planId) return;

    deletePlaceMutation.mutate({
      planId: planId,
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

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <p className='text-error-red mb-2'>플랜을 불러오는데 실패했습니다.</p>
          <p className='text-sm text-gray-500'>페이지를 새로고침해주세요.</p>
        </div>
      </div>
    );
  }

  if (!planDetail) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <p className='text-gray-500'>플랜을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className='bg-bg-section'>
      <Container className='mt-16'>
        <div className='flex flex-col items-center justify-center'>
          <h1 className='mb-4 text-center text-2xl font-semibold md:text-3xl lg:text-4xl'>
            {planDetail.title}
          </h1>
          <p className='text-center text-sm text-gray-600 md:text-base'>
            {planDetail.description}
          </p>
          <p className='mt-2 text-center text-sm md:text-base'>
            {t('travel.drag_attractions_to_schedule')}
          </p>
        </div>

        <div className='border-point-gold text-main-text-navy mt-6 mb-6 rounded-lg border bg-[#F7F0E8] p-3 text-sm md:mt-7 md:mb-8'>
          <Trans
            i18nKey='travel.drag_instructions'
            components={{
              IconText: <span className='font-semibold' />,
            }}
          />
        </div>

        <div className='mb-9'>
          {/* 모바일 레이아웃 */}
          <div className='flex flex-col gap-4 md:hidden'>
            <div className='w-full'>
              <PlannerSidebar
                places={availablePlaces}
                onRemovePlace={handleRemovePlaceFromPlan} // 전달
              />
            </div>
            <div className='w-full'>
              <SchedulePlanner
                schedule={schedule}
                onRemovePlace={removePlace}
                initialStartDate={initialStartDate}
                initialEndDate={initialEndDate}
              />
            </div>
            <div className='w-full'>
              <ItineraryMap places={planDetail?.selected_places || []} />
              <div className='mt-4'>
                <Button
                  variant='active'
                  className='w-full'
                  onClick={handleSave}
                  disabled={updatePlanMutation.isPending}
                >
                  {updatePlanMutation.isPending
                    ? '저장 중...'
                    : t('common.save')}
                </Button>
              </div>
            </div>
          </div>

          {/* 태블릿 레이아웃 */}
          <div className='hidden flex-col gap-4 md:flex lg:hidden'>
            <div className='w-full'>
              <PlannerSidebar
                places={availablePlaces}
                onRemovePlace={handleRemovePlaceFromPlan} // 전달
              />
            </div>
            <div className='flex gap-4'>
              <div className='flex-1'>
                <SchedulePlanner
                  schedule={schedule}
                  onRemovePlace={removePlace}
                  initialStartDate={initialStartDate}
                  initialEndDate={initialEndDate}
                />
              </div>
              <div className='w-80 flex-shrink-0'>
                <ItineraryMap places={planDetail?.selected_places || []} />
                <div className='mt-4'>
                  <Button
                    variant='active'
                    className='w-full'
                    onClick={handleSave}
                    disabled={updatePlanMutation.isPending}
                  >
                    {updatePlanMutation.isPending
                      ? '저장 중...'
                      : t('common.save')}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* 데스크톱 레이아웃 */}
          <div className='hidden w-full gap-4 lg:flex'>
            <div className='w-80 flex-shrink-0'>
              <PlannerSidebar
                places={availablePlaces}
                onRemovePlace={handleRemovePlaceFromPlan} // 전달
              />
            </div>
            <div className='flex-1'>
              <SchedulePlanner
                schedule={schedule}
                onRemovePlace={removePlace}
                initialStartDate={initialStartDate}
                initialEndDate={initialEndDate}
              />
            </div>
            <div className='flex w-96 flex-shrink-0 flex-col'>
              <ItineraryMap places={planDetail?.selected_places || []} />
              <div className='mt-4'>
                <Button
                  variant='active'
                  onClick={handleSave}
                  disabled={updatePlanMutation.isPending}
                >
                  {updatePlanMutation.isPending
                    ? '저장 중...'
                    : t('common.save')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default PlannerPage;
