import { useMemo, useState, useEffect, useRef } from 'react';
import {
  usePlansQuery,
  useAddPlaceToPlanMutation,
} from '@/api/planner/plannerHooks';
import { useQueryClient } from '@tanstack/react-query';
import { plannerQueries } from '@/api/planner/plannerQueries';
import { useToast } from './useToast';
import type { TDropdownItem } from '@/components/common/dropdown/Dropdown';

export const useScheduleDropdown = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownContentRef = useRef<HTMLDivElement>(null);

  const { data: plansData, isLoading: isPlansLoading } = usePlansQuery();

  const addPlaceToPlanMutation = useAddPlaceToPlanMutation({
    onSuccess: async (data, variables) => {
      // 해당 플랜 상세 정보 refetch
      await queryClient.refetchQueries({
        queryKey: plannerQueries.plans.detail(variables.planId).queryKey,
      });

      // 플랜 목록도 refetch
      await queryClient.refetchQueries({
        queryKey: plannerQueries.plans.all().queryKey,
      });

      const planName =
        plansData?.plans.find((p) => String(p.id) === variables.planId)
          ?.title || '일정';
      showToast(`"${planName}"에 장소가 추가되었습니다.`, 'success');
      setOpenDropdownId(null);
    },
    onError: (error: any) => {
      console.error('장소 추가 실패:', error);

      // 400 에러일 경우 특별 처리
      if (error.response?.status === 400) {
        showToast('이미 일정에 추가된 장소입니다.', 'error');
      } else {
        showToast(error.message || '장소 추가에 실패했습니다.', 'error');
      }
    },
  });

  const toggleDropdown = (cardId: number) => {
    setOpenDropdownId((prevId) => (prevId === cardId ? null : cardId));
  };

  const closeDropdown = () => {
    setOpenDropdownId(null);
  };

  const dropdownItems = useMemo((): TDropdownItem[] => {
    if (isPlansLoading) {
      return [{ value: 'loading', label: '일정 불러오는 중...' }];
    }
    if (!plansData?.plans || plansData.plans.length === 0) {
      return [{ value: 'empty', label: '생성된 일정이 없습니다' }];
    }
    return plansData.plans.map((plan) => ({
      value: String(plan.id),
      label: plan.title || `일정 ${plan.id}`,
      onClick: () => {
        if (!openDropdownId) return; // 현재 열린 드롭다운의 카드 ID
        addPlaceToPlanMutation.mutate({
          planId: String(plan.id),
          placeData: { place_id: openDropdownId },
        });
      },
    }));
  }, [plansData, isPlansLoading, openDropdownId, addPlaceToPlanMutation]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        dropdownContentRef.current &&
        !dropdownContentRef.current.contains(target) &&
        dropdownButtonRef.current &&
        !dropdownButtonRef.current.contains(target)
      ) {
        closeDropdown();
      }
    };
    if (openDropdownId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdownId]);

  return {
    openDropdownId,
    toggleDropdown,
    dropdownItems,
    isAddingToSchedule: addPlaceToPlanMutation.isPending,
    dropdownButtonRef,
    dropdownContentRef,
  };
};
