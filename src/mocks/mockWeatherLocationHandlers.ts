import { http, HttpResponse } from 'msw';

// 날씨 앱에 맞는 지역 데이터 (기존 JSON 구조와 동일)
const mockLocationData = [
  {
    '1단계': '서울특별시',
    '2단계': '강남구',
    '격자 X': 61, // 강남구 대표 좌표
    '격자 Y': 126,
    stationName: '강남구',
    areaNo: 1168000000,
  },
  {
    '1단계': '서울특별시',
    '2단계': '강북구',
    '격자 X': 61, // 강북구 대표 좌표
    '격자 Y': 128,
    stationName: '강북구',
    areaNo: 1130500000,
  },
  {
    '1단계': '서울특별시',
    '2단계': '종로구',
    '격자 X': 60, // 종로구 대표 좌표
    '격자 Y': 127,
    stationName: '종로구',
    areaNo: 1111000000,
  },
  {
    '1단계': '부산광역시',
    '2단계': '해운대구',
    '격자 X': 99, // 해운대구 대표 좌표
    '격자 Y': 75,
    stationName: '해운대구',
    areaNo: 2612000000,
  },
  {
    '1단계': '부산광역시',
    '2단계': '동구',
    '격자 X': 97, // 동구 대표 좌표
    '격자 Y': 74,
    stationName: '부산',
    areaNo: 2600000000,
  },
  {
    '1단계': '대전광역시',
    '2단계': '서구',
    '격자 X': 67, // 서구 대표 좌표
    '격자 Y': 100,
    stationName: '대전',
    areaNo: 3017000000,
  },
  {
    '1단계': '대구광역시',
    '2단계': '중구',
    '격자 X': 89, // 중구 대표 좌표
    '격자 Y': 91,
    stationName: '대구',
    areaNo: 2711000000,
  },
  {
    '1단계': '인천광역시',
    '2단계': '연수구',
    '격자 X': 55, // 연수구 대표 좌표 유지
    '격자 Y': 124,
    stationName: '연수구',
    areaNo: 2817000000,
  },
  {
    '1단계': '경기도',
    '2단계': '수원시',
    '격자 X': 60,
    '격자 Y': 120,
    stationName: '수원',
    areaNo: 4111000000,
  },
  {
    '1단계': '경기도',
    '2단계': '성남시',
    '격자 X': 62,
    '격자 Y': 123,
    stationName: '성남',
    areaNo: 4113000000,
  },
  {
    '1단계': '강원도',
    '2단계': '춘천시',
    '격자 X': 73,
    '격자 Y': 134,
    stationName: '춘천',
    areaNo: 4211000000,
  },
  {
    '1단계': '제주특별자치도',
    '2단계': '제주시',
    '격자 X': 52,
    '격자 Y': 38,
    stationName: '제주',
    areaNo: 5011000000,
  },
];

export const mockWeatherLocationHandlers = [
  // 지역 검색 API
  http.get('/api/locations/search', ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('query')?.trim().toLowerCase();

    if (!query) {
      return HttpResponse.json({
        success: false,
        message: '검색어를 입력해주세요.',
      });
    }

    console.log('🔍 MSW 검색 쿼리:', query);

    let foundLocation = null;

    // 공백으로 구분된 검색 (예: "대전 서구", "서울 강남구")
    const queryParts = query.split(/\s+/);

    if (queryParts.length >= 2) {
      foundLocation = mockLocationData.find((loc) => {
        const cityMatch = loc['1단계']?.toLowerCase().includes(queryParts[0]);
        const districtMatch = loc['2단계']
          ?.toLowerCase()
          .includes(queryParts[1]);
        return cityMatch && districtMatch;
      });
    }

    // 1. 정확한 매치
    if (!foundLocation) {
      foundLocation = mockLocationData.find((loc) => {
        return (
          loc['1단계']?.toLowerCase() === query ||
          loc['2단계']?.toLowerCase() === query
        );
      });
    }

    // 2. 시작하는 매치
    if (!foundLocation) {
      foundLocation = mockLocationData.find((loc) => {
        return (
          loc['1단계']?.toLowerCase().startsWith(query) ||
          loc['2단계']?.toLowerCase().startsWith(query)
        );
      });
    }

    // 3. 포함하는 매치
    if (!foundLocation) {
      foundLocation = mockLocationData.find((loc) => {
        return (
          loc['1단계']?.toLowerCase().includes(query) ||
          loc['2단계']?.toLowerCase().includes(query)
        );
      });
    }

    console.log('🎯 MSW 검색 결과:', foundLocation);

    if (foundLocation) {
      // 표시명 생성
      let displayName = '';
      if (
        foundLocation['2단계'] &&
        (foundLocation['2단계'].toLowerCase().includes(query) ||
          queryParts.some((part) =>
            foundLocation['2단계']?.toLowerCase().includes(part)
          ))
      ) {
        displayName = `${foundLocation['1단계']} ${foundLocation['2단계']}`;
      } else {
        displayName = foundLocation['1단계'];
      }

      const enhancedLocation = {
        ...foundLocation,
        searchedQuery: query,
        displayName: displayName.trim(),
      };

      return HttpResponse.json({
        success: true,
        data: enhancedLocation,
      });
    } else {
      return HttpResponse.json({
        success: false,
        message: '해당 지역을 찾을 수 없습니다.',
      });
    }
  }),

  // 검색 추천 API
  http.get('/api/locations/suggestions', ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('query')?.trim().toLowerCase();

    if (!query) {
      // 기본 추천 검색어
      return HttpResponse.json({
        success: true,
        data: [
          '서울',
          '부산',
          '강남구',
          '해운대구',
          '제주도',
          '대전',
          '대구',
          '인천',
        ],
      });
    }

    const suggestions = new Set();

    mockLocationData.forEach((loc) => {
      // 1단계(시/도) 매치
      if (loc['1단계']?.toLowerCase().includes(query)) {
        suggestions.add(loc['1단계']);
      }

      // 2단계(구/군) 매치
      if (loc['2단계']?.toLowerCase().includes(query)) {
        suggestions.add(loc['2단계']);
        // 구/군이 매치되면 "시/도 + 구/군" 형태도 추가
        suggestions.add(`${loc['1단계']} ${loc['2단계']}`);
      }
    });

    // 정확도 순으로 정렬
    const sortedSuggestions = Array.from(suggestions).sort((a, b) => {
      const aStarts = a.toLowerCase().startsWith(query);
      const bStarts = b.toLowerCase().startsWith(query);

      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      return a.length - b.length;
    });

    return HttpResponse.json({
      success: true,
      data: sortedSuggestions.slice(0, 8),
    });
  }),

  // 전체 지역명 API
  http.get('/api/locations/all', () => {
    const names = new Set();

    mockLocationData.forEach((loc) => {
      if (loc['1단계']) names.add(loc['1단계']);
      if (loc['2단계']) names.add(loc['2단계']);
    });

    return HttpResponse.json({
      success: true,
      data: Array.from(names).sort(),
    });
  }),
];

// 사용법 예시:
// src/mocks/handlers.js에서
// export const handlers = [
//   ...mockWeatherLocationHandlers,
//   // 다른 핸들러들...
// ];
