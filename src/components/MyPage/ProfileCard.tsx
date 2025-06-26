import { CameraIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';

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

  return (
    <section className='mb-6 w-full rounded-lg bg-white p-6 shadow-md'>
      <h2 className='text-main-text-navy mb-6 text-2xl font-semibold'>
        반갑습니다 {formData.name}님
      </h2>

      {/* 기본정보 섹션 */}
      <section className='bg-bg-gray mb-6 rounded-md p-6 shadow-md'>
        <div className='mb-6 flex items-center justify-between'>
          <h3 className='text-main-text-navy text-lg font-bold'>기본정보</h3>
          <Button
            variant={isEditing ? 'cancel' : 'active'}
            className='h-10 w-20 text-sm'
            onClick={handleEditToggle}
          >
            {isEditing ? '취소' : '수정'}
          </Button>
        </div>

        {/* 프로필 이미지 */}
        <div className='mb-6 flex justify-center'>
          <div className='relative'>
            <div className='bg-outline-gray flex h-24 w-24 items-center justify-center overflow-hidden rounded-full'>
              {formData.profileImage ? (
                <img
                  src={formData.profileImage}
                  alt='프로필 이미지'
                  className='h-full w-full object-cover'
                />
              ) : (
                <span className='text-bg-white text-2xl'>
                  {formData.name.charAt(0)}
                </span>
              )}
            </div>
            {isEditing && (
              <button className='bg-main-pink text-bg-white hover:bg-main-hover-pink absolute -right-1 -bottom-1 rounded-full p-2 transition-colors'>
                <CameraIcon className='h-4 w-4' />
              </button>
            )}
          </div>
        </div>

        {/* 사용자 정보 폼 */}
        <div className='space-y-4'>
          {/* 이름 */}
          <div className='flex items-center justify-between'>
            <span className='text-outline-gray w-20 text-sm font-medium'>
              이름
            </span>
            {isEditing ? (
              <div className='ml-4 flex-1'>
                <Input
                  value={tempFormData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder='이름을 입력하세요'
                />
              </div>
            ) : (
              <span className='text-main-text-navy'>{formData.name}</span>
            )}
          </div>

          <hr className='border-outline-gray border-t' />

          {/* 이메일 */}
          <div className='flex items-center justify-between'>
            <span className='text-outline-gray w-20 text-sm font-medium'>
              이메일
            </span>
            {isEditing ? (
              <div className='ml-4 flex-1'>
                <Input
                  type='email'
                  value={tempFormData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder='이메일을 입력하세요'
                />
              </div>
            ) : (
              <span className='text-main-text-navy'>{formData.email}</span>
            )}
          </div>

          <hr className='border-outline-gray border-t' />

          {/* 연락처 */}
          <div className='flex items-center justify-between'>
            <span className='text-outline-gray w-20 text-sm font-medium'>
              연락처
            </span>
            {isEditing ? (
              <div className='ml-4 flex-1'>
                <Input
                  type='tel'
                  value={tempFormData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder='연락처를 입력하세요'
                />
              </div>
            ) : (
              <span className='text-main-text-navy'>{formData.phone}</span>
            )}
          </div>

          <hr className='border-outline-gray border-t' />

          {/* 관심사 */}
          <div className='flex items-start justify-between'>
            <span className='text-outline-gray w-20 pt-2 text-sm font-medium'>
              관심사
            </span>
            <div className='ml-4 flex-1'>
              {isEditing ? (
                <div className='space-y-3'>
                  <div className='flex flex-wrap gap-2'>
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
                  <Input
                    placeholder='관심사를 입력하고 Enter를 누르세요'
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
              ) : (
                <div className='flex flex-wrap gap-2'>
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
        </div>

        {/* 저장/취소 버튼 (편집 모드일 때만) */}
        {isEditing && (
          <div className='mt-6 flex justify-end gap-3'>
            <Button variant='cancel' className='w-24' onClick={handleCancel}>
              취소
            </Button>
            <Button variant='active' className='w-24' onClick={handleSave}>
              저장
            </Button>
          </div>
        )}
      </section>

      {/* 계정현황 (읽기 전용) */}
      <section className='bg-bg-gray mb-6 rounded-md p-6 shadow-md'>
        <h3 className='text-main-text-navy mb-4 text-lg font-bold'>
          계정 현황
        </h3>

        <div className='text-outline-gray mb-4 flex items-center justify-between text-sm'>
          <span className='font-medium'>가입일</span>
          <span className='text-main-text-navy'>{formData.joinDate}</span>
        </div>

        <hr className='border-outline-gray mb-6 border-t' />

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
              <p className='text-outline-gray text-xs'>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 보안설정 (읽기 전용 + 버튼) */}
      <section className='bg-bg-gray mb-6 rounded-md p-6 shadow-md'>
        <h3 className='text-main-text-navy mb-4 text-lg font-bold'>
          보안 설정
        </h3>

        <div className='text-outline-gray space-y-4 text-sm'>
          <div className='flex items-center justify-between'>
            <span className='font-medium'>비밀번호</span>
            <span className='text-main-text-navy'>*********</span>
          </div>
          <hr className='border-outline-gray border-t' />

          <div className='flex items-center justify-between'>
            <span className='font-medium'>이메일 인증</span>
            <span className='font-medium text-green-600'>완료됨</span>
          </div>

          <div className='flex items-center justify-end gap-2 pt-4'>
            <Button variant='cancel' className='h-10 w-32'>
              비밀번호 변경
            </Button>
            <Button
              variant='cancel'
              className='h-10 w-24 !border-red-300 !text-red-500'
            >
              계정탈퇴
            </Button>
          </div>
        </div>
      </section>
    </section>
  );
};

export default ProfileCard;
