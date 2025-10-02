import type { Place } from '@/api/planner/plannerType';
import { useEffect, useState } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

declare global {
  interface Window {
    kakao: any;
  }
}

type ItineraryMapProps = {
  places?: Place[];
};
/**
 * 카카오맵
 */
const ItineraryMap = ({ places = [] }: ItineraryMapProps) => {
  const [map, setMap] = useState<any>();
  const [isLoaded, setIsLoaded] = useState(false);

  // 지도의 경계를 장소들에 맞게 재설정
  useEffect(() => {
    if (!map || places.length === 0 || !window.kakao) return;

    const bounds = new window.kakao.maps.LatLngBounds();
    places.forEach((place) => {
      bounds.extend(
        new window.kakao.maps.LatLng(place.latitude, place.longitude)
      );
    });

    map.setBounds(bounds);
  }, [map, places]);

  // Kakao Maps SDK 로드 확인
  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      setIsLoaded(true);
    } else {
      console.error('Kakao Maps SDK가 로드되지 않았습니다.');
    }
  }, []);

  if (!isLoaded) {
    return (
      <div className='flex h-full w-full items-center justify-center bg-gray-100'>
        <p className='text-gray-500'>지도를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <Map
      center={{ lat: 37.5665, lng: 126.978 }}
      style={{ width: '100%', height: '100%' }}
      level={8}
      onCreate={setMap}
    >
      {places.map((place) => (
        <MapMarker
          key={place.id}
          position={{ lat: place.latitude, lng: place.longitude }}
          title={place.name}
        />
      ))}
    </Map>
  );
};

export default ItineraryMap;
