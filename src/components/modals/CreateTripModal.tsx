import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Modal from '@/components/common/Modal';
import SearchBar from '../common/searchBar/SearchBar';
import React, { useState } from 'react';

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

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header>여행 일정 만들기</Modal.Header>
      <Modal.Body>

        <div className='space-y-4'>
          {/* 여행 이름 입력 */}
          <div>
            <label className='mb-2 block text-base text-gray-700'>
              여행 이름
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
            <label className='mb-2 block text-base text-gray-700'>
              여행 설명
            </label>
            <textarea
              value={tripDescription}
              onChange={(e) => setTripDescription(e.target.value)}
              placeholder='여행에 대한 간단한 설명을 입력하세요'
              rows={3}
              className='ring-outline-gray placeholder:text-outline-gray focus:ring-main-pink shadow-light w-full rounded-lg border-0 px-4 py-4 ring-1 outline-none ring-inset focus:ring-2 focus:ring-inset resize-none'
            />
          </div>

          {/* 여행지 */}
          <div>
            <label className='mb-2 block text-base text-gray-700'>여행지</label>
            <SearchBar
              placeholder='여행지를 검색하세요 (예: 서울, 강남구)'
              className='w-full'
              height='h-12'
              showLocationIcon={true}
              onSearch={handleLocationSearch}
            />
          </div>

          {/* 즐겨찾는 지역 */}
          <div>
            <label className='mb-2 block text-base text-gray-700'>
              즐겨찾는 지역
            </label>
            <div className='flex flex-wrap gap-2'>
              {favoriteRegions.map((region) => (
                <Button
                  key={region}
                  onClick={() => handleRegionSelect(region)}
                  variant={selectedRegion === region ? 'active' : 'cancel'}
                  className={`rounded-full px-4 py-2 text-base w-auto`}
                >
                  {region}
                </Button>
              ))}
            </div>
          </div>

          {/* 검색 결과 */}
          {showResults && location && (
            <div>
              <div className='rounded-lg border border-gray-200 bg-gray-50 p-4 cursor-pointer hover:bg-gray-100'
                   onClick={() => {
                     setLocation(location);
                     setShowResults(false);
                   }}>
                <div className='mb-2 text-base font-medium text-gray-900'>
                  {location}구
                </div>
                <div className='text-base text-gray-500'>서울, {location}구</div>
              </div>
            </div>
          )}
          
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={handleSubmit}
          disabled={!tripName || !location}
          className='bg-sub-green hover:bg-sub-green/90 disabled:bg-gray-300 disabled:cursor-not-allowed'
        >
          일정 만들기
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateTripModal;
