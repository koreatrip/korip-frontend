import {
  useChangePassword,
  useUpdateUserProfile,
  useUpdatePreferences,
  useUserProfile,
} from '@/api/user/userHooks';
import { useToast } from '@/hooks/useToast';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PasswordChangeModal from './Modals/PasswordChangeModal';
import AccountDeleteModal from './Modals/AccountDeleteModal';
import AccountStatsSection from './Sections/AccountStatsSection';
import BasicInfoSection from './Sections/BasicInfoSection';
import SecuritySection from './Sections/SecuritySection';
import type { UserProfileResponse } from '@/api/user/userType';

type ProfileCardProps = {
  onSave?: (data: UserProfileResponse) => void;
  onCancel?: () => void;
};

const ProfileCard = ({ onSave, onCancel }: ProfileCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAccountDeleteModal, setShowAccountDeleteModal] = useState(false);

  const { t } = useTranslation();
  const { showToast } = useToast();

  // API hooks
  const { data: userProfileData, isLoading, error } = useUserProfile();
  const updateUserProfile = useUpdateUserProfile();
  const changePassword = useChangePassword();
  const updatePreferences = useUpdatePreferences();

  // 로컬 상태 - 실제 API 타입 그대로 사용
  const [formData, setFormData] = useState<UserProfileResponse | null>(null);
  const [tempFormData, setTempFormData] = useState<UserProfileResponse | null>(
    null
  );

  // 사용자 데이터가 로드되면 폼 데이터 초기화
  useEffect(() => {
    if (userProfileData) {
      setFormData(userProfileData);
      setTempFormData(userProfileData);
    }
  }, [userProfileData]);

  // 핸들러 함수들
  const handleInputChange = (field: 'name' | 'phone_number', value: string) => {
    setTempFormData((prev) => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
  };

  const handleInterestAdd = async (interest: string) => {
    if (!tempFormData || !interest.trim()) return;

    const existingInterest = tempFormData.preferences_display.find(
      (pref) => pref.name.toLowerCase() === interest.trim().toLowerCase()
    );

    if (!existingInterest) {
      const newPreference = {
        id: Date.now(), // 임시 ID
        name: interest.trim(),
      };

      const newPreferences = [
        ...tempFormData.preferences_display,
        newPreference,
      ];

      setTempFormData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          preferences_display: newPreferences,
        };
      });

      try {
        // await updatePreferences.mutateAsync({ interests: newPreferences.map(p => p.name) });
        showToast('관심사가 추가되었습니다.', 'success');
      } catch (error) {
        console.error('관심사 업데이트 실패:', error);
        showToast('관심사 추가에 실패했습니다.', 'error');
        // 실패 시 원복
        setTempFormData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            preferences_display: prev.preferences_display.filter(
              (p) => p.id !== newPreference.id
            ),
          };
        });
      }
    }
  };

  const handleInterestRemove = async (interestToRemove: string) => {
    if (!tempFormData) return;

    const preferenceToRemove = tempFormData.preferences_display.find(
      (pref) => pref.name === interestToRemove
    );

    if (preferenceToRemove) {
      const newPreferences = tempFormData.preferences_display.filter(
        (pref) => pref.id !== preferenceToRemove.id
      );

      setTempFormData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          preferences_display: newPreferences,
        };
      });

      try {
        // await updatePreferences.mutateAsync({ interests: newPreferences.map(p => p.name) });
        showToast('관심사가 제거되었습니다.', 'success');
      } catch (error) {
        console.error('관심사 제거 실패:', error);
        showToast('관심사 제거에 실패했습니다.', 'error');
        // 실패 시 원복
        setTempFormData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            preferences_display: [
              ...prev.preferences_display,
              preferenceToRemove,
            ],
          };
        });
      }
    }
  };

  const handleSave = async () => {
    if (!tempFormData) return;

    try {
      const updateData = {
        name: tempFormData.name,
        phone_number: tempFormData.phone_number,
      };

      await updateUserProfile.mutateAsync(updateData);

      setFormData(tempFormData);
      setIsEditing(false);
      onSave?.(tempFormData);
      showToast(t('user.profile_updated_success'), 'success');
    } catch (error) {
      console.error('프로필 업데이트 실패:', error);
      showToast(t('user.profile_update_failed'), 'error');
    }
  };

  const handleCancel = () => {
    setTempFormData(formData);
    setIsEditing(false);
    onCancel?.();
  };

  const handleEditToggle = () => {
    isEditing ? handleCancel() : setIsEditing(true);
  };

  const handlePasswordChange = async (passwords: {
    current: string;
    new: string;
    confirm: string;
  }) => {
    try {
      await changePassword.mutateAsync({
        currentPassword: passwords.current,
        newPassword: passwords.new,
        confirmPassword: passwords.confirm,
      });

      showToast(t('user.password_changed_success'), 'success');
    } catch (error) {
      console.error('비밀번호 변경 실패:', error);
      showToast(t('user.password_change_failed'), 'error');
    }
  };

  const handleAccountDelete = () => {
    setShowAccountDeleteModal(true);
  };

  const handleAccountDeleteConfirm = (
    selectedReasons: string[],
    customReason?: string
  ) => {
    console.log('계정 탈퇴 요청:', { selectedReasons, customReason });
    showToast('계정 탈퇴가 요청되었습니다.', 'success');
    setShowAccountDeleteModal(false);
  };

  // 로딩 중
  if (isLoading) {
    return (
      <section className='mb-6 w-full rounded-lg bg-white p-6 shadow-md'>
        <div className='animate-pulse'>
          <div className='mb-6 h-8 rounded bg-gray-200'></div>
          <div className='space-y-4'>
            <div className='h-4 w-3/4 rounded bg-gray-200'></div>
            <div className='h-4 w-1/2 rounded bg-gray-200'></div>
            <div className='h-4 w-2/3 rounded bg-gray-200'></div>
          </div>
        </div>
      </section>
    );
  }

  // 에러 발생
  if (error) {
    return (
      <section className='mb-6 w-full rounded-lg bg-white p-6 shadow-md'>
        <div className='text-center text-red-500'>
          <p>{t('common.error_occurred')}</p>
          <p className='mt-2 text-sm'>{t('user.profile_load_failed')}</p>
        </div>
      </section>
    );
  }

  // 데이터 없음
  if (!userProfileData || !formData || !tempFormData) {
    return (
      <section className='mb-6 w-full rounded-lg bg-white p-6 shadow-md'>
        <div className='text-center text-gray-500'>
          <p>사용자 정보를 불러올 수 없습니다.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className='mb-6 w-full rounded-lg bg-white p-6 shadow-md'>
        <h2 className='text-main-text-navy mb-6 text-2xl font-semibold'>
          {t('user.welcome_user', { name: formData.name })}
        </h2>

        <BasicInfoSection
          formData={formData}
          tempFormData={tempFormData}
          isEditing={isEditing}
          onToggleEdit={handleEditToggle}
          onInputChange={handleInputChange}
          onInterestAdd={handleInterestAdd}
          onInterestRemove={handleInterestRemove}
          onSave={handleSave}
          onCancel={handleCancel}
        />

        <AccountStatsSection
          joinDate={new Date(formData.created_at).toLocaleDateString('ko-KR')}
          stats={{
            travelPlans: 0,
            favorites: formData.preferences_display.length,
            visitedPlaces: 0,
          }}
        />

        <SecuritySection
          onPasswordChange={() => setShowPasswordModal(true)}
          onAccountDelete={handleAccountDelete}
        />
      </section>

      <PasswordChangeModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSave={handlePasswordChange}
      />

      <AccountDeleteModal
        isOpen={showAccountDeleteModal}
        onClose={() => setShowAccountDeleteModal(false)}
        onConfirm={handleAccountDeleteConfirm}
      />
    </>
  );
};

export default ProfileCard;
