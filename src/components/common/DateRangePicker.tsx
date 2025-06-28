import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';

const DateRangePicker = () => {
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 6, 1)); // 2025년 7월 1일
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 6, 1));

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}. ${month}. ${day}`;
  };

  const getMonthName = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return `${year}년 ${month}월`;
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days = [];

    // 빈 칸들
    for (let i = 0; i < startDate; i++) {
      days.push(null);
    }

    // 실제 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const handleDateClick = (date) => {
    if (date) {
      setSelectedDate(date);
      setIsOpen(false);
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const isSameDate = (date1, date2) => {
    if (!date1 || !date2) return false;
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const isToday = (date) => {
    return isSameDate(date, new Date());
  };

  const days = getDaysInMonth(currentMonth);
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className='mx-auto w-full'>
      <div className='relative'>
        {/* 데이트 피커 버튼 */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className='border-outline-gray shadow-light hover:shadow-medium bg-bg-white cursor-pointer rounded-lg border p-4 transition-shadow'
        >
          <div className='flex items-center justify-between'>
            <div className='text-gray-800'>{formatDate(selectedDate)}</div>
            <CalendarIcon className='text-main-text-navy h-5 w-5' />
          </div>
        </div>

        {/* 캘린더 팝업 */}
        {isOpen && (
          <div className='border-outline-gray bg-bg-white shadow-large absolute top-full right-0 left-0 z-50 mt-2 rounded-2xl border p-4'>
            {/* 캘린더 헤더 */}
            <div className='mb-4 flex items-center justify-between'>
              <button
                onClick={handlePrevMonth}
                className='hover:bg-hover-gray rounded-lg p-2 transition-colors'
              >
                <ChevronLeftIcon className='text-sub-text-gray h-5 w-5' />
              </button>
              <div className='text-main-text-navy text-lg font-semibold'>
                {getMonthName(currentMonth)}
              </div>
              <button
                onClick={handleNextMonth}
                className='hover:bg-hover-gray rounded-lg p-2 transition-colors'
              >
                <ChevronRightIcon className='text-sub-text-gray h-5 w-5' />
              </button>
            </div>

            {/* 요일 헤더 */}
            <div className='mb-2 grid grid-cols-7 gap-1'>
              {weekDays.map((day) => (
                <div
                  key={day}
                  className='text-main-text-navy/90 py-2 text-center text-sm font-medium'
                >
                  {day}
                </div>
              ))}
            </div>

            {/* 캘린더 날짜 */}
            <div className='grid grid-cols-7 gap-1'>
              {days.map((date, index) => (
                <div
                  key={index}
                  onClick={() => handleDateClick(date)}
                  className={`cursor-pointer rounded-lg py-2 text-center transition-all duration-200 ${date ? 'hover:bg-hover-gray' : ''} ${date && isSameDate(date, selectedDate) ? 'text-bg-white hover:bg-main-pink bg-main-pink' : ''} ${date && isToday(date) && !isSameDate(date, selectedDate) ? 'bg-gray-200 font-semibold' : ''} ${!date ? 'cursor-default' : ''} `}
                >
                  {date ? date.getDate() : ''}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 배경 클릭 시 닫기 */}
        {isOpen && (
          <div
            className='fixed inset-0 z-40'
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default DateRangePicker;
