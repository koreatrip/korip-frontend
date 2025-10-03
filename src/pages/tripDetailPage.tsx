import { useState } from 'react';
import MyPageLayout from '@/components/domain/myPage/MyPageLayout';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useNavigate, useParams } from 'react-router-dom';
import { usePlanDetailQuery } from '@/api/planner/plannerHooks';
import Spinner from '@/components/common/Spinner';
import { useTranslation } from 'react-i18next';
import Button from '@/components/common/Button';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

const TripDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [selectedDay, setSelectedDay] = useState(1);
  const { t } = useTranslation();

  const {
    data: planDetail,
    isLoading,
    error,
  } = usePlanDetailQuery(id!, {
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <MyPageLayout>
        <div className='flex min-h-screen items-center justify-center'>
          <Spinner />
        </div>
      </MyPageLayout>
    );
  }

  if (error || !planDetail) {
    return (
      <MyPageLayout>
        <div className='flex min-h-screen items-center justify-center'>
          <p className='text-gray-500'>{t('common.plan_not_found')}</p>
        </div>
      </MyPageLayout>
    );
  }

  const getDays = () => {
    if (!planDetail.start_date || !planDetail.end_date) return [];

    const start = new Date(planDetail.start_date);
    const end = new Date(planDetail.end_date);
    const days = [];
    let dayCount = 1;

    const current = new Date(start);
    while (current <= end) {
      const dateStr = `${current.getMonth() + 1}/${current.getDate()}`;
      days.push({
        date: dateStr,
        day: dayCount,
      });
      current.setDate(current.getDate() + 1);
      dayCount++;
    }

    return days;
  };

  const days = getDays();

  const getCurrentDaySlots = () => {
    if (!planDetail.time_slots) return [];

    return planDetail.time_slots.filter((slot) => {
      if (!planDetail.start_date) return false;
      const slotDate = new Date(slot.visit_date);
      const startDate = new Date(planDetail.start_date);
      const dayDiff = Math.floor(
        (slotDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      return dayDiff + 1 === selectedDay;
    });
  };

  const currentDaySlots = getCurrentDaySlots();

  const getMapCenterFromAllPlaces = () => {
    const placesWithCoords = currentDaySlots
      .filter((slot) => slot.place)
      .map((slot) => slot.place!);

    if (placesWithCoords.length === 0) {
      return { lat: 37.5665, lng: 126.978 };
    }

    const avgLat =
      placesWithCoords.reduce((sum, place) => sum + place.latitude, 0) /
      placesWithCoords.length;
    const avgLng =
      placesWithCoords.reduce((sum, place) => sum + place.longitude, 0) /
      placesWithCoords.length;

    return { lat: avgLat, lng: avgLng };
  };

  const mapCenter = getMapCenterFromAllPlaces();

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getFullYear().toString().slice(2)}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  const period = `${formatDate(planDetail.start_date)} ~ ${formatDate(planDetail.end_date)}`;

  return (
    <MyPageLayout>
      <div className='p-4 md:p-6'>
        {/* 헤더 */}
        <div className='mb-6 md:mb-8'>
          <h1 className='text-main-text-navy mb-2 text-2xl font-semibold md:text-3xl'>
            {planDetail.title}
          </h1>
          <p className='text-sm text-gray-600 md:text-base'>{period}</p>
        </div>

        {/* 메인 콘텐츠 */}
        <div className='flex flex-col gap-6 lg:flex-row lg:gap-8'>
          {/* 일정 리스트 */}
          <div className='flex-1'>
            <div className='bg-bg-white shadow-light rounded-lg p-4 md:p-6'>
              {/* 날짜 탭 */}
              <div className='mb-4 flex gap-2 overflow-x-auto md:mb-6 md:gap-4'>
                {days.map((day) => (
                  <button
                    key={day.day}
                    onClick={() => setSelectedDay(day.day)}
                    className={`flex-shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors md:px-4 md:text-base ${
                      selectedDay === day.day
                        ? 'bg-sub-green text-white'
                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                    }`}
                  >
                    {t('travel.day_label', {
                      dayCount: day.day,
                      date: day.date,
                    })}
                  </button>
                ))}
              </div>

              {/* 시간별 일정 */}
              <div className='space-y-3 md:space-y-4'>
                {currentDaySlots.length > 0 ? (
                  currentDaySlots.map((slot, index) => (
                    <div
                      key={index}
                      className='flex items-start gap-3 md:gap-4'
                    >
                      <div className='mt-1 w-12 text-xs text-gray-600 md:w-16 md:text-sm'>
                        {slot.visit_time}
                      </div>

                      <div className='border-l-sub-green flex-1 rounded-lg border-l-4 bg-gray-50 p-3 md:p-4'>
                        {slot.place ? (
                          <>
                            <div className='mb-1 flex items-center gap-2'>
                              <h3 className='text-main-text-navy text-sm font-medium md:text-base'>
                                {slot.place.name}
                              </h3>
                            </div>
                            <p className='text-sub-text-gray text-xs md:text-sm'>
                              {slot.place.address}
                            </p>
                          </>
                        ) : (
                          <p className='text-sub-text-gray text-xs md:text-sm'>
                            {t('common.empty_schedule')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className='text-sub-text-gray py-6 text-center text-sm md:py-8 md:text-base'>
                    {t('common.no_schedule_for_day')}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 지도 및 버튼 영역 */}
          <div className='flex w-full flex-col lg:w-96'>
            <div className='rounded-lg bg-white p-4 shadow-sm md:p-6'>
              <h3 className='mb-3 text-base font-medium text-gray-900 md:mb-4 md:text-lg'>
                {planDetail.title}
              </h3>

              <div className='mb-4 h-48 w-full rounded-lg md:h-64'>
                <Map
                  center={mapCenter}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '0.5rem',
                  }}
                  level={10}
                >
                  {currentDaySlots
                    .filter((slot) => slot.place)
                    .map((slot, idx) => (
                      <MapMarker
                        key={idx}
                        position={{
                          lat: slot.place!.latitude,
                          lng: slot.place!.longitude,
                        }}
                      />
                    ))}
                </Map>
              </div>

              <div className='mb-4 space-y-2 text-xs text-gray-600 md:text-sm'>
                <p>{planDetail.description}</p>
              </div>
            </div>

            {/* 구글 캘린더 / PDF 버튼 */}
            <div className='mt-4 flex flex-col gap-2 sm:flex-row'>
              <button className='flex-1 rounded-lg bg-[#FF6B7A] px-4 py-3 text-xs font-medium text-white transition-colors hover:bg-[#e55a6e] md:text-sm'>
                {t('common.sync_google_calendar')}
              </button>
              <button className='flex-1 rounded-lg bg-[#FF6B7A] px-4 py-3 text-xs font-medium text-white transition-colors hover:bg-[#e55a6e] md:text-sm'>
                {t('common.save_as_pdf')}
              </button>
            </div>

            {/* 삭제 / 수정 버튼 */}
            <div className='mt-auto flex justify-end gap-3 pt-4 md:gap-4 md:pt-8'>
              <Button className='flex h-12 w-12 items-center justify-center rounded-lg bg-white text-[#FF6B7A] transition-colors hover:bg-gray-50 md:h-14 md:w-14'>
                <TrashIcon className='h-4 w-4 md:h-5 md:w-5' />
              </Button>
              <Button
                onClick={() => navigate(`/trip/${id}/edit`)}
                className='h-12 px-6 md:h-14 md:px-8'
              >
                {t('common.edit')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MyPageLayout>
  );
};

export default TripDetailPage;
