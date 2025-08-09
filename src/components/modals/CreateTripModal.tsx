import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import SearchBar from '../common/searchBar/SearchBar';
import Modal from '@/components/common/Modal';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type TCreateTripModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tripData: TTripData) => void;
};

type TTripData = {
  tripName: string;
  tripDescription: string;
  location: string;
  selectedRegion: string;
};

const CreateTripModal = ({
  isOpen,
  onClose,
  onSubmit,
}: TCreateTripModalProps) => {
  const [tripName, setTripName] = useState('');
  const [tripDescription, setTripDescription] = useState('');
  const [location, setLocation] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [showResults, setShowResults] = useState(false);

  const { t } = useTranslation();

  // 즐겨찾는 지역 데이터
  const favoriteRegions = ['서울', '광주', '제주도'];

  const handleSubmit = () => {
    if (tripName && location) {
      onSubmit({
        tripName,
        tripDescription,
        location,
        selectedRegion,
      });
      // 폼 초기화
      setTripName('');
      setTripDescription('');
      setLocation('');
      setSelectedRegion('');
      setShowResults(false);
      onClose();
    }
  };

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
    setLocation(region);
    setShowResults(true);
  };

  const handleLocationSearch = (value: string) => {
    setLocation(value);
    if (value.trim()) {
      setShowResults(true);
    }
  };

  const handleClose = () => {
    // 폼 초기화
    setTripName('');
    setTripDescription('');
    setLocation('');
    setSelectedRegion('');
    setShowResults(false);
    onClose();
  };

  // 공통 폼 컨텐츠
  const FormContent = ({ isMobile = false }) => (
    <div className={`space-y-${isMobile ? '4' : '6'}`}>
      {/* 여행 이름 입력 */}
      <div>
        <label
          className={`mb-2 block ${isMobile ? 'text-sm' : 'text-base'} text-main-text-navy font-medium`}
        >
          {t('travel.travel_name')}
        </label>
        <Input
          type='text'
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
          placeholder='예: 서울 여름 휴가'
        />
      </div>

      {/* 여행 설명 입력 */}
      <div>
        <label
          className={`mb-2 block ${isMobile ? 'text-sm' : 'text-base'} text-main-text-navy font-medium`}
        >
          {t('travel.travel_description')}
        </label>
        <textarea
          value={tripDescription}
          onChange={(e) => setTripDescription(e.target.value)}
          placeholder={t('travel.enter_travel_description')}
          rows={isMobile ? 2 : 3}
          className={`ring-outline-gray placeholder:text-sub-text-gray focus:ring-main-pink shadow-light w-full rounded-lg border-0 ${isMobile ? 'px-3 py-3 text-sm' : 'px-4 py-4 text-base'} resize-none ring-1 outline-none ring-inset focus:ring-2 focus:ring-inset`}
        />
      </div>

      {/* 여행지 */}
      <div>
        <label
          className={`mb-2 block ${isMobile ? 'text-sm' : 'text-base'} text-main-text-navy font-medium`}
        >
          {t('travel.destination')}
        </label>
        <SearchBar
          placeholder={
            isMobile
              ? t('travel.search_destination')
              : t('places.search_region_placeholder')
          }
          className='w-full'
          height={isMobile ? 'h-10' : 'h-12'}
          showLocationIcon={true}
          onSearch={handleLocationSearch}
        />
      </div>

      {/* 즐겨찾는 지역 */}
      <div className='mb-6'>
        <label
          className={`mb-${isMobile ? '2' : '3'} block ${isMobile ? 'text-sm' : 'text-base'} text-main-text-navy font-medium`}
        >
          {t('places.favorite_regions')}
        </label>
        <div className='flex flex-wrap gap-2'>
          {favoriteRegions.map((region) => (
            <Button
              key={region}
              onClick={() => handleRegionSelect(region)}
              variant={selectedRegion === region ? 'active' : 'cancel'}
              className={`rounded-full ${isMobile ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'} w-auto font-medium transition-all duration-200`}
            >
              {region}
            </Button>
          ))}
        </div>
      </div>

      {/* 검색 결과 */}
      {showResults && location && (
        <div className='mb-6'>
          <label
            className={`mb-2 block ${isMobile ? 'text-sm' : 'text-base'} text-main-text-navy font-medium`}
          >
            검색 결과
          </label>
          <div
            className={`border-outline-gray bg-bg-section rounded-lg border ${isMobile ? 'p-3' : 'p-4'} hover:bg-hover-gray cursor-pointer transition-colors`}
            onClick={() => {
              setLocation(location);
              setShowResults(false);
            }}
          >
            <div
              className={`mb-1 ${isMobile ? 'text-sm' : 'text-base'} text-main-text-navy font-medium`}
            >
              {location}구
            </div>
            <div
              className={`${isMobile ? 'text-xs' : 'text-sm'} text-sub-text-gray`}
            >
              서울, {location}구
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* 데스크톱/태블릿: 사이드 패널 */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 오버레이 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className='tablet-bp:block bg-main-text-navy/40 bg-opacity-50 fixed inset-0 z-40 hidden'
              onClick={handleClose}
            />

            {/* 사이드 패널 */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className='tablet-bp:flex bg-bg-white fixed top-0 right-0 z-50 hidden h-full w-96 flex-col shadow-xl'
            >
              {/* 헤더 */}
              <div className='border-outline-gray flex flex-shrink-0 items-center justify-between border-b p-6'>
                <h2 className='text-main-text-navy text-xl font-semibold'>
                  {t('travel.create_travel_schedule')}
                </h2>
                <button
                  onClick={handleClose}
                  className='hover:bg-hover-gray rounded-lg p-2 transition-colors'
                >
                  <XMarkIcon className='text-sub-text-gray h-6 w-6' />
                </button>
              </div>

              {/* 스크롤 가능한 컨텐츠 영역 */}
              <div className='flex-1 overflow-y-auto'>
                <div className='p-6'>
                  <FormContent isMobile={false} />
                </div>
              </div>

              {/* 하단 고정 버튼 영역 */}
              <div className='border-outline-gray flex-shrink-0 border-t p-6'>
                <div className='flex gap-3'>
                  <Button
                    onClick={handleClose}
                    variant='cancel'
                    className='h-12 flex-1 text-base font-medium'
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!tripName || !location}
                    className='bg-sub-green hover:bg-sub-green/90 h-12 flex-1 text-base font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500'
                  >
                    {t('travel.add_to_plan')}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 모바일: 기존 Modal 컴포넌트 사용 */}
      <div className='tablet-bp:hidden'>
        <Modal isOpen={isOpen} onClose={handleClose}>
          <Modal.Header> {t('travel.travel_name')}</Modal.Header>

          <Modal.Body>
            <FormContent isMobile={true} />
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={handleClose} variant='cancel' className='mr-3'>
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!tripName || !location}
              className='bg-sub-green hover:bg-sub-green/90 text-white disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500'
            >
              {t('travel.add_to_plan')}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default CreateTripModal;
