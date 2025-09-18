import type { PlannerPlace } from '@/types/plannerType';
import { useEffect, useState } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
declare global {
  interface Window {
    kakao: any;
  }
}

type ItineraryMapProps = {
  places: PlannerPlace[]; // 표시할 장소 목록을 props로 받습니다.
};

const ItineraryMap = ({ places }: ItineraryMapProps) => {
  const [map, setMap] = useState<any>();

  // 지도의 경계를 장소들에 맞게 재설정하는 로직
  useEffect(() => {
    if (!map || places.length === 0) return;

    // 장소들의 좌표로 LatLngBounds 객체를 생성합니다.
    const bounds = new window.kakao.maps.LatLngBounds();
    places.forEach((/* place */) => {
      // place 객체에 위도(lat), 경도(lng)가 있다고 가정합니다.
      // 실제 데이터 구조에 맞게 수정해야 합니다.
      // 예시: bounds.extend(new window.kakao.maps.LatLng(place.lat, place.lng));
    });

    // 생성한 LatLngBounds 객체로 지도의 경계를 조정합니다.
    map.setBounds(bounds);
  }, [map, places]);
  return (
    <Map
      center={{ lat: 37.5665, lng: 126.978 }} // 기본 중심 좌표 (서울)
      style={{ width: '100%', height: '100%' }}
      level={8}
      // Map 인스턴스를 state에 저장합니다.
      onCreate={setMap}
    >
      {places.map((place) => (
        <MapMarker
          key={place.id}
          position={{ lat: /* place.lat */ 24, lng: /*  place.lng */ 22 }} // 실제 데이터 구조에 맞게 수정
          title={place.title}
        />
      ))}
    </Map>
  );
};

export default ItineraryMap;
