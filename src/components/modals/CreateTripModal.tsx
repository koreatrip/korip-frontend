import React, { useState } from 'react';
import SearchBar from '../common/searchBar/SearchBar';

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tripData: TripData) => void;
}

interface TripData {
  tripName: string;
  tripDescription: string;
  location: string;
  selectedRegion: string;
}

const CreateTripModal: React.FC<CreateTripModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [tripName, setTripName] = useState('');
  const [tripDescription, setTripDescription] = useState('');
  const [location, setLocation] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [showResults, setShowResults] = useState(false);

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

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50' style={{ backgroundColor: '#2C3E5066' }}>
      <div className='fixed inset-0 top-0 h-full w-full overflow-y-auto bg-white shadow-2xl md:right-0 md:left-auto md:w-96'>
        {/* 헤더 */}
        <div className='flex items-center justify-between p-4 pb-3 md:p-6 md:pb-4'>
          <h2 className='text-base font-semibold text-gray-900 md:text-lg'>
            여행 일정 만들기
          </h2>
          <button
            onClick={onClose}
            className='flex h-8 w-8 items-center justify-center text-lg font-bold text-gray-500 hover:text-gray-700 md:h-10 md:w-10 md:text-xl'
          >
            ✕
          </button>
        </div>
        
        {/* 구분선 */}
        <div className='border-t border-gray-200'></div>

        <div className='px-4 pt-4 md:px-6 md:pt-6'>
          {/* 여행 이름 입력 */}
          <div className='mb-4 md:mb-6'>
            <label className='mb-2 block text-xs text-gray-700 md:text-sm'>
              여행 이름
            </label>
            <input
              type='text'
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              placeholder='예: 서울 여름 휴가'
              className='w-full rounded-lg border border-gray-200 bg-gray-50 p-2 text-xs placeholder-gray-400 focus:border-gray-300 focus:ring-0 focus:outline-none md:p-3 md:text-sm'
            />
          </div>

          {/* 여행 설명 입력 */}
          <div className='mb-4 md:mb-6'>
            <label className='mb-2 block text-xs text-gray-700 md:text-sm'>
              여행 설명
            </label>
            <textarea
              value={tripDescription}
              onChange={(e) => setTripDescription(e.target.value)}
              placeholder='여행에 대한 간단한 설명을 입력하세요'
              rows={2}
              className='w-full rounded-lg border border-gray-200 bg-gray-50 p-2 text-xs placeholder-gray-400 focus:border-gray-300 focus:ring-0 focus:outline-none resize-none md:rows-3 md:p-3 md:text-sm'
            />
          </div>

          {/* 여행지 */}
          <div className='mb-4 md:mb-6'>
            <label className='mb-2 block text-xs text-gray-700 md:text-sm'>여행지</label>
            <SearchBar
              placeholder='여행지를 검색하세요 (예: 서울, 강남구)'
              className='w-full'
              height='h-10 md:h-12'
              showLocationIcon={true}
              onSearch={handleLocationSearch}
            />
          </div>

          {/* 즐겨찾는 지역 */}
          <div className='mb-4 md:mb-6'>
            <label className='mb-2 block text-xs text-gray-700 md:mb-3 md:text-sm'>
              즐겨찾는 지역
            </label>
            <div className='flex flex-wrap gap-2'>
              {favoriteRegions.map((region) => (
                <button
                  key={region}
                  onClick={() => handleRegionSelect(region)}
                  className={`rounded-full border px-3 py-1 text-xs transition-all md:px-4 md:py-2 md:text-sm ${
                    selectedRegion === region
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          {/* 검색 결과 */}
          {showResults && location && (
            <div className='mb-4 md:mb-6'>
              <div className='rounded-lg border border-gray-200 bg-gray-50 p-3 cursor-pointer hover:bg-gray-100 md:p-4'
                   onClick={() => {
                     setLocation(location);
                     setShowResults(false);
                   }}>
                <div className='mb-1 text-xs font-medium text-gray-900 md:mb-2 md:text-sm'>
                  {location}구
                </div>
                <div className='text-xs text-gray-500'>서울, {location}구</div>
              </div>
            </div>
          )}
          
          {/* 일정 만들기 버튼 */}
          <div className='mb-4 pb-4 md:mb-6 md:pb-6'>
            <button
              onClick={handleSubmit}
              disabled={!tripName || !location}
              className='w-full rounded-lg bg-[#4A9B8E] py-2 text-sm font-medium text-white transition-colors hover:bg-[#3d8577] disabled:bg-gray-300 disabled:cursor-not-allowed md:py-3 md:text-base'
            >
              일정 만들기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTripModal;
