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

  // 모든 선택된 장소의 중심점 계산
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
      <div className='p-6'>
        <div className='mb-8'>
          <h1 className='text-main-text-navy mb-2 text-3xl font-semibold'>
            {planDetail.title}
          </h1>
          <p className='text-gray-600'>{period}</p>
        </div>

        <div className='flex gap-8'>
          <div className='flex-1'>
            <div className='bg-bg-white shadow-light rounded-lg p-6'>
              <div className='mb-6 flex gap-4 overflow-x-auto'>
                {days.map((day) => (
                  <button
                    key={day.day}
                    onClick={() => setSelectedDay(day.day)}
                    className={`flex-shrink-0 rounded-lg px-4 py-2 font-medium transition-colors ${
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

              <div className='space-y-4'>
                {currentDaySlots.length > 0 ? (
                  currentDaySlots.map((slot, index) => (
                    <div key={index} className='flex items-start gap-4'>
                      <div className='mt-1 w-16 text-sm text-gray-600'>
                        {slot.visit_time}
                      </div>

                      <div className='border-l-sub-green flex-1 rounded-lg border-l-4 bg-gray-50 p-4'>
                        {slot.place ? (
                          <>
                            <div className='mb-1 flex items-center gap-2'>
                              <h3 className='text-main-text-navy font-medium'>
                                {slot.place.name}
                              </h3>
                            </div>
                            <p className='text-sub-text-gray text-sm'>
                              {slot.place.address}
                            </p>
                          </>
                        ) : (
                          <p className='text-sub-text-gray text-sm'>
                            {t('common.empty_schedule')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className='text-sub-text-gray py-8 text-center'>
                    {t('common.no_schedule_for_day')}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className='flex w-96 flex-col'>
            <div className='rounded-lg bg-white p-6 shadow-sm'>
              <h3 className='mb-4 font-medium text-gray-900'>
                {planDetail.title}
              </h3>

              <div className='mb-4 h-48 w-full rounded-lg'>
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

              <div className='mb-4 space-y-2 text-sm text-gray-600'>
                <p>{planDetail.description}</p>
              </div>
            </div>

            <div className='mt-4 flex gap-2'>
              <button className='flex-1 rounded-lg bg-[#FF6B7A] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#e55a6e]'>
                {t('common.sync_google_calendar')}
              </button>
              <button className='flex-1 rounded-lg bg-[#FF6B7A] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#e55a6e]'>
                {t('common.save_as_pdf')}
              </button>
            </div>

            <div className='mt-auto flex justify-end gap-4 pt-8'>
              <Button className='flex h-14 w-14 items-center justify-center rounded-lg bg-white text-[#FF6B7A] transition-colors hover:bg-gray-50'>
                <TrashIcon className='h-4 w-4' />
              </Button>
              <Button onClick={() => navigate(`/planner/${id}`)}>
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
