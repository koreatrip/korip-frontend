// utils/timeUtils.ts
type OperatingHour = {
  day: string;
  time: string;
};

export const parseOperatingHours = (useTime: string): OperatingHour[] => {
  const allDays = [
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
    '일요일',
  ];

  // "11:00-23:00" 같은 단순 시간이면 모든 요일 동일
  if (/^\d{2}:\d{2}-\d{2}:\d{2}$/.test(useTime)) {
    return allDays.map((day) => ({ day, time: useTime }));
  }

  // "월-금 09:00-18:00, 토-일 휴무" 같은 복합 형태 파싱
  if (useTime.includes('휴무')) {
    const closedDays: string[] = [];
    if (useTime.includes('월') && useTime.includes('휴무'))
      closedDays.push('월요일');
    if (useTime.includes('화') && useTime.includes('휴무'))
      closedDays.push('화요일');
    if (useTime.includes('토') && useTime.includes('휴무'))
      closedDays.push('토요일');
    if (useTime.includes('일') && useTime.includes('휴무'))
      closedDays.push('일요일');

    const timeMatch = useTime.match(/(\d{2}:\d{2}-\d{2}:\d{2})/);
    const operatingTime = timeMatch ? timeMatch[1] : '운영시간 확인 필요';

    return allDays.map((day) => ({
      day,
      time: closedDays.includes(day) ? '휴무' : operatingTime,
    }));
  }

  return [{ day: '운영시간', time: useTime }];
};
