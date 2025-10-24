import Modal, { Body, Footer, Header } from '@/components/common/Modal';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useIdolRequestMutation } from '@/api/idol/idolHooks';
import { useToast } from '@/hooks/useToast';
import Spinner from '@/components/common/Spinner';
import { Trans, useTranslation } from 'react-i18next';

type FormValues = {
  idol_name: string;
  agency?: string;
  related_info?: string;
  additional_notes?: string;
};

type IdolRequestModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const IdolRequestModal = ({ isOpen, onClose }: IdolRequestModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const { showToast } = useToast();
  const { t } = useTranslation();
  const idolRequestMutation = useIdolRequestMutation();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const response = await idolRequestMutation.mutateAsync({
        idol_name: data.idol_name,
        agency: data.agency || undefined,
        related_info: data.related_info || undefined,
        additional_notes: data.additional_notes || undefined,
      });

      showToast(response.message || t('kpop.idol_request_success'), 'success');
      reset();
      onClose();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || t('kpop.idol_request_failed');
      showToast(errorMessage, 'error');
      console.error('아이돌 신청 실패:', error);
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Header>{t('kpop.request_idol')}</Header>
      <Body>
        <div className='max-h-[70vh] overflow-y-auto'>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-4'
          >
            <div>
              <label
                htmlFor='idol_name'
                className='text-md mb-1.5 block font-semibold'
              >
                {t('kpop.idol_group_name')}
                <span className='text-error-red'>*</span>
              </label>
              <Input
                id='idol_name'
                placeholder={t('common.example')}
                {...register('idol_name', {
                  required: t('common.required_field'),
                  minLength: {
                    value: 1,
                    message: t('kpop.enter_idol_name'),
                  },
                  maxLength: {
                    value: 100,
                    message: t('kpop.enter_within_100_characters'),
                  },
                })}
              />
              {errors.idol_name && (
                <span className='text-error-red mt-2 block'>
                  {errors.idol_name.message}
                </span>
              )}
            </div>

            <div>
              <label
                htmlFor='agency'
                className='text-md mb-1.5 block font-semibold'
              >
                <Trans
                  i18nKey='kpop.agency_optional'
                  components={{
                    optional: (
                      <span className='text-sub-text-gray font-medium' />
                    ),
                  }}
                />
              </label>
              <Input
                id='agency'
                placeholder={t('kpop.example_agency')}
                {...register('agency', {
                  maxLength: {
                    value: 100,
                    message: t('kpop.enter_within_100_characters'),
                  },
                })}
              />
              {errors.agency && (
                <span className='text-error-red mt-2 block'>
                  {errors.agency.message}
                </span>
              )}
            </div>

            <div>
              <label
                htmlFor='related_info'
                className='text-md mb-1.5 block font-semibold'
              >
                <Trans
                  i18nKey='kpop.related_info_optional'
                  components={{
                    optional: (
                      <span className='text-sub-text-gray font-medium' />
                    ),
                  }}
                />
              </label>
              <Input
                id='related_info'
                placeholder={t('kpop.example_description')}
                {...register('related_info')}
              />
            </div>

            <div>
              <label
                htmlFor='additional_notes'
                className='text-md mb-1.5 block font-semibold'
              >
                <Trans
                  i18nKey='kpop.remarks_optional'
                  components={{
                    optional: (
                      <span className='text-sub-text-gray font-medium' />
                    ),
                  }}
                />
              </label>
              <textarea
                id='additional_notes'
                className='ring-outline-gray placeholder:text-sub-text-gray focus:ring-main-pink shadow-light h-[150px] w-full resize-none rounded-lg border-0 px-4 py-4 ring-1 outline-none ring-inset focus:ring-2 focus:ring-inset'
                placeholder={t('kpop.optional_message')}
                {...register('additional_notes')}
              />
            </div>

            <div className='border-error-red mb-5 w-full rounded-md border-1 bg-red-50 p-3 text-center'>
              <p>
                💡 {t('kpop.idol_request_review_notice')}
                <br />
                {t('kpop.idol_request_time_notice')}
              </p>
            </div>

            <div className='flex gap-4'>
              <Button
                type='button'
                variant='cancel'
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                {t('common.cancel')}
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? <Spinner /> : t('kpop.request_idol')}
              </Button>
            </div>
          </form>
        </div>
      </Body>
      <Footer>{''}</Footer>
    </Modal>
  );
};

export default IdolRequestModal;
