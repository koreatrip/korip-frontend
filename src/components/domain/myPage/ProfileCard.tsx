import { useProfileEditStore } from '@/stores/useProfileEditStore';
import {
  useUpdateUserProfileMutation,
  useUserProfileQuery,
} from '@/api/user/userHooks';
import { useToast } from '@/hooks/useToast';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PasswordChangeModal from './Modals/PasswordChangeModal';
import AccountDeleteModal from './Modals/AccountDeleteModal';
import AccountStatsSection from './Sections/AccountStatsSection';
import BasicInfoSection from './Sections/BasicInfoSection';
import SecuritySection from './Sections/SecuritySection';

const ProfileCard = () => {
  const { state, actions } = useProfileEditStore();
  const { formData, tempFormData } = state;
  const { initializeForm, commitChanges } = actions;

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAccountDeleteModal, setShowAccountDeleteModal] = useState(false);

  const { t } = useTranslation();
  const { showToast } = useToast();

  const { data: userProfileData, isLoading, error } = useUserProfileQuery();
  const updateUserProfile = useUpdateUserProfileMutation();

  useEffect(() => {
    if (userProfileData) {
      initializeForm(userProfileData);
    }
  }, [userProfileData, initializeForm]);

  const handleSave = async () => {
    if (!tempFormData) return;
    try {
      const updateData = {
        name: tempFormData.name,
        phone_number: tempFormData.phone_number,
        preferences: tempFormData.preferences_display.map((p) => p.id),
      };
      await updateUserProfile.mutateAsync(updateData);
      commitChanges();
      showToast(t('user.profile_updated_success'), 'success');
    } catch (error) {
      console.error('프로필 업데이트 실패:', error);
      showToast(t('user.profile_update_failed'), 'error');
    }
  };

  const handleAccountDelete = () => setShowAccountDeleteModal(true);

  if (isLoading || !formData) {
    return <section>...로딩 UI...</section>;
  }

  if (error) {
    return <section>...에러 UI...</section>;
  }

  return (
    <>
      <section className='mb-6 w-full rounded-lg bg-white p-6 shadow-md'>
        <h2 className='text-main-text-navy mb-6 text-2xl font-semibold'>
          {t('user.welcome_user', { name: formData.name })}
        </h2>
        <BasicInfoSection onSave={handleSave} />
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
      />
      <AccountDeleteModal
        isOpen={showAccountDeleteModal}
        onClose={() => setShowAccountDeleteModal(false)}
        onConfirm={() => {
          /* ... */
        }}
      />
    </>
  );
};

export default ProfileCard;
