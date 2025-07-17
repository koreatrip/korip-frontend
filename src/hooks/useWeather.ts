import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  getBaseDateTime,
  getSkyState,
  getWindDirection,
  getSunriseTime,
} from '../utils/weatherUtils';
// import type { Location } from '../stores/useLocationStore';
import type { Location } from '@/api/locations/locationType';

const API_KEY = decodeURIComponent(import.meta.env.VITE_API_KEY || '');

type WeatherItem = {
  category: string;
  fcstValue: string;
  fcstDate: string;
  fcstTime: string;
};

type HourlyData = {
  time: string;
  icon: string;
  temp: string;
  pop?: string;
};

type WeatherDetail = {
  label: string;
  value: string;
};

type TomorrowWeather = {
  minTemp: string;
  maxTemp: string;
  am: {
    sky: string;
    pop: string;
  };
  pm: {
    sky: string;
    pop: string;
  };
};

type CurrentWeather = {
  temp: string;
  sky: string;
  minTemp: string;
  maxTemp: string;
  tempDiff: number | null;
};

type AirQualityData = {
  pm10: { grade: string; value: string };
  pm25: { grade: string; value: string };
};

export type WeatherData = {
  current: CurrentWeather;
  tomorrow: TomorrowWeather;
  hourly: HourlyData[];
  details: WeatherDetail[];
  airQuality: AirQualityData;
};

// 초단기예보 기준 시간 계산 함수
const getUltraSrtBaseTime = () => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // 초단기예보는 매시간 45분에 발표되므로, 45분 이전이면 이전 시간을 기준으로 함
  let baseHour = currentHour;
  if (currentMinute < 45) {
    baseHour = currentHour - 1;
    if (baseHour < 0) {
      baseHour = 23;
      now.setDate(now.getDate() - 1);
    }
  }

  const baseDate = now.toISOString().slice(0, 10).replace(/-/g, '');
  const baseTime = `${baseHour.toString().padStart(2, '0')}30`; // 30분 기준

  return { baseDate, baseTime };
};

