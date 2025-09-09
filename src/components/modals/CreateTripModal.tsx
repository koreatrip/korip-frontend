import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import SearchBar from '../domain/searchBar/SearchBar';
import Modal from '@/components/common/Modal';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useCreatePlanMutation } from '@/api/planner/plannerHooks';
import { type CreatePlanRequest } from '@/api/planner/plannerType';
import { useNumericSearchParam } from '@/hooks/useNumericSearchParam';
import { useToast } from '@/hooks/useToast';

type TCreateTripModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (planId: number) => void; // API 성공시 콜백 추가
  startDate: string; // 외부에서 설정된 시작일
  endDate: string; // 외부에서 설정된 종료일
};

type TTripData = {
  tripName: string;
  tripDescription: string;
  location: string;
  selectedRegion: string;
  subregionId: number;
};

const CreateTripModal = ({
  isOpen,
  onClose,
  onSuccess,
  startDate,
  endDate,
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
  const { showToast } = useToast();
  // URL 파라미터에서 지역 정보 가져오기
  const regionId = useNumericSearchParam('region_id');
  const subregionId = useNumericSearchParam('subregion_id');

  // 지역명 매핑 (실제로는 API에서 가져와야 하지만 임시로)
  const regionNames: Record<number, string> = {
    1: '서울특별시',
    2: '부산광역시',
    3: '대구광역시',
    4: '인천광역시',
    // 필요한 지역 추가
  };

  // 초기 지역 설정
  const initialLocation = useMemo(() => {
    if (!regionId) return '';

    const regionName = regionNames[regionId] || `지역 ${regionId}`;

    // subregionId가 있으면 함께 표시 (실제로는 API로 서브리전명을 가져와야 함)
    if (subregionId) {
      return `${regionName}의 구/군`;
    }

    return regionName;
  }, [regionId, subregionId]);

  // 초기값 설정
  useEffect(() => {
    if (initialLocation && !location) {
      setLocation(initialLocation);
    }
  }, [initialLocation, location]);

  // 여행 계획 생성 API 훅
  const createPlanMutation = useCreatePlanMutation({
    onSuccess: (data) => {
      console.log('여행 계획 생성 성공:', data.id);
      showToast(
        '새로운 일정이 생성되었습니다. 내 여행 일정에서 여행 계획을 세워보세요!',
        'success'
      );
      onSuccess?.(data.id);
      handleClose();
    },
    onError: (error) => {
      console.error('여행 계획 생성 실패:', error);
      // 여기에서 에러 토스트나 알림을 표시할 수 있습니다
    },
  });

  // 즐겨찾는 지역 데이터 (subregion_id 포함) - fallback용
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
    // 화면에 표시할 텍스트 설정
    const locationText = subregion
      ? `${region.name} ${subregion.name}`
      : region.name;

    setLocation(locationText);

    // API 호출용 ID 저장
    setSelectedRegionData({
      regionId: region.id,
      subregionId: subregion?.id,
    });

    console.log('선택된 지역:', { region, subregion });
  };

  const handleSubmit = () => {
    console.log('=== handleSubmit 시작 ===');
    console.log('tripName:', tripName);
    console.log('location:', location);
    console.log('startDate:', startDate);
    console.log('endDate:', endDate);
    console.log('selectedRegionData:', selectedRegionData);

    if (tripName && location) {
      console.log('✅ 조건 통과 - API 호출 준비');

      let apiSubregionId =
        selectedRegionData?.subregionId ||
        selectedRegionData?.regionId ||
        subregionId ||
        regionId ||
        1;

      console.log('최종 apiSubregionId:', apiSubregionId);

      const planData: CreatePlanRequest = {
        name: tripName,
        description: tripDescription,
        destination: location,
        subregion_id: apiSubregionId,
        // start_date: startDate,
        // end_date: endDate,
      };

      console.log('API 호출 데이터:', planData);
      console.log('mutation 상태:', createPlanMutation.status);

      createPlanMutation.mutate(planData);
      console.log('mutate 호출함');
    } else {
      console.log('❌ 조건 실패 - 필수 필드 누락');
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
    // 폼 초기화
    setTripName('');
    setTripDescription('');
    setLocation('');
    setSelectedRegion('');
    setShowResults(false);
    onClose();
  };

  // 폼 렌더링 함수 - 렌더링 시마다 새로 생성되지 않도록 메모이제이션
  const renderFormContent = (isMobile = false) => (
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
          disableNavigation={true} // 🔥 URL 변경 막기
          onRegionSelect={handleRegionSelectFromSearchBar} // 🔥 지역 선택 콜백
          onSearch={handleLocationSearch} // 텍스트 검색용
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
                <div className='p-6'>{renderFormContent(false)}</div>
              </div>

              {/* 하단 고정 버튼 영역 */}
              <div className='border-outline-gray flex-shrink-0 border-t p-6'>
                <div className='flex gap-3'>
                  <Button
                    onClick={handleClose}
                    variant='cancel'
                    className='h-12 flex-1 text-base font-medium'
                    disabled={createPlanMutation.isPending}
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={
                      !tripName || !location || createPlanMutation.isPending
                    }
                    className='bg-sub-green hover:bg-sub-green/90 h-12 flex-1 text-base font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500'
                  >
                    {createPlanMutation.isPending
                      ? '생성 중...'
                      : t('travel.add_to_plan')}
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

          <Modal.Body>{renderFormContent(true)}</Modal.Body>

          <Modal.Footer>
            <Button
              onClick={handleClose}
              variant='cancel'
              className='mr-3'
              disabled={createPlanMutation.isPending}
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!tripName || !location || createPlanMutation.isPending}
              className='bg-sub-green hover:bg-sub-green/90 text-white disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500'
            >
              {createPlanMutation.isPending
                ? '생성 중...'
                : t('travel.add_to_plan')}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default CreateTripModal;
