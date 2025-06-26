import React, { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import AccountDeleteModal from './Modals/AccountDeleteModal';
import PasswordChangeModal from './Modals/PasswordChangeModal';

// 타입 정의 (나중에 types/user.ts로 이동)
interface UserProfile {
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
}

interface ProfileCardProps {
  initialData?: UserProfile;
  onSave: (data: UserProfile) => void;
  onCancel: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  initialData,
  onSave,
  onCancel,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  // 모달 상태 관리
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formData, setFormData] = useState<UserProfile>(
    initialData || {
      name: 'Taeyul',
      email: 'taeyul@example.com',
      phone: '010-1234-5678',
      interests: ['K-POP', '한식', '여행'],
      joinDate: '2025.06.07',
      stats: {
        travelPlans: 3,
        favorites: 12,
        visitedPlaces: 28,
      },
    }
  );

  const [tempFormData, setTempFormData] = useState<UserProfile>(formData);

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setTempFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
    if (isEditing) {
      handleCancel();
    } else {
      setIsEditing(true);
    }
  };

  // 비밀번호 변경 핸들러
  const handlePasswordChange = (passwords: {
    current: string;
    new: string;
    confirm: string;
  }) => {
    console.log('비밀번호 변경:', passwords);
    // TODO: API 호출 로직 추가
    alert('비밀번호가 변경되었습니다.');
  };

  // 계정 탈퇴 핸들러
  const handleAccountDelete = (
    selectedReasons: string[],
    customReason?: string
  ) => {
    console.log('계정 탈퇴:', { selectedReasons, customReason });
    // TODO: API 호출 로직 추가
    alert('계정이 탈퇴되었습니다.');
  };

  return (
    <>
      <section className='mb-6 w-full rounded-lg bg-white p-6 shadow-md'>
        <h2 className='text-main-text-navy mb-6 text-2xl font-semibold'>
          반갑습니다 {formData.name}님
        </h2>

        {/* 기본정보 섹션 */}
        <section className='mb-6 rounded-md bg-gray-50 p-6 shadow-md'>
          <div className='mb-6 flex items-center justify-between'>
            <h3 className='text-main-text-navy text-lg font-bold'>기본정보</h3>
            <Button
              variant='active'
              className='h-2 w-14 text-sm'
              onClick={handleEditToggle}
            >
              {isEditing ? '취소' : '수정'}
            </Button>
          </div>

          {/* 사용자 정보 폼 */}
          <div className='space-y-4'>
            {/* 이름 */}
            <div className='flex items-center justify-between'>
              <span className='text-main-text-navy w-20 text-sm font-medium'>
                이름
              </span>
              {isEditing ? (
                <div className='ml-4 flex-1'>
                  <Input
                    value={tempFormData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder='이름을 입력하세요'
                    className='!py-2'
                  />
                </div>
              ) : (
                <span className='text-gray-400'>{formData.name}</span>
              )}
            </div>

            <hr className='border-outline-gray -mt-4 border-t' />

            {/* 이메일 */}
            <div className='flex items-center justify-between'>
              <span className='text-main-text-navy w-20 text-sm font-medium'>
                이메일
              </span>
              {isEditing ? (
                <div className='ml-4 flex-1'>
                  <Input
                    type='email'
                    value={tempFormData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder='이메일을 입력하세요'
                    className='!py-2'
                  />
                </div>
              ) : (
                <span className='text-gray-400'>{formData.email}</span>
              )}
            </div>

            <hr className='border-outline-gray -mt-4 border-t' />

            {/* 연락처 */}
            <div className='flex items-center justify-between'>
              <span className='text-main-text-navy w-20 text-sm font-medium'>
                연락처
              </span>
              {isEditing ? (
                <div className='ml-4 flex-1'>
                  <Input
                    type='tel'
                    value={tempFormData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder='연락처를 입력하세요'
                    className='!py-2'
                  />
                </div>
              ) : (
                <span className='text-gray-400'>{formData.phone}</span>
              )}
            </div>

            <hr className='border-outline-gray -mt-4 border-t' />

            {/* 관심사 */}
            <div className='flex items-start justify-between'>
              <span className='text-main-text-navy w-20 pt-2 text-sm font-medium'>
                관심사
              </span>
              <div className='ml-4 flex-1'>
                {isEditing ? (
                  <div className='relative'>
                    <div className='border-outline-gray ring-outline-gray focus-within:ring-main-pink min-h-[48px] w-full rounded-lg border bg-white px-4 py-2 ring-1 focus-within:ring-2'>
                      <div className='mb-2 flex flex-wrap gap-2'>
                        {tempFormData.interests.map((interest) => (
                          <span
                            key={interest}
                            className='bg-main-pink text-bg-white inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs'
                          >
                            #{interest}
                            <button
                              type='button'
                              onClick={() => handleInterestRemove(interest)}
                              className='hover:text-main-hover-pink ml-1'
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <input
                        type='text'
                        placeholder='관심사를 입력하고 Enter를 누르세요'
                        className='placeholder:text-outline-gray w-full border-none bg-transparent outline-none'
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const target = e.target as HTMLInputElement;
                            handleInterestAdd(target.value);
                            target.value = '';
                          }
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className='flex flex-wrap justify-end gap-2'>
                    {formData.interests.map((interest) => (
                      <span
                        key={interest}
                        className='bg-main-pink text-bg-white rounded-full px-3 py-1 text-xs'
                      >
                        #{interest}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <hr className='border-outline-gray -mt-4 border-t' />
          </div>
        </section>

        {/* 계정현황 (읽기 전용) */}
        <section className='mb-6 rounded-md bg-gray-50 p-6 shadow-md'>
          <h3 className='text-main-text-navy mb-4 text-lg font-bold'>
            계정 현황
          </h3>

          <div className='mb-4 flex items-center justify-between text-sm'>
            <span className='text-main-text-navy font-medium'>가입일</span>
            <span className='text-gray-400'>{formData.joinDate}</span>
          </div>

          <hr className='border-outline-gray -mt-2 mb-4 border-t' />

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
            {[
              { label: '여행 일정', count: formData.stats.travelPlans },
              { label: '즐겨찾기', count: formData.stats.favorites },
              { label: '방문장소', count: formData.stats.visitedPlaces },
            ].map(({ label, count }) => (
              <div
                key={label}
                className='border-outline-gray bg-bg-white flex flex-col items-center justify-center rounded-md border p-4 text-center shadow-sm'
              >
                <p className='text-main-pink text-lg font-bold'>{count}</p>
                <p className='text-main-text-gray text-xs'>{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 보안설정 (읽기 전용 + 버튼) */}
        <section className='mb-6 rounded-md bg-gray-50 p-6 shadow-md'>
          <h3 className='text-main-text-navy mb-4 text-lg font-bold'>
            보안 설정
          </h3>

          <div className='space-y-4 text-sm'>
            <div className='flex items-center justify-between'>
              <span className='text-main-text-navy font-medium'>비밀번호</span>
              <span className='text-gray-400'>*********</span>
            </div>
            <hr className='border-outline-gray -mt-3 border-t' />

            <div className='flex items-center justify-between'>
              <span className='text-main-text-navy font-medium'>
                이메일 인증
              </span>
              <span
                className='flex h-[25px] w-[51px] items-center justify-center rounded-lg px-3 py-1 text-sm font-light text-white'
                style={{ backgroundColor: '#4A9B8E' }}
              >
                완료
              </span>
            </div>
            <hr className='border-outline-gray -mt-3 border-t' />

            <div className='flex items-center justify-end gap-2 pt-4'>
              <Button
                variant='cancel'
                className='h-10 w-32'
                onClick={() => setShowPasswordModal(true)}
              >
                비밀번호 변경
              </Button>
              <Button
                variant='cancel'
                className='h-10 w-32'
                onClick={() => setShowDeleteModal(true)}
              >
                계정탈퇴
              </Button>
            </div>
          </div>
        </section>
      </section>

      {/* 모달들 */}
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
