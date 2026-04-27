import { useMemo, useState, useEffect, useRef } from 'react';
import {
  usePlansQuery,
  useAddPlaceToPlanMutation,
} from '@/api/planner/plannerHooks';
import { useQueryClient } from '@tanstack/react-query';
import { plannerQueries } from '@/api/planner/plannerQueries';
import { useToast } from './useToast';
import { useTranslation } from 'react-i18next';
import type { TDropdownItem } from '@/components/common/dropdown/Dropdown';
import { useAuthStore } from '@/stores/useAuthStore';

export const useScheduleDropdown = () => {
  const { showToast } = useToast();
  const { i18n } = useTranslation();
  const queryClient = useQueryClient();
  const isLogin = useAuthStore((state) => state.auth.isLogin);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownContentRef = useRef<HTMLDivElement>(null);

  const { data: plansData, isLoading: isPlansLoading } = usePlansQuery(
    i18n.language || 'ko',
    { enabled: isLogin }
  );

  const addPlaceToPlanMutation = useAddPlaceToPlanMutation({
    onSuccess: async (_data, variables) => {
      await queryClient.refetchQueries({
        queryKey: plannerQueries.plans.detail(
          variables.planId,
          i18n.language || 'ko'
        ).queryKey,
      });

      await queryClient.refetchQueries({
        queryKey: plannerQueries.plans.all(i18n.language || 'ko').queryKey,
      });

      const planName =
        plansData?.plans.find((p) => String(p.id) === variables.planId)
          ?.title || '일정';
      showToast(`"${planName}"에 장소가 추가되었습니다.`, 'success');
      setOpenDropdownId(null);
    },
    onError: (error: any) => {
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
        if (!openDropdownId) return;
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
        setOpenDropdownId(null);
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
