import Button from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { useTranslation } from 'react-i18next';

// --- 데이터 타입 정의 ---
type TPlaceData = {
  name: string;
  address: string;
  description: string;
  operatingTime: string;
  closingDays: string;
  phoneNumber: string;
};

type OperatingHour = {
  day: string;
  time: string;
};

// --- 데이터 가공 로직 ---
const processOperatingHours = (apiData: TPlaceData): OperatingHour[] => {
  const allDays = [
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
    '일요일',
  ];
  const { operatingTime, closingDays } = apiData;

  if (closingDays === '연중무휴') {
    return allDays.map((day) => ({ day, time: operatingTime }));
  }
  if (closingDays.startsWith('매주')) {
    const closedDay = closingDays.replace('매주', '').trim();
    return allDays.map((day) => ({
      day,
      time: day === closedDay ? '휴무일' : operatingTime,
    }));
  }
  return allDays.map((day) => ({ day, time: operatingTime }));
};

// --- 메인 컴포넌트: PlaceDetailModal ---
type TPlaceDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const PlaceDetailModal = ({ isOpen, onClose }: TPlaceDetailModalProps) => {
  const mockPlaceData: TPlaceData = {
    name: '경복궁',
    address: '서울특별시 종로구 사직로 161',
    phoneNumber: '02-3700-3900',
    description:
      "경복궁은 서울의 중심에 자리한 조선 왕조의 가장 위대한 궁궐입니다. 아름다운 건축물과 넓은 정원을 거닐며 한국의 유구한 역사와 전통미를 느낄 수 있는 곳이에요. '큰 복을 누리다'라는 의미를 지닌 이곳에서 조선 왕조의 번영과 이야기를 만나보세요.",
    operatingTime: '09:00 ~ 18:00',
    closingDays: '매주 화요일',
  };

  const processedHours = processOperatingHours(mockPlaceData);
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

  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header>경복궁</Modal.Header>
      <Modal.Body>
        <div className='h-[182px] w-full rounded-lg bg-gray-200'></div>
        <div className='mt-7 flex h-80 flex-col space-y-5 overflow-y-scroll'>
          <div className='flex flex-col'>
            <p className='font-semibold'>{t('common.address')}</p>
            <p className='text-main-text-navy/80'>{mockPlaceData.address}</p>
          </div>
          <div className='flex flex-col'>
            <p className='font-semibold'>{t('common.description')}</p>
            <p className='text-main-text-navy/80 leading-relaxed'>
              {mockPlaceData.description}
            </p>
          </div>

          <div className='mb-3 flex items-center justify-between border-b border-gray-200 pb-3'>
            <h4 className='font-semibold text-gray-600'>
              {t('common.inquiry_and_info')}
            </h4>
            <a
              href={`tel:${mockPlaceData.phoneNumber}`}
              className='text-sub-green font-semibold hover:underline'
            >
              {mockPlaceData.phoneNumber}
            </a>
          </div>

          <h4 className='mb-3 font-semibold text-gray-600'>
            {t('places.available_hours')}
          </h4>
          <div className='space-y-2'>
            {processedHours.map(({ day, time }) => {
              const isToday = day === todayName;
              const isClosed = time === t('common.closed_days');
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
                        ? 'text-main-pink font-semibold'
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
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button className='mt-4'>{t('travel.add_to_plan')}</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PlaceDetailModal;
