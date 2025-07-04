// src/components/common/DateRangePicker.tsx

import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import type { FC } from 'react';

type DateRangePickerProps = {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
};

const DateRangePicker: FC<DateRangePickerProps> = ({
  selectedDate,
  onDateChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  // The initial month shown in the calendar can be based on the selected date
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());

  // ✅ FIX: Add a check to prevent crash if date is undefined
  const formatDate = (date: Date) => {
    // If the date is not valid, return a placeholder text instead of crashing.
    if (!date || !(date instanceof Date)) {
      return '날짜 선택...';
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}. ${month}. ${day}`;
  };

  const getMonthName = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return `${year}년 ${month}월`;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const days: (Date | null)[] = [];
    for (let i = 0; i < startDate; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  };

  // ✅ 오늘 이전인지 확인하는 헬퍼 함수
  const isBeforeToday = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 시간을 0으로 설정하여 날짜만 비교
    return date < today;
  };

  // ✅ 이전 날짜는 클릭되지 않도록 수정
  const handleDateClick = (date: Date | null) => {
    // 날짜가 존재하고, 오늘 이전 날짜가 아닐 때만 상태 변경
    if (date && !isBeforeToday(date)) {
      onDateChange(date);
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

  const isSameDate = (date1: Date | null, date2: Date | null) => {
    if (!date1 || !date2) return false;
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const isToday = (date: Date) => {
    return isSameDate(date, new Date());
  };

  const days = getDaysInMonth(currentMonth);
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  // ✅ 이전 달로 넘어가지 못하게 막는 조건
  const todayForMonthCheck = new Date();
  const isPrevMonthDisabled =
    currentMonth.getFullYear() === todayForMonthCheck.getFullYear() &&
    currentMonth.getMonth() === todayForMonthCheck.getMonth();

  return (
    <div className='mx-auto w-full'>
      <div className='relative'>
        <div
          onClick={() => setIsOpen(!isOpen)}
          className='border-outline-gray shadow-light hover:shadow-medium bg-bg-white cursor-pointer rounded-lg border p-4 transition-shadow'
        >
          <div className='flex items-center justify-between'>
            <div className='text-gray-800'>{formatDate(selectedDate)}</div>
            <CalendarIcon className='text-main-text-navy h-5 w-5' />
          </div>
        </div>
        {isOpen && (
          <div className='border-outline-gray bg-bg-white shadow-large absolute top-full right-0 left-0 z-50 mt-2 rounded-2xl border p-4'>
            <div className='mb-4 flex items-center justify-between'>
              <button
                onClick={handlePrevMonth}
                disabled={isPrevMonthDisabled}
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
            <div className='grid grid-cols-7 gap-1'>
              {days.map((date, index) => {
                // ✅ 날짜가 비활성화 상태인지 확인
                const isDisabled = date && isBeforeToday(date);
                return (
                  <div
                    key={index}
                    onClick={() => handleDateClick(date)}
                    className={`rounded-lg py-2 text-center transition-all duration-200 ${!date && 'cursor-default'} ${
                      isDisabled
                        ? 'cursor-not-allowed text-gray-300' // ✅ 비활성화 스타일
                        : `hover:bg-hover-gray cursor-pointer`
                    } ${
                      date && isSameDate(date, selectedDate) && !isDisabled
                        ? 'bg-main-pink text-bg-white hover:bg-main-pink'
                        : ''
                    } ${
                      date && isToday(date) && !isSameDate(date, selectedDate)
                        ? 'bg-gray-200 font-semibold'
                        : ''
                    } `}
                  >
                    {date ? date.getDate() : ''}
                  </div>
                );
              })}
            </div>
          </div>
        )}
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
