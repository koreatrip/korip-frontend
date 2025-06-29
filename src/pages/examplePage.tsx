// 📁 pages/ExamplePage.tsx

import AuthInput from '@/components/domain/auth/AuthInput';
import Button from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { useState } from 'react';
import PlaceDetailModal from '@/components/domain/regions/PlaceDetailModal';

const ExamplePage = () => {
  // 각 모달의 열림/닫힘 상태를 관리
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPlaceDetailModalOpen, setIsPlaceDetailModalOpen] = useState(false);

  return (
    <div className='flex h-screen w-full flex-col items-center justify-center space-y-4'>
      <h1 className='text-3xl font-bold'>공용 모달 테스트 페이지</h1>

      {/* 각 모달을 여는 버튼들 */}
      <div className='flex space-x-4'>
        <Button onClick={() => setIsLoginModalOpen(true)}>
          로그인 안내 모달 열기
        </Button>
        <Button onClick={() => setIsDeleteModalOpen(true)}>
          계정 탈퇴 모달 열기
        </Button>
        <Button onClick={() => setIsPlaceDetailModalOpen(true)}>
          디테일 모달 열기
        </Button>
      </div>

      <PlaceDetailModal
        isOpen={isPlaceDetailModalOpen}
        onClose={() => setIsPlaceDetailModalOpen(false)}
      />

      {/* --- 1. 로그인 안내 모달 --- */}
      <Modal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className='flex flex-col items-center justify-center gap-2'>
            <p className='text-2xl font-medium'>나만의 여행을 계획해보세요!</p>
            <p className='text-sub-text-gray'>
              나만의 여행 일정을 만들고 저장하려면 로그인이 필요해요.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className='mt-14 flex w-full flex-col gap-y-2'>
            <Button variant='active'>로그인하고 시작하기</Button>
            <Button variant='cancel' onClick={() => setIsLoginModalOpen(false)}>
              나중에 할게요.
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      {/* --- 2. 계정 탈퇴 모달 (복잡한 폼 예시) --- */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <Modal.Header>계정 탈퇴</Modal.Header>
        <Modal.Body>
          {/* Body 안에는 이렇게 복잡한 폼이나 다른 컴포넌트가 자유롭게 들어갈 수 있습니다. */}
          <div className='space-y-4'>
            <div className='border-point-gold text-main-text-navy rounded-lg border bg-[#F7F0E8] p-3 text-sm'>
              <p>
                <strong>⚠️ 주의:</strong> 계정을 탈퇴하면 모든 여행 계획,
                즐겨찾기, 개인정보가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수
                없습니다.
              </p>
            </div>
            <fieldset>
              <legend className='font-semibold text-gray-700'>
                탈퇴 사유를 선택해주세요
              </legend>
              <div className='mt-2 space-y-2'>
                {/* 라디오 버튼 등 자유롭게 구성 */}
                <label className='flex items-center'>
                  <input type='radio' name='reason' className='mr-2' /> 서비스
                  미사용
                </label>
                <label className='flex items-center'>
                  <input type='radio' name='reason' className='mr-2' /> 개인정보
                  보호 우려
                </label>
              </div>
            </fieldset>
            <AuthInput type='password' label='비밀번호 확인' />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className='mt-10 flex w-full flex-col gap-y-2'>
            <Button
              variant='cancel'
              onClick={() => setIsDeleteModalOpen(false)}
            >
              취소
            </Button>
            <Button variant='active'>탈퇴</Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ExamplePage;
