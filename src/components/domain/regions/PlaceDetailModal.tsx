import { usePlaceDetailQuery } from '@/api/place/placeHooks';
import Button from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import Spinner from '@/components/common/Spinner';
import { parseOperatingHours } from '@/utils/timeUtils';
import { useTranslation } from 'react-i18next';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

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
  const { t } = useTranslation();

  const { data: placeDetailData, isLoading } = usePlaceDetailQuery(
    { place_id: placeId, lang },
    { enabled: !!placeId && isOpen }
  );

  const place = placeDetailData?.place;
  console.log('디테일 모달입니당', place);
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

  // const markerImageInfo = {
  //   src: '/pin.svg', // 마커 이미지 주소
  //   size: {
  //     width: 36,
  //     height: 52,
  //   }, // 마커 이미지의 크기
  //   options: {
  //     offset: {
  //       x: 18, // 마커의 가로 위치 (중앙으로 설정)
  //       y: 52, // 마커의 세로 위치 (하단으로 설정)
  //     },
  //   },
  // };

  const extractUrlFromHtml = (htmlString: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const anchor = doc.querySelector('a');
    return anchor?.href || htmlString;
  };

  if (isLoading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <Modal.Body>
          <div className='flex justify-center py-8'>
            <Spinner />
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  if (!place) {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <Modal.Body>
          <div className='py-8 text-center text-gray-500'>
            명소 정보를 불러올 수 없습니다.
          </div>
        </Modal.Body>
      </Modal>
    );
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header>{place.name}</Modal.Header>
      <Modal.Body>
        <div className='h-[182px] w-full rounded-lg'>
          {place.latitude && place.longitude && (
            <Map
              center={{ lat: place.latitude, lng: place.longitude }} // 맵의 중심을 장소의 좌표로 설정
              style={{ width: '100%', height: '100%', borderRadius: '0.5rem' }}
              level={3} // 확대 레벨
            >
              <MapMarker
                position={{ lat: place.latitude, lng: place.longitude }}
                // image={markerImageInfo}
              />{' '}
              {/* 장소 위치에 마커 표시 */}
            </Map>
          )}
        </div>
        <div className='mt-7 flex h-80 flex-col space-y-5 overflow-y-scroll'>
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
                      className={`flex items-center justify-between text-sm ${isToday ? 'font-bold' : ''}`}
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
      </Modal.Body>
      <Modal.Footer>
        <Button className='mt-4'>{t('travel.add_to_plan')}</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PlaceDetailModal;