const useWeather = (location: Location | null) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!location || !location['격자 X']) {
      setLoading(false);
      return;
    }

    console.log('✅ 5. useWeather 훅: API 호출 시작 직전 location', location);
    console.log('API 키 확인:', API_KEY ? 'API 키 있음' : 'API 키 없음');

    const fetchAllData = async () => {
      setLoading(true);
      setError(null);

      try {
        const { baseDate, baseTime, yesterdayDate, currentHour } =
          getBaseDateTime();
        const ultraSrtBaseTime = getUltraSrtBaseTime();
        const { '격자 X': nx, '격자 Y': ny, stationName, areaNo } = location;

        const tomorrowDate = new Date(
          new Date().setDate(new Date().getDate() + 1)
        )
          .toISOString()
          .slice(0, 10)
          .replace(/-/g, '');

        console.log('API 호출 파라미터:', {
          baseDate,
          baseTime,
          ultraSrtBaseTime,
          nx,
          ny,
          stationName,
          areaNo,
        });

        // API URLs 구성
        const weatherUrl = `/api/weather/getVilageFcst`;
        const ultraSrtUrl = `/api/weather/getUltraSrtFcst`; // 초단기예보 API 추가
        const uvUrl = `/api/uv/getUVIdxV4`;
        const asosUrl = `/api/asos/getWthrDataList`;
        const airUrl = `/api/air/getMsrstnAcctoRltmMesureDnsty`;

        // 단기예보 API 호출
        const weatherParams = {
          serviceKey: API_KEY,
          pageNo: 1,
          numOfRows: 1000,
          dataType: 'JSON',
          base_date: baseDate,
          base_time: baseTime,
          nx: nx,
          ny: ny,
        };

        // 초단기예보 API 호출 파라미터
        const ultraSrtParams = {
          serviceKey: API_KEY,
          pageNo: 1,
          numOfRows: 60,
          dataType: 'JSON',
          base_date: ultraSrtBaseTime.baseDate,
          base_time: ultraSrtBaseTime.baseTime,
          nx: nx,
          ny: ny,
        };

        console.log('단기예보 API 호출 중...');
        const weatherRes = await axios.get(weatherUrl, {
          params: weatherParams,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });

        console.log('초단기예보 API 호출 중...');
        const ultraSrtRes = await axios.get(ultraSrtUrl, {
          params: ultraSrtParams,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });

        console.log('단기예보 API 응답:', weatherRes.data);
        console.log('초단기예보 API 응답:', ultraSrtRes.data);

        // API 응답 체크
        if (!weatherRes.data.response?.body?.items?.item) {
          throw new Error('단기예보 API에서 데이터를 받아오지 못했습니다.');
        }

        const items: WeatherItem[] = weatherRes.data.response.body.items.item;
        const ultraSrtItems: WeatherItem[] =
          ultraSrtRes.data.response?.body?.items?.item || [];

        console.log('받은 날씨 아이템 수:', items.length);
        console.log('받은 초단기예보 아이템 수:', ultraSrtItems.length);

        // 현재 시간에 가장 가까운 초단기예보 데이터 찾기
        const now = new Date();
        const currentFcstTime = `${now.getHours().toString().padStart(2, '0')}00`;
        const currentDate = now.toISOString().slice(0, 10).replace(/-/g, '');

        const currentUltraSrtItems = ultraSrtItems.filter(
          (item) =>
            item.fcstDate === currentDate && item.fcstTime === currentFcstTime
        );

        // 현재 시간 데이터가 없으면 다음 시간 데이터 사용
        const nextHourFcstTime = `${((now.getHours() + 1) % 24).toString().padStart(2, '0')}00`;
        const fallbackUltraSrtItems = ultraSrtItems.filter(
          (item) =>
            item.fcstDate === currentDate && item.fcstTime === nextHourFcstTime
        );

        const activeUltraSrtItems =
          currentUltraSrtItems.length > 0
            ? currentUltraSrtItems
            : fallbackUltraSrtItems;

        console.log(
          '현재 시간 초단기예보 아이템 수:',
          activeUltraSrtItems.length
        );

        // 오늘과 내일 데이터 필터링
        const todayItems = items.filter((item) => item.fcstDate === baseDate);
        const currentHourItems = todayItems.filter(
          (item) => item.fcstTime === currentHour
        );
        const tomorrowItems = items.filter((i) => i.fcstDate === tomorrowDate);

        console.log('오늘 아이템 수:', todayItems.length);
        console.log('현재 시간 아이템 수:', currentHourItems.length);
        console.log('내일 아이템 수:', tomorrowItems.length);

        // 현재 날씨 데이터 추출
        const currentTemp =
          currentHourItems.find((i) => i.category === 'TMP')?.fcstValue || '';
        const currentSkyData = getSkyState(
          currentHourItems.find((i) => i.category === 'SKY')?.fcstValue || '',
          currentHourItems.find((i) => i.category === 'PTY')?.fcstValue || ''
        );
        const todayMin =
          todayItems.find((i) => i.category === 'TMN')?.fcstValue || '';
        const todayMax =
          todayItems.find((i) => i.category === 'TMX')?.fcstValue || '';

        // 내일 날씨 데이터 추출
        const tomorrowMin =
          tomorrowItems.find((i) => i.category === 'TMN')?.fcstValue || '';
        const tomorrowMax =
          tomorrowItems.find((i) => i.category === 'TMX')?.fcstValue || '';

        const tomorrowAmSkyData = getSkyState(
          tomorrowItems.find(
            (i) => i.fcstTime === '0900' && i.category === 'SKY'
          )?.fcstValue || '',
          tomorrowItems.find(
            (i) => i.fcstTime === '0900' && i.category === 'PTY'
          )?.fcstValue || ''
        );
        const tomorrowAmPop =
          tomorrowItems.find(
            (i) => i.fcstTime === '0900' && i.category === 'POP'
          )?.fcstValue || '0';

        const tomorrowPmSkyData = getSkyState(
          tomorrowItems.find(
            (i) => i.fcstTime === '1500' && i.category === 'SKY'
          )?.fcstValue || '',
          tomorrowItems.find(
            (i) => i.fcstTime === '1500' && i.category === 'PTY'
          )?.fcstValue || ''
        );
        const tomorrowPmPop =
          tomorrowItems.find(
            (i) => i.fcstTime === '1500' && i.category === 'POP'
          )?.fcstValue || '0';

        // 시간별 예보 데이터 구성
        const hourly: HourlyData[] = [];
        for (let i = 0; i < 24; i++) {
          const forecastTime = new Date();
          forecastTime.setHours(forecastTime.getHours() + i);
          const fcstTime = `${forecastTime.getHours().toString().padStart(2, '0')}00`;
          const fcstDate = forecastTime
            .toISOString()
            .slice(0, 10)
            .replace(/-/g, '');

          const hourlyItemsOnTime = items.filter(
            (item) => item.fcstDate === fcstDate && item.fcstTime === fcstTime
          );

          if (hourlyItemsOnTime.length > 0) {
            const skyData = getSkyState(
              hourlyItemsOnTime.find((i) => i.category === 'SKY')?.fcstValue ||
                '',
              hourlyItemsOnTime.find((i) => i.category === 'PTY')?.fcstValue ||
                ''
            );
            hourly.push({
              time: `${forecastTime.getHours()}시`,
              icon: skyData.icon,
              temp:
                hourlyItemsOnTime.find((i) => i.category === 'TMP')
                  ?.fcstValue || '',
              pop: hourlyItemsOnTime.find((i) => i.category === 'POP')
                ?.fcstValue,
            });
          }
        }

        // 습도 데이터 우선순위: 초단기예보 > 단기예보
        const humidityFromUltraSrt = activeUltraSrtItems.find(
          (i) => i.category === 'REH'
        )?.fcstValue;
        const humidityFromShortTerm = currentHourItems.find(
          (i) => i.category === 'REH'
        )?.fcstValue;
        const currentHumidity =
          humidityFromUltraSrt || humidityFromShortTerm || '';

        console.log('습도 데이터:', {
          초단기예보: humidityFromUltraSrt,
          단기예보: humidityFromShortTerm,
          최종선택: currentHumidity,
        });

        // 상세 정보 구성 (6개) - 초단기예보 습도 사용
        const windDirection =
          currentHourItems.find((i) => i.category === 'VEC')?.fcstValue || '';
        const windDirectionText = getWindDirection(windDirection);

        const details: WeatherDetail[] = [
          {
            label: '습도',
            value: currentHumidity ? currentHumidity + '%' : '-%',
          },
          {
            label: '바람',
            value:
              currentHourItems.find((i) => i.category === 'WSD')?.fcstValue +
                'm/s' || '-%',
          },
          {
            label: '체감온도',
            value: currentTemp + '°',
          },
          {
            label: '자외선',
            value: '-', // 기본값, 나중에 업데이트
          },
          {
            label: '풍향',
            value: windDirectionText || '-%',
          },
          {
            label: '일출',
            value: getSunriseTime() || '-%',
          },
        ];

        // 기본 날씨 데이터 구성
        const baseWeatherData: WeatherData = {
          current: {
            temp: currentTemp,
            sky: currentSkyData.text,
            minTemp: todayMin,
            maxTemp: todayMax,
            tempDiff: null,
          },
          tomorrow: {
            minTemp: tomorrowMin,
            maxTemp: tomorrowMax,
            am: {
              sky: tomorrowAmSkyData.text,
              pop: tomorrowAmPop,
            },
            pm: {
              sky: tomorrowPmSkyData.text,
              pop: tomorrowPmPop,
            },
          },
          hourly,
          details,
          airQuality: {
            pm10: { grade: '1', value: '-' },
            pm25: { grade: '1', value: '-' },
          },
        };

        console.log('기본 날씨 데이터 구성 완료:', baseWeatherData);
        setWeatherData(baseWeatherData);

        // 추가 API 호출들은 비동기로 처리
        fetchAdditionalData(baseWeatherData, setWeatherData, {
          uvUrl: uvUrl,
          asosUrl: asosUrl,
          airUrl: airUrl,
          areaNo: String(areaNo || '1100000000'),
          baseDate,
          yesterdayDate,
          currentHour,
          stationName,
          currentTemp,
        });
      } catch (e) {
        console.error('날씨 데이터 fetch 에러:', e);
        if (e instanceof Error) {
          setError(e);
        } else {
          setError(new Error('알 수 없는 오류가 발생했습니다.'));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [location]);

  return { weatherData, loading, error };
};

// 추가 데이터 fetch 함수 (기존과 동일)
const fetchAdditionalData = async (
  baseData: WeatherData,
  setWeatherData: (data: WeatherData) => void,
  params: {
    uvUrl: string;
    asosUrl: string;
    airUrl: string;
    areaNo: string;
    baseDate: string;
    yesterdayDate: string;
    currentHour: string;
    stnId: number;
    stationName: string;
    currentTemp: string;
  }
) => {
  try {
    console.log('🔍 자외선지수 디버깅 시작');
    console.log('📍 areaNo:', params.areaNo);
    console.log('📅 baseDate:', params.baseDate);

    // 자외선지수 API 호출
    const uvParams = {
      serviceKey: API_KEY,
      pageNo: 1,
      numOfRows: 10,
      dataType: 'JSON',
      areaNo: params.areaNo,
      time: params.baseDate + '06',
    };

    console.log('🌞 자외선지수 API 파라미터:', uvParams);
    console.log('🌞 자외선지수 API URL:', params.uvUrl);

    let uvIndex = null;
    try {
      if (!params.uvUrl) {
        console.error('❌ 자외선지수 API URL이 undefined입니다.');
        throw new Error('자외선지수 API URL이 정의되지 않았습니다.');
      }

      const uvRes = await axios.get(params.uvUrl, {
        params: uvParams,
        headers: { Accept: 'application/json' },
      });

      console.log(
        '🌞 자외선지수 API 전체 응답:',
        JSON.stringify(uvRes.data, null, 2)
      );

      const responseBody = uvRes.data.response?.body;
      console.log('🌞 response.body:', responseBody);

      if (responseBody?.items) {
        console.log('🌞 items 구조:', responseBody.items);

        const itemsData = Array.isArray(responseBody.items)
          ? responseBody.items
          : responseBody.items.item;

        console.log('🌞 실제 items 데이터:', itemsData);

        if (itemsData && itemsData.length > 0) {
          const firstItem = itemsData[0];
          console.log('🌞 첫 번째 아이템:', firstItem);

          const currentHour24 = parseInt(params.baseDate.slice(-2));
          let uvFieldName = 'today';

          if (currentHour24 >= 0 && currentHour24 < 3) uvFieldName = 'h0';
          else if (currentHour24 >= 3 && currentHour24 < 6) uvFieldName = 'h3';
          else if (currentHour24 >= 6 && currentHour24 < 9) uvFieldName = 'h6';
          else if (currentHour24 >= 9 && currentHour24 < 12) uvFieldName = 'h9';
          else if (currentHour24 >= 12 && currentHour24 < 15)
            uvFieldName = 'h12';
          else if (currentHour24 >= 15 && currentHour24 < 18)
            uvFieldName = 'h15';
          else if (currentHour24 >= 18 && currentHour24 < 21)
            uvFieldName = 'h18';
          else if (currentHour24 >= 21) uvFieldName = 'h21';

          console.log(
            `🌞 선택된 UV 필드 (${uvFieldName}):`,
            firstItem[uvFieldName]
          );

          uvIndex = firstItem[uvFieldName] || firstItem.today || firstItem.h12;
        }
      }

      console.log('🌞 최종 선택된 uvIndex:', uvIndex);
    } catch (uvError) {
      console.error('❌ 자외선지수 API 호출 실패:', uvError);

      if (axios.isAxiosError(uvError) && uvError.response) {
        console.error('❌ 응답 상태:', uvError.response.status);
        console.error('❌ 응답 데이터:', uvError.response.data);
      }
    }

    // 어제 온도 데이터 API 호출
    let yesterdayTemp = null;
    try {
      const asosParams = {
        serviceKey: API_KEY,
        pageNo: 1,
        numOfRows: 1,
        dataType: 'JSON',
        dataCd: 'ASOS',
        dateCd: 'HR',
        startDt: params.yesterdayDate,
        startHh: params.currentHour.substring(0, 2),
        endDt: params.yesterdayDate,
        endHh: params.currentHour.substring(0, 2),
        stnIds: params.stnId,
      };

      const asosRes = await axios.get(params.asosUrl, {
        params: asosParams,
        headers: { Accept: 'application/json' },
      });

      yesterdayTemp = asosRes.data.response?.body?.items?.item[0]?.ta;
    } catch (asosError) {
      console.log('어제 온도 API 호출 실패:', asosError);
    }

    // 대기질 정보 API 호출
    let airItem = null;
    try {
      const airParams = {
        serviceKey: API_KEY,
        returnType: 'json',
        numOfRows: 1,
        pageNo: 1,
        stationName: params.stationName,
        dataTerm: 'DAILY',
        ver: '1.0',
      };

      const airRes = await axios.get(params.airUrl, {
        params: airParams,
        headers: { Accept: 'application/json' },
      });

      airItem = airRes.data.response?.body?.items[0];
    } catch (airError) {
      console.log('대기질 API 호출 실패:', airError);
    }

    // 추가 데이터 추출
    const tempDiff =
      yesterdayTemp && params.currentTemp
        ? parseFloat(params.currentTemp) - parseFloat(yesterdayTemp)
        : null;

    const airQualityData = airItem
      ? {
          pm10: {
            grade: airItem.pm10Grade || '1',
            value: airItem.pm10Value || '-',
          },
          pm25: {
            grade: airItem.pm25Grade || '1',
            value: airItem.pm25Value || '-',
          },
        }
      : {
          pm10: { grade: '1', value: '-' },
          pm25: { grade: '1', value: '-' },
        };

    const getUVIndexText = (index: string): string => {
      console.log('🌞 getUVIndexText 입력값:', index, '타입:', typeof index);

      if (!index || index === null || index === undefined || index === '-') {
        console.log('🌞 자외선 지수가 null/undefined/-');
        return '-';
      }

      const uvLevel = parseInt(index.toString());
      console.log('🌞 파싱된 UV 레벨:', uvLevel);

      if (isNaN(uvLevel)) {
        console.log('🌞 자외선 지수 파싱 실패');
        return '-';
      }

      let result = '';
      if (uvLevel <= 2) result = '낮음';
      else if (uvLevel <= 5) result = '보통';
      else if (uvLevel <= 7) result = '높음';
      else if (uvLevel <= 10) result = '매우높음';
      else result = '위험';

      console.log('🌞 최종 UV 텍스트:', result);
      return result;
    };

    const updatedDetails = baseData.details.map((detail) => {
      if (detail.label === '자외선') {
        const newValue = uvIndex ? getUVIndexText(uvIndex) : '-';
        console.log('🌞 자외선 필드 업데이트:', detail.value, '→', newValue);
        return { ...detail, value: newValue };
      }
      return detail;
    });

    const updatedWeatherData: WeatherData = {
      ...baseData,
      current: {
        ...baseData.current,
        tempDiff: tempDiff,
      },
      details: updatedDetails,
      airQuality: airQualityData,
    };

    console.log('✅ 업데이트된 날씨 데이터:', updatedWeatherData);
    setWeatherData(updatedWeatherData);
  } catch (error) {
    console.log('추가 데이터 fetch 실패 (기본 데이터는 유지):', error);
  }
};

export default useWeather;
