import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import SearchBar from '../domain/searchBar/SearchBar';
import Modal from '@/components/common/Modal';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNumericSearchParam } from '@/hooks/useNumericSearchParam';

type TCreateTripModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tripData: TTripData) => void;
  isPending?: boolean;
};

export type TTripData = {
  tripName: string;
  tripDescription: string;
  location: string;
  selectedRegion: string;
  subregionId: number;
};

const CreateTripModal = ({
  isOpen,
  onClose,
  onSubmit,
  isPending = false,
}: TCreateTripModalProps) => {
  const [tripName, setTripName] = useState('');
  const [tripDescription, setTripDescription] = useState('');
  const [location, setLocation] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedRegionData, setSelectedRegionData] = useState<{
    regionId: number;
    subregionId?: number;
  } | null>(null);

  const { t } = useTranslation();
  const regionId = useNumericSearchParam('region_id');
  const subregionId = useNumericSearchParam('subregion_id');

  const regionNames: Record<number, string> = {
    1: '서울특별시',
    2: '부산광역시',
    3: '대구광역시',
    4: '인천광역시',
  };

  const initialLocation = useMemo(() => {
    if (!regionId) return '';
    const regionName = regionNames[regionId] || `지역 ${regionId}`;
    if (subregionId) {
      return `${regionName}의 구/군`;
    }
    return regionName;
  }, [regionId, subregionId]);

  useEffect(() => {
    if (initialLocation && !location) {
      setLocation(initialLocation);
    }
  }, [initialLocation, location]);

  const favoriteRegions = useMemo(
    () => [
      { name: '서울특별시', id: 1 },
      { name: '부산광역시', id: 2 },
      { name: '대구광역시', id: 3 },
    ],
    []
  );

  const handleRegionSelectFromSearchBar = (
    region: { id: number; name: string },
    subregion?: { id: number; name: string }
  ) => {
    const locationText = subregion
      ? `${region.name} ${subregion.name}`
      : region.name;

    setLocation(locationText);
    setSelectedRegionData({
      regionId: region.id,
      subregionId: subregion?.id,
    });
  };

  const handleSubmit = () => {
    if (tripName && location) {
      let apiSubregionId =
        selectedRegionData?.subregionId ||
        selectedRegionData?.regionId ||
        subregionId ||
        regionId ||
        1;

      const tripData: TTripData = {
        tripName,
        tripDescription,
        location,
        selectedRegion: String(apiSubregionId),
        subregionId: apiSubregionId,
      };

      onSubmit(tripData);
      // 제출 후 폼 초기화
      resetForm();
    }
  };

  const handleRegionSelect = (region: { name: string; id: number }) => {
    setSelectedRegion(region.name);
    setLocation(region.name);
    setShowResults(true);
  };

  const handleLocationSearch = (value: string) => {
    setLocation(value);
    if (value.trim()) {
      setShowResults(true);
    }
  };

  const handleClose = () => {
    setTripName('');
    setTripDescription('');
    setLocation('');
    setSelectedRegion('');
    setShowResults(false);
    resetForm();
    onClose();
  };

  // 폼 초기화 함수 분리
  const resetForm = () => {
    setTripName('');
    setTripDescription('');
    setLocation('');
    setSelectedRegion('');
    setShowResults(false);
    setSelectedRegionData(null);
  };

  const renderFormContent = (isMobile = false) => (
    <div className={`space-y-${isMobile ? '4' : '6'}`}>
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
          disableNavigation={true}
          onRegionSelect={handleRegionSelectFromSearchBar}
          onSearch={handleLocationSearch}
        />
      </div>

      <div className='mb-6'>
        <label
          className={`mb-${isMobile ? '2' : '3'} block ${isMobile ? 'text-sm' : 'text-base'} text-main-text-navy font-medium`}
        >
          {t('places.favorite_regions')}
        </label>
        <div className='flex flex-wrap gap-2'>
          {favoriteRegions.map((region) => (
            <Button
              key={region.id}
              onClick={() => handleRegionSelect(region)}
              variant={selectedRegion === region.name ? 'active' : 'cancel'}
              className={`rounded-full ${isMobile ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'} w-auto font-medium transition-all duration-200`}
            >
              {region.name}
            </Button>
          ))}
        </div>
      </div>

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
              {location}
            </div>
            <div
              className={`${isMobile ? 'text-xs' : 'text-sm'} text-sub-text-gray`}
            >
              선택된 지역
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className='tablet-bp:block bg-main-text-navy/40 bg-opacity-50 fixed inset-0 z-40 hidden'
              onClick={handleClose}
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className='tablet-bp:flex bg-bg-white fixed top-0 right-0 z-50 hidden h-full w-96 flex-col shadow-xl'
            >
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

              <div className='flex-1 overflow-y-auto'>
                <div className='p-6'>{renderFormContent(false)}</div>
              </div>

              <div className='border-outline-gray flex-shrink-0 border-t p-6'>
                <div className='flex gap-3'>
                  <Button
                    onClick={handleClose}
                    variant='cancel'
                    className='h-12 flex-1 text-base font-medium'
                    disabled={isPending}
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!tripName || !location || isPending}
                    className='bg-sub-green hover:bg-sub-green/90 h-12 flex-1 text-base font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500'
                  >
                    {isPending ? '생성 중...' : t('travel.add_to_plan')}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className='tablet-bp:hidden'>
        <Modal isOpen={isOpen} onClose={handleClose}>
          <Modal.Header>{t('travel.travel_name')}</Modal.Header>
          <Modal.Body>{renderFormContent(true)}</Modal.Body>
          <Modal.Footer>
            <Button
              onClick={handleClose}
              variant='cancel'
              className='mr-3'
              disabled={isPending}
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!tripName || !location || isPending}
              className='bg-sub-green hover:bg-sub-green/90 text-white disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500'
            >
              {isPending ? '생성 중...' : t('travel.add_to_plan')}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default CreateTripModal;
