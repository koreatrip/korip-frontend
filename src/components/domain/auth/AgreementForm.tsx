import Modal from '@/components/common/Modal';
import { useTranslation } from 'react-i18next';
import { Controller, Control } from 'react-hook-form'; // Controller와 Control 타입을 임포트
import TermsOfServiceContent from './TermsOfServiceContent';
import PrivacyPolicyContent from './PrivacyPolicyContent';
import LocationServiceContent from './LocationServiceContent';
import { useModalStore } from '@/stores/useModalStore';
import AgreementCheckbox from './AgreementCheckbox';
import type { SignUpFormInputs } from '@/components/domain/login/SignUpForm';

// AgreementFormProps에 control prop을 추가합니다.
type AgreementFormProps = {
  control: Control<SignUpFormInputs>;
};

const AgreementForm = ({ control }: AgreementFormProps) => {
  const { t } = useTranslation();
  const { stack, actions } = useModalStore();

  return (
    <div>
      <div className='space-y-4'>
        {/* 필수 동의 */}
        <div>
          <h3 className='text-main-text-navy mb-2 text-sm font-medium'>
            필수 동의
          </h3>
          <div className='space-y-1'>
            {/* Controller를 사용하여 폼 상태와 연결 */}
            <Controller
              control={control}
              name='agreements.0' // 배열의 첫 번째 항목에 해당
              render={({ field }) => (
                <AgreementCheckbox
                  id='terms'
                  type='terms'
                  required={true}
                  checked={field.value}
                  onChange={field.onChange}
                  onLinkClick={actions.openTermsOfService}
                />
              )}
            />

            <Controller
              control={control}
              name='agreements.1' // 배열의 두 번째 항목에 해당
              render={({ field }) => (
                <AgreementCheckbox
                  id='privacy'
                  type='privacy'
                  required={true}
                  checked={field.value}
                  onChange={field.onChange}
                  onLinkClick={actions.openPrivacyPolicy}
                />
              )}
            />
          </div>
        </div>

        {/* 선택 동의 */}
        <div>
          <h3 className='text-main-text-navy mb-2 text-sm font-medium'>
            선택 동의
          </h3>
          <div className='space-y-1'>
            <Controller
              control={control}
              name='agreements.2' // 배열의 세 번째 항목에 해당
              render={({ field }) => (
                <AgreementCheckbox
                  id='location'
                  type='location'
                  required={false}
                  checked={field.value}
                  onChange={field.onChange}
                  onLinkClick={actions.openLocationService}
                />
              )}
            />
          </div>
        </div>
      </div>

      {/* 모달 컴포넌트들 (변경 없음) */}
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
