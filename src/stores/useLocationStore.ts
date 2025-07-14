import { create } from 'zustand';
import { locationAPI } from '@/api/locations/locationAPI';
import type { Location } from '@/api/locations/locationType';

type LocationState = {
  activeLocation: Location | null;
  userLocation: Location | null; // 사용자의 실제 위치 (GPS 기반)
  hasLocationPermission: boolean;
  isLocationLoading: boolean;
  searchAndSetLocation: (
    query: string,
    showToast: (
      message: string,
      type?: 'error' | 'success' | 'info' | 'warning'
    ) => void
  ) => Promise<void>;
  setActiveLocation: (location: Location) => void;
  initializeLocation: (showToast: any) => Promise<void>;
  requestUserLocation: (showToast: any) => Promise<void>;
  setDefaultSeoulLocation: (showToast: any) => Promise<void>;
  getSuggestions: (query: string) => Promise<string[]>;
  getAllLocationNames: () => Promise<string[]>;
};

export const useLocationStore = create<LocationState>((set, get) => ({
  activeLocation: null,
  userLocation: null,
  hasLocationPermission: false,
  isLocationLoading: false,

  setActiveLocation: (location) => set({ activeLocation: location }),

  // 앱 초기화 시 위치 설정 로직
  initializeLocation: async (showToast) => {
    set({ isLocationLoading: true });

    try {
      // 1순위: 저장된 사용자 위치 확인
      const savedLocation = localStorage.getItem('userLocation');
      const hasPermission =
        localStorage.getItem('locationPermission') === 'granted';

      if (hasPermission && savedLocation) {
        const userLoc = JSON.parse(savedLocation);
        set({
          userLocation: userLoc,
          activeLocation: userLoc,
          hasLocationPermission: true,
        });
        console.log('✅ 저장된 사용자 위치 복원:', userLoc);
        return;
      }

      // 2순위: 위치 권한 요청
      if ('geolocation' in navigator) {
        await get().requestUserLocation(showToast);
      } else {
        // 3순위: 기본값 (서울시 종로구) 설정
        await get().setDefaultSeoulLocation(showToast);
      }
    } catch (error) {
      console.error('위치 초기화 실패:', error);
      await get().setDefaultSeoulLocation(showToast);
    } finally {
      set({ isLocationLoading: false });
    }
  },

  // 사용자 실제 위치 요청
  requestUserLocation: async (showToast) => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;

            // 좌표를 주소로 변환하는 API 호출
            const result = await locationAPI.getLocationByCoords(
              latitude,
              longitude
            );

            if (result.success && result.data) {
              const userLoc = {
                ...result.data,
                isUserLocation: true,
                coords: { lat: latitude, lng: longitude },
              };

              // 사용자 위치 저장
              localStorage.setItem('userLocation', JSON.stringify(userLoc));
              localStorage.setItem('locationPermission', 'granted');

              set({
                userLocation: userLoc,
                activeLocation: userLoc,
                hasLocationPermission: true,
              });

              showToast(
                `현재 위치 ${userLoc.displayName}로 설정되었습니다.`,
                'success'
              );
              resolve();
            } else {
              throw new Error('좌표 변환 실패');
            }
          } catch (error) {
            console.error('위치 변환 실패:', error);
            await get().setDefaultSeoulLocation(showToast);
            reject(error);
          }
        },
        async (error) => {
          console.log('위치 권한 거부 또는 실패:', error);
          localStorage.setItem('locationPermission', 'denied');

          // 권한 거부 시 기본값으로 설정
          await get().setDefaultSeoulLocation(showToast);
          resolve(); // 에러가 아닌 정상 처리로 간주
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5분
        }
      );
    });
  },

  // 기본값 (서울시 종로구) 설정
  setDefaultSeoulLocation: async (showToast) => {
    try {
      const result = await locationAPI.searchLocation('종로구');

      if (result.success && result.data) {
        const defaultLocation = {
          ...result.data,
          isDefault: true,
        };

        set({ activeLocation: defaultLocation });
        console.log('✅ 기본 위치(종로구) 설정 완료:', defaultLocation);

        // 위치 권한이 없을 때만 안내 메시지 표시
        if (!get().hasLocationPermission) {
          showToast(
            '위치 권한이 없어 서울시 종로구 정보를 보여드립니다.',
            'info'
          );
        }
      }
    } catch (error) {
      console.error('기본 위치 설정 실패:', error);
      showToast('위치 설정에 실패했습니다.', 'error');
    }
  },

  searchAndSetLocation: async (query, showToast) => {
    try {
      console.log('🔍 검색 쿼리:', query);

      const result = await locationAPI.searchLocation(query);

      if (result.success && result.data) {
        const foundLocation = {
          ...result.data,
          isSearched: true,
          searchedQuery: query,
        };

        set({ activeLocation: foundLocation });
        showToast(
          `${foundLocation.displayName}으로 위치가 변경되었습니다.`,
          'success'
        );
      } else {
        showToast(result.message || '해당 지역을 찾을 수 없습니다.', 'error');
      }
    } catch (error) {
      console.error('지역 검색 실패:', error);
      showToast('지역 검색에 실패했습니다.', 'error');
    }
  },

  getSuggestions: async (query: string): Promise<string[]> => {
    try {
      const result = await locationAPI.getLocationSuggestions(query);
      return result.success ? result.data : [];
    } catch (error) {
      console.error('추천 검색어 조회 실패:', error);
      return [];
    }
  },

  getAllLocationNames: async (): Promise<string[]> => {
    try {
      const result = await locationAPI.getAllLocationNames();
      return result.success ? result.data : [];
    } catch (error) {
      console.error('전체 지역명 조회 실패:', error);
      return [];
    }
  },
}));
