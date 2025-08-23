// export const getBaseDateTime = () => {
//   const now = new Date();
//   const pad = (num: number) => num.toString().padStart(2, '0');
//   const base_time = '0200';
//   let base_date = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;

//   if (now.getHours() < 2) {
//     const yesterday = new Date();
//     yesterday.setDate(now.getDate() - 1);
//     base_date = `${yesterday.getFullYear()}${pad(yesterday.getMonth() + 1)}${yesterday.getDate().toString().padStart(2, '0')}`;
//   }

//   const yesterdayForAsos = new Date();
//   yesterdayForAsos.setDate(yesterdayForAsos.getDate() - 1);
//   const yesterdayDate = `${yesterdayForAsos.getFullYear()}${pad(yesterdayForAsos.getMonth() + 1)}${yesterdayForAsos.getDate().toString().padStart(2, '0')}`;

//   return {
//     baseDate: base_date,
//     baseTime: base_time,
//     yesterdayDate: yesterdayDate,
//     currentHour: `${now.getHours().toString().padStart(2, '0')}00`,
//   };
// };

// export const getSkyState = (
//   sky: string,
//   pty: string
// ): { text: string; icon: string } => {
//   if (pty && pty !== '0') {
//     const ptyMap: { [key: string]: { text: string; icon: string } } = {
//       '1': { text: '비', icon: '🌧️' },
//       '2': { text: '비/눈', icon: '🌨️' },
//       '3': { text: '눈', icon: '❄️' },
//       '4': { text: '소나기', icon: '🌦️' },
//     };
//     return ptyMap[pty] || { text: '정보 없음', icon: '❓' };
//   }
//   if (sky) {
//     const skyMap: { [key: string]: { text: string; icon: string } } = {
//       '1': { text: '맑음', icon: '☀️' },
//       '3': { text: '구름많음', icon: '🌥️' },
//       '4': { text: '흐림', icon: '☁️' },
//     };
//     return skyMap[sky] || { text: '정보 없음', icon: '❓' };
//   }
//   return { text: '정보 없음', icon: '❓' };
// };

// export const getAirQualityInfo = (
//   grade: string
// ): { text: string; color: string } => {
//   const infoMap: { [key: string]: { text: string; color: string } } = {
//     '1': { text: '좋음', color: 'bg-[#E8F4F2]/50' },
//     '2': { text: '보통', color: 'bg-[#D4E9F6]/50' },
//     '3': { text: '나쁨', color: 'bg-[#FBE9E8]/50' },
//     '4': { text: '매우나쁨', color: 'bg-[#E8E8E8]/50' },
//   };
//   return infoMap[grade] || { text: '정보없음', color: 'bg-gray-100' };
// };
// // 풍향 변환 함수
// export const getWindDirection = (degree: string): string => {
//   const deg = parseInt(degree);
//   if (isNaN(deg)) return '-%';

//   const directions = [
//     '북',
//     '북북동',
//     '북동',
//     '동북동',
//     '동',
//     '동남동',
//     '남동',
//     '남남동',
//     '남',
//     '남남서',
//     '남서',
//     '서남서',
//     '서',
//     '서북서',
//     '북서',
//     '북북서',
//   ];

//   const index = Math.round(deg / 22.5) % 16;
//   return directions[index];
// };

// // 일출 시간 계산 함수 (간단한 버전)
// export const getSunriseTime = (): string => {
//   // 현재 날짜 기준 대략적인 일출 시간
//   // 실제로는 위치와 날짜에 따라 계산해야 하지만, 간단히 고정값 사용
//   const now = new Date();
//   const month = now.getMonth() + 1;

//   // 계절별 대략적인 일출 시간 (서울 기준)
//   let hour = 6;
//   let minute = 30;

//   if (month >= 3 && month <= 5) {
//     // 봄
//     hour = 6;
//     minute = 0;
//   } else if (month >= 6 && month <= 8) {
//     // 여름
//     hour = 5;
//     minute = 30;
//   } else if (month >= 9 && month <= 11) {
//     // 가을
//     hour = 6;
//     minute = 30;
//   } else {
//     // 겨울
//     hour = 7;
//     minute = 30;
//   }

//   return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
// };

// // 일몰 시간 계산 함수 (간단한 버전)
// export const getSunsetTime = (): string => {
//   // 현재 날짜 기준 대략적인 일몰 시간
//   const now = new Date();
//   const month = now.getMonth() + 1;

//   // 계절별 대략적인 일몰 시간 (서울 기준)
//   let hour = 18;
//   let minute = 0;

//   if (month >= 3 && month <= 5) {
//     // 봄
//     hour = 18;
//     minute = 30;
//   } else if (month >= 6 && month <= 8) {
//     // 여름
//     hour = 19;
//     minute = 30;
//   } else if (month >= 9 && month <= 11) {
//     // 가을
//     hour = 17;
//     minute = 30;
//   } else {
//     // 겨울
//     hour = 17;
//     minute = 0;
//   }

//   return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
// };
// weatherUtils.ts (간소화된 버전)
export const getWeatherIcon = (condition: string): string => {
  const conditionMap: { [key: string]: string } = {
    맑음: '☀️',
    구름많음: '🌥️',
    흐림: '☁️',
    비: '🌧️',
    눈: '❄️',
    소나기: '🌦️',
    '비/눈': '🌨️',
  };
  return conditionMap[condition] || '❓';
};

export const getAirQualityInfo = (
  grade: string
): { text: string; color: string } => {
  const infoMap: { [key: string]: { text: string; color: string } } = {
    좋음: { text: '좋음', color: 'bg-[#E8F4F2]/50' },
    보통: { text: '보통', color: 'bg-[#D4E9F6]/50' },
    나쁨: { text: '나쁨', color: 'bg-[#FBE9E8]/50' },
    매우나쁨: { text: '매우나쁨', color: 'bg-[#E8E8E8]/50' },
  };
  return infoMap[grade] || { text: '정보없음', color: 'bg-gray-100' };
};
