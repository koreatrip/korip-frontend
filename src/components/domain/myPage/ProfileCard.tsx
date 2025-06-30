import React, { useState } from 'react';
import AccountDeleteModal from './Modals/AccountDeleteModal';
import PasswordChangeModal from './Modals/PasswordChangeModal';
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
  initialData?: UserProfile;
  onSave: (data: UserProfile) => void;
  onCancel: () => void;
};

const ProfileCard: React.FC<ProfileCardProps> = ({
  initialData,
  onSave,
  onCancel,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formData, setFormData] = useState<UserProfile>(
    initialData || {
      name: 'Taeyul',
      email: 'taeyul@example.com',
      phone: '010-1234-5678',
      interests: ['K-POP', '한식', '여행'],
      joinDate: '2025.06.07',
      stats: { travelPlans: 3, favorites: 12, visitedPlaces: 28 },
    }
  );

  const [tempFormData, setTempFormData] = useState<UserProfile>(formData);

  // 핸들러 함수들
  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setTempFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleInterestAdd = (interest: string) => {
    if (interest.trim() && !tempFormData.interests.includes(interest.trim())) {
      setTempFormData((prev) => ({
        ...prev,
        interests: [...prev.interests, interest.trim()],
      }));
    }
  };

  const handleInterestRemove = (interestToRemove: string) => {
    setTempFormData((prev) => ({
      ...prev,
      interests: prev.interests.filter(
        (interest) => interest !== interestToRemove
      ),
    }));
  };

  const handleSave = () => {
    setFormData(tempFormData);
    onSave(tempFormData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempFormData(formData);
    setIsEditing(false);
    onCancel();
  };

  const handleEditToggle = () => {
    isEditing ? handleCancel() : setIsEditing(true);
  };

  const handlePasswordChange = (passwords: {
    current: string;
    new: string;
    confirm: string;
  }) => {
    console.log('비밀번호 변경:', passwords);
    alert('비밀번호가 변경되었습니다.');
  };

  const handleAccountDelete = (
    selectedReasons: string[],
    customReason?: string
  ) => {
    console.log('계정 탈퇴:', { selectedReasons, customReason });
    alert('계정이 탈퇴되었습니다.');
  };

  return (
    <>
      <section className='mb-6 w-full rounded-lg bg-white p-6 shadow-md'>
        <h2 className='text-main-text-navy mb-6 text-2xl font-semibold'>
          반갑습니다 {formData.name}님
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
          onAccountDelete={() => setShowDeleteModal(true)}
        />
      </section>

      <PasswordChangeModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSave={handlePasswordChange}
      />

      <AccountDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleAccountDelete}
      />
    </>
  );
};

export default ProfileCard;
