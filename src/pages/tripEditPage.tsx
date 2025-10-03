import {
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

const TripEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { schedule, removePlace, movePlace, initializeSchedule } =
    usePlannerStore();
  const { startDate, endDate } = usePlannerStore.getState();
  const { showToast } = useToast();

  const scheduledCount = schedule.filter((slot) => slot.place !== null).length;
  const {
    data: planDetail,
    isLoading,
    error,
  } = usePlanDetailQuery(id!, {
    enabled: !!id,
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

  // 날짜 차이 계산 (일수)
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

  // selected_places를 PlannerPlace 형식으로 변환
  const availablePlaces =
    planDetail?.selected_places.map((place) => ({
      id: String(place.id),
      title: place.name,
      category: place.category.name,
      imageUrl: place.image_url,
      address: place.address,
    })) || [];

  // time_slots를 TimeSlotData 형식으로 변환
  const convertToScheduleData = (): TimeSlotData[] => {
    if (!planDetail?.time_slots || !planDetail.start_date) return [];

    const startDate = new Date(planDetail.start_date);

    return planDetail.time_slots.map((slot) => {
      // visit_date로부터 day 계산
      const visitDate = new Date(slot.visit_date);
      const dayDiff = Math.floor(
        (visitDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const day = dayDiff + 1;

      return {
        id: `${slot.visit_date}-${slot.visit_time}`,
        time: slot.visit_time.slice(0, 5), // "09:00:00" -> "09:00"
        day: day,
        timeSlotId: `day${day}-time${slot.visit_time.slice(0, 5)}`, // 추가
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

  // SchedulePlanner에 전달
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

  if (isLoading) return <div>로딩중...</div>;
  if (error || !planDetail) return <div>플랜을 불러올 수 없습니다.</div>;

  return (
    <div className='mx-auto w-full max-w-[1440px] px-4 md:px-6'>
      <div className='hidden items-start py-6 md:flex'>
        {/* 왼쪽 컬럼: 사이드바와 3개 박스를 세로로 배치 */}
        <div className='flex flex-col'>
          {/* 사이드바 */}
          <aside>
            <MyPageMenu />
          </aside>

          {/* 3개 박스 수직 정렬 - 사이드바와 같은 위치에 정렬 */}
          <div className='mt-6 flex flex-col gap-6 md:ml-[-40px]'>
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

            <SelectedPlacesList places={availablePlaces} />
          </div>
        </div>

        {/* 10px 간격 */}
        <div style={{ width: '10px' }}></div>

        {/* 메인 콘텐츠 */}
        <div className='space-y-6' style={{ width: '1090px' }}>
          {/* 제목 */}
          <div>
            <h1 className='mb-2 text-3xl font-bold text-gray-900'>
              일정 수정하기
            </h1>
            <p className='text-gray-600'>일정을 수정해보세요</p>
          </div>

          {/* 사용법 박스 */}
          <div
            className='flex items-center rounded-lg border border-[#D4A574] bg-[#F7F0E8] p-4'
            style={{ height: '67px' }}
          >
            <p className='text-sm text-[#2C3E50]'>
              💡사용법: 왼쪽 명소를 드래그 해서 가운데 시간대에 놓으세요. 날짜와
              시간을 자유롭게 조정할 수 있습니다.
            </p>
          </div>

          {/* 지도 영역 */}
          <div className='h-96 w-full rounded-lg bg-white shadow-sm'>
            <ItineraryMap places={planDetail?.selected_places || []} />
          </div>

          <SchedulePlanner
            schedule={schedule}
            onRemovePlace={removePlace}
            initialStartDate={initialStartDate}
            initialEndDate={initialEndDate}
          />

          {/* 저장 버튼 */}
          <div className='flex justify-end'>
            <Button
              onClick={handleSave}
              className='bg-main-pink hover:bg-main-hover-pink rounded-lg font-medium text-white transition-colors'
            >
              일정 완성
            </Button>
          </div>
        </div>
      </div>

      {/* 태블릿 레이아웃 */}
      <div className='hidden py-6 md:block lg:hidden'>
        <div className='space-y-6'>
          <div>
            <h1 className='mb-2 text-2xl font-bold text-gray-900'>
              일정 수정하기
            </h1>
            <p className='text-gray-600'>일정을 수정해보세요</p>
          </div>

          {/* 사용법 박스 */}
          <div className='flex items-center rounded-lg border border-[#D4A574] bg-[#F7F0E8] p-4'>
            <p className='text-sm text-[#2C3E50]'>
              💡사용법: 왼쪽 명소를 드래그 해서 가운데 시간대에 놓으세요. 날짜와
              시간을 자유롭게 조정할 수 있습니다.
            </p>
          </div>

          {/* 3개 박스 가로 정렬 */}
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

            <SelectedPlacesList places={availablePlaces} />

            <div className='rounded-lg bg-white p-4 shadow-sm'>
              <h3 className='mb-3 text-sm font-medium text-gray-900'>
                즐겨찾는 장소들
              </h3>
              <div
                className='space-y-2 overflow-y-auto'
                style={{ maxHeight: '200px' }}
              >
                {/* {favoritePlaces.map((item) => (
                  <DraggableCard key={item.id} item={item} />
                ))} */}
              </div>
            </div>
          </div>

          {/* 날짜 선택 및 시간별 일정 통합 박스 */}
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
              일정 완성
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 레이아웃 */}
      <div className='block py-4 md:hidden'>
        <div className='space-y-4'>
          <div>
            <h1 className='mb-2 text-xl font-bold text-gray-900'>
              일정 수정하기
            </h1>
            <p className='text-sm text-gray-600'>일정을 수정해보세요</p>
          </div>

          {/* 사용법 박스 */}
          <div className='rounded-lg border border-[#D4A574] bg-[#F7F0E8] p-3'>
            <p className='text-xs text-[#2C3E50]'>
              💡사용법: 드래그해서 시간대에 놓으세요.
            </p>
          </div>

          {/* 날짜 선택 */}
          <SchedulePlanner
            schedule={schedule}
            onRemovePlace={removePlace}
            initialStartDate={initialStartDate}
            initialEndDate={initialEndDate}
          />

          {/* 3개 박스 세로 정렬 */}
          <SelectedPlacesList places={availablePlaces} />

          <button
            onClick={handleSave}
            className='w-full rounded-lg bg-[#FF6B7A] py-3 font-medium text-white transition-colors hover:bg-[#e55a6e]'
          >
            일정 완성
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripEditPage;
