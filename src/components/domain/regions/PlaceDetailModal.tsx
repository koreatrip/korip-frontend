import { usePlaceDetailQuery } from '@/api/place/placeHooks';
import {
  useAddPlaceToPlanMutation,
  usePlansQuery,
} from '@/api/planner/plannerHooks';
import Button from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import Spinner from '@/components/common/Spinner';
import { useToast } from '@/hooks/useToast';
import { parseOperatingHours } from '@/utils/timeUtils';
import { useTranslation } from 'react-i18next';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { useState } from 'react';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import { useModalStore } from '@/stores/useModalStore';

type PlaceDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  placeId: number | null;
  lang: string;
};

const PlaceDetailModal = ({
  isOpen,
  onClose,
  placeId,
  lang,
}: PlaceDetailModalProps) => {
  const { t, i18n } = useTranslation();
  const { showToast } = useToast();
  const { isLoggedIn } = useAuthCheck();
  const { actions: modalActions } = useModalStore();

  const [selectedPlanId, setSelectedPlanId] = useState<string>('');

  const { data: placeDetailData, isLoading } = usePlaceDetailQuery(
    { place_id: placeId, lang },
    { enabled: !!placeId && isOpen }
  );

  const { data: plansData, isLoading: plansLoading } = usePlansQuery(
    i18n.language || 'ko',
    {
      enabled: isLoggedIn,
    }
  );

  const place = placeDetailData?.place;
  const processedHours = place?.use_time
    ? parseOperatingHours(place.use_time)
    : [];
  const dayOfWeekMap = [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ];
  const todayName = dayOfWeekMap[new Date().getDay()];

  const addPlaceToPlanMutation = useAddPlaceToPlanMutation({
    onSuccess: () => {
      showToast('일정에 장소가 추가되었습니다.', 'success');
      // onClose(); // 성공 시 모달 닫기
    },
    onError: (error) => {
      console.error('장소 추가 실패:', error);
      showToast('일정에 장소를 추가하는데 실패했습니다.', 'error');
    },
  });

  const handleAddToPlan = () => {
    if (!isLoggedIn) {
      modalActions.openLoginPrompt();
      return;
    }
    if (!placeId) {
      showToast('장소 정보를 찾을 수 없습니다.', 'error');
      return;
    }
    if (!selectedPlanId) {
      showToast('추가할 일정을 선택해주세요.', 'info');
      return;
    }

    addPlaceToPlanMutation.mutate({
      planId: selectedPlanId,
      placeData: { place_id: placeId },
    });
  };

  const renderPlanOptions = () => {
    if (plansLoading) {
      return <option disabled>일정 불러오는 중...</option>;
    }
    if (!plansData?.plans || plansData.plans.length === 0) {
      return <option disabled>생성된 일정이 없습니다.</option>;
    }

    return (
      <>
        <option value='' disabled>
          일정을 선택하세요
        </option>
        {plansData.plans.map((plan) => (
          <option key={plan.id} value={String(plan.id)}>
            {plan.title || `일정 ${plan.id}`}
          </option>
        ))}
      </>
    );
  };

  const extractUrlFromHtml = (htmlString: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const anchor = doc.querySelector('a');
    return anchor?.href || htmlString;
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header>{!isLoading && place ? place.name : ' '}</Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <div className='flex justify-center py-8'>
            <Spinner />
          </div>
        ) : !place ? (
          <div className='py-8 text-center text-gray-500'>
            명소 정보를 불러올 수 없습니다.
          </div>
        ) : (
          <>
            <div className='h-[182px] w-full rounded-lg'>
              {place.latitude && place.longitude && (
                <Map
                  center={{ lat: place.latitude, lng: place.longitude }}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '0.5rem',
                  }}
                  level={3}
                >
                  <MapMarker
                    position={{ lat: place.latitude, lng: place.longitude }}
                  />
                </Map>
              )}
            </div>
            <div className='mt-7 flex h-80 flex-col space-y-5 overflow-y-scroll pr-2'>
              <div className='flex flex-col'>
                <p className='font-semibold'>{t('common.address')}</p>
                <p className='text-main-text-navy/80'>{place.address}</p>
              </div>
              {place.link_url && (
                <div className='flex flex-col'>
                  <p className='font-semibold'>{t('places.visit_website')}</p>
                  <a
                    href={extractUrlFromHtml(place.link_url)}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-main-text-navy/80 hover:underline'
                  >
                    {extractUrlFromHtml(place.link_url)}
                  </a>
                </div>
              )}
              {place.description && place.description !== '-' && (
                <div className='flex flex-col'>
                  <p className='font-semibold'>{t('common.description')}</p>
                  <p className='text-main-text-navy/80 leading-relaxed'>
                    {place.description}
                  </p>
                </div>
              )}
              <div className='mb-3 flex items-center justify-between border-b border-gray-200 pb-3'>
                <h4 className='font-semibold text-gray-600'>
                  {t('common.inquiry_and_info')}
                </h4>
                <a
                  href={`tel:${place.phone_number}`}
                  className='text-sub-green font-semibold hover:underline'
                >
                  {place.phone_number}
                </a>
              </div>
              {place.use_time && (
                <>
                  <h4 className='mb-3 font-semibold text-gray-600'>
                    {t('places.available_hours')}
                  </h4>
                  <div className='space-y-2'>
                    {processedHours.map(({ day, time }) => {
                      const isToday = day === todayName;
                      const isClosed = time === '휴무';
                      return (
                        <div
                          key={day}
                          className={`flex items-center justify-between text-sm ${
                            isToday ? 'font-bold' : ''
                          }`}
                        >
                          <span
                            className={
                              isToday ? 'text-sub-green' : 'text-main-text-navy'
                            }
                          >
                            {day}
                          </span>
                          <span
                            className={
                              isClosed
                                ? 'font-semibold text-red-500'
                                : isToday
                                  ? 'text-sub-green'
                                  : 'text-main-text-navy'
                            }
                          >
                            {time}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        {!isLoggedIn ? (
          <div className='mt-4 flex w-full flex-col items-center gap-y-3'>
            <p className='text-sm text-gray-600'>
              일정에 장소를 추가하려면 로그인이 필요합니다.
            </p>
            <Button
              onClick={() => {
                onClose(); // 디테일 모달 먼저 닫기
                setTimeout(() => {
                  modalActions.openLoginPrompt();
                }, 200);
              }}
              className='w-full'
            >
              로그인하기
            </Button>
          </div>
        ) : (
          <div className='mt-4 flex w-full items-center gap-x-2'>
            <select
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
              className='focus:border-sub-green focus:ring-sub-green flex-grow rounded-md border border-gray-300 p-2 focus:ring-1 focus:outline-none'
              disabled={
                plansLoading ||
                !plansData?.plans ||
                plansData.plans.length === 0
              }
            >
              {renderPlanOptions()}
            </select>
            <Button
              onClick={handleAddToPlan}
              disabled={
                addPlaceToPlanMutation.isPending || isLoading || !selectedPlanId
              }
              className='w-1/3 flex-shrink-0'
            >
              {addPlaceToPlanMutation.isPending
                ? t('common.adding')
                : t('travel.add_to_plan')}
            </Button>
          </div>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default PlaceDetailModal;
