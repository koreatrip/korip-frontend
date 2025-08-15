import {
  useChangePassword,
  useUpdateUserProfile,
  useUserProfile,
  useUpdatePreferences,
} from '@/api/user/userHooks';
import { useToast } from '@/hooks/useToast';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PasswordChangeModal from './Modals/PasswordChangeModal';
import AccountDeleteModal from './Modals/AccountDeleteModal';
import AccountStatsSection from './Sections/AccountStatsSection';
import BasicInfoSection from './Sections/BasicInfoSection';
import SecuritySection from './Sections/SecuritySection';

type UserProfile = {
  name: string;
  email: string;
  phone: string;
  interests: string[];
  profileImage?: string;
  joinDate: string;
  stats: {
    travelPlans: number;
    favorites: number;
    visitedPlaces: number;
  };
};

type ProfileCardProps = {
  onSave?: (data: UserProfile) => void;
  onCancel?: () => void;
};

// 임시 목 데이터 - 컴포넌트 외부에 정의하여 참조 안정성 확보
const mockUserData = {
  data: {
    id: 1,
    name: '김태율',
    email: 'user@korip.com',
    phone: '010-1234-5678',
    interests: ['여행', '맛집', '문화'],
    profileImage: undefined,
    joinDate: '2024-01-15',
    stats: {
      travelPlans: 5,
      favorites: 12,
      visitedPlaces: 8,
    },
  }
};

const ProfileCard: React.FC<ProfileCardProps> = ({ onSave, onCancel }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAccountDeleteModal, setShowAccountDeleteModal] = useState(false);

  const { t } = useTranslation();
  const { showToast } = useToast();

  // API hooks - 임시로 비활성화
  // const { data: userProfileData, isLoading, error } = useUserProfile();
  const updateUserProfile = useUpdateUserProfile();
  const changePassword = useChangePassword();
  const updatePreferences = useUpdatePreferences();

  const userProfileData = mockUserData;
  const isLoading = false;
  const error = null;

  // 로컬 상태 - 초기값을 목 데이터로 직접 설정
  const [formData, setFormData] = useState<UserProfile>(() => ({
    name: mockUserData.data.name,
    email: mockUserData.data.email,
    phone: mockUserData.data.phone,
    interests: mockUserData.data.interests,
    profileImage: mockUserData.data.profileImage,
    joinDate: mockUserData.data.joinDate,
    stats: mockUserData.data.stats,
  }));
  const [tempFormData, setTempFormData] = useState<UserProfile>(() => ({
    name: mockUserData.data.name,
    email: mockUserData.data.email,
    phone: mockUserData.data.phone,
    interests: mockUserData.data.interests,
    profileImage: mockUserData.data.profileImage,
    joinDate: mockUserData.data.joinDate,
    stats: mockUserData.data.stats,
  }));

  // 핸들러 함수들
  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setTempFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleInterestAdd = async (interest: string) => {
    if (interest.trim() && !tempFormData.interests.includes(interest.trim())) {
      const newInterests = [...tempFormData.interests, interest.trim()];
      
      // UI 먼저 업데이트
      setTempFormData((prev) => ({
        ...prev,
        interests: newInterests,
      }));

      // API 호출
      if (userProfileData?.data?.id) {
        try {
          await updatePreferences.mutateAsync({
            userId: userProfileData.data.id,
            data: { interests: newInterests }
          });
          showToast('관심사가 추가되었습니다.', 'success');
        } catch (error) {
          console.error('관심사 업데이트 실패:', error);
          showToast('관심사 추가에 실패했습니다.', 'error');
          // 실패 시 원복
          setTempFormData((prev) => ({
            ...prev,
            interests: prev.interests.filter(i => i !== interest.trim()),
          }));
        }
      }
    }
  };

  const handleInterestRemove = async (interestToRemove: string) => {
    const newInterests = tempFormData.interests.filter(
      (interest) => interest !== interestToRemove
    );

    // UI 먼저 업데이트
    setTempFormData((prev) => ({
      ...prev,
      interests: newInterests,
    }));

    // API 호출
    if (userProfileData?.data?.id) {
      try {
        await updatePreferences.mutateAsync({
          userId: userProfileData.data.id,
          data: { interests: newInterests }
        });
        showToast('관심사가 제거되었습니다.', 'success');
      } catch (error) {
        console.error('관심사 업데이트 실패:', error);
        showToast('관심사 제거에 실패했습니다.', 'error');
        // 실패 시 원복
        setTempFormData((prev) => ({
          ...prev,
          interests: [...prev.interests, interestToRemove],
        }));
      }
    }
  };

  const handleSave = async () => {
    try {
      // 기본 정보만 업데이트 (관심사는 별도 API로 처리)
      const updateData = {
        name: tempFormData.name,
        email: tempFormData.email,
        phone: tempFormData.phone,
        profileImage: tempFormData.profileImage,
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

  const handleAccountDeleteConfirm = (selectedReasons: string[], customReason?: string) => {
    // TODO: 계정 탈퇴 API 호출
    console.log('계정 탈퇴 요청:', { selectedReasons, customReason });
    showToast('계정 탈퇴가 요청되었습니다.', 'success');
    setShowAccountDeleteModal(false);
  };

  // 로딩 중일 때 표시
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

  // 에러 발생시 표시
  if (error) {
    console.error('User profile API error:', error);
    return (
      <section className='mb-6 w-full rounded-lg bg-white p-6 shadow-md'>
        <div className='text-center text-red-500'>
          <p>{t('common.error_occurred')}</p>
          <p className='mt-2 text-sm'>{t('user.profile_load_failed')}</p>
          <details className='mt-4 text-xs text-gray-500'>
            <summary>에러 상세</summary>
            <pre className='mt-2 rounded bg-gray-100 p-2 text-left'>
              {JSON.stringify(error, null, 2)}
            </pre>
          </details>
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
          joinDate={formData.joinDate}
          stats={formData.stats}
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
