import { useState } from 'react';
import { useDeletePlanMutation } from '@/api/planner/plannerHooks';
import { useToast } from './useToast';
import { useQueryClient } from '@tanstack/react-query';
import { plannerQueries } from '@/api/planner/plannerQueries';

type UsePlannerDeleteOptions = {
  onSuccess?: () => void;
};

export const usePlannerDelete = (options?: UsePlannerDeleteOptions) => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [planIdToDelete, setPlanIdToDelete] = useState<number | null>(null);

  const deletePlanMutation = useDeletePlanMutation({
    onSuccess: async () => {
      // 즉시 refetch
      await queryClient.refetchQueries({
        queryKey: plannerQueries.plans.all().queryKey,
      });

      showToast('일정이 삭제되었습니다.', 'success');
      options?.onSuccess?.();
      setIsModalOpen(false);
      setPlanIdToDelete(null);
    },
    onError: (error) => {
      showToast(error.message || '일정 삭제에 실패했습니다.', 'error');
    },
  });

  const openDeleteModal = (planId: number) => {
    setPlanIdToDelete(planId);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setPlanIdToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (planIdToDelete !== null) {
      deletePlanMutation.mutate(String(planIdToDelete));
    }
  };

  return {
    openDeleteModal,
    deleteModalProps: {
      isOpen: isModalOpen,
      onClose: closeDeleteModal,
      onConfirm: handleConfirmDelete,
      isPending: deletePlanMutation.isPending,
      planId: planIdToDelete ? String(planIdToDelete) : undefined,
    },
  };
};
