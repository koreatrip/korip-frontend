import Modal from '@/components/common/Modal';
import { useTranslation } from 'react-i18next';

import TermsOfServiceContent from './TermsOfServiceContent';
import PrivacyPolicyContent from './PrivacyPolicyContent';
import LocationServiceContent from './LocationServiceContent'; // 추가
import { useState } from 'react';
import { useModalStore } from '@/stores/useModalStore';
import AgreementCheckbox from './AgreementCheckbox';

const AgreementForm = () => {
  const { t } = useTranslation();

  // 체크박스 상태는 로컬 상태로 관리
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    location: false, // 추가
  });

  // 모달 상태는 Zustand 스토어에서 가져오기
  const { stack, actions } = useModalStore();

  const handleCheckboxChange = (key) => {
    setAgreements((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div>
      <div className='space-y-4'>
        {/* 필수 동의 */}
        <div>
          <h3 className='text-main-text-navy mb-2 text-sm font-medium'>
            필수 동의
          </h3>
          <div className='space-y-1'>
            <AgreementCheckbox
              id='terms'
              type='terms'
              required={true}
              checked={agreements.terms}
              onChange={() => handleCheckboxChange('terms')}
              onLinkClick={actions.openTermsOfService}
            />

            <AgreementCheckbox
              id='privacy'
              type='privacy'
              required={true}
              checked={agreements.privacy}
              onChange={() => handleCheckboxChange('privacy')}
              onLinkClick={actions.openPrivacyPolicy}
            />
          </div>
        </div>

        {/* 선택 동의 */}
        <div>
          <h3 className='text-main-text-navy mb-2 text-sm font-medium'>
            선택 동의
          </h3>
          <div className='space-y-1'>
            <AgreementCheckbox
              id='location'
              type='location'
              required={false}
              checked={agreements.location}
              onChange={() => handleCheckboxChange('location')}
              onLinkClick={actions.openLocationService}
            />
          </div>
        </div>
      </div>

      {/* 이용약관 모달 */}
      <Modal
        isOpen={stack.isTermsOfServiceOpen}
        onClose={actions.closeTermsOfService}
      >
        <Modal.Header>{t('modal.terms.title')}</Modal.Header>
        <Modal.Body>
          <TermsOfServiceContent />
        </Modal.Body>
        <Modal.Footer>
          <></>
        </Modal.Footer>
      </Modal>

      {/* 개인정보처리방침 모달 */}
      <Modal
        isOpen={stack.isPrivacyPolicyOpen}
        onClose={actions.closePrivacyPolicy}
      >
        <Modal.Header>{t('modal.privacy.title')}</Modal.Header>
        <Modal.Body>
          <PrivacyPolicyContent />
        </Modal.Body>
        <Modal.Footer>
          <></>
        </Modal.Footer>
      </Modal>

      {/* 위치기반서비스 모달 */}
      <Modal
        isOpen={stack.isLocationServiceOpen}
        onClose={actions.closeLocationService}
      >
        <Modal.Header>{t('modal.location.title')}</Modal.Header>
        <Modal.Body>
          <LocationServiceContent />
        </Modal.Body>
        <Modal.Footer>
          <></>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AgreementForm;
