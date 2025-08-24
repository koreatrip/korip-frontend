import Modal, { Body, Footer, Header } from '@/components/common/Modal';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { useForm, type SubmitHandler } from 'react-hook-form';

type FormValues = {
  idolName: string;
  company?: string;
  info?: string;
  append?: string;
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
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Header>아이돌 신청하기</Header>
      <Body>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
          <div>
            <label
              htmlFor='idolName'
              className='text-md mb-1.5 block font-semibold'
            >
              아이돌/그룹 이름<span className='text-error-red'>*</span>
            </label>
            <Input
              id='idolName'
              placeholder='예: 아이브, 스트레이키즈'
              {...register('idolName', { required: true })}
            />
            {errors.idolName && (
              <span className='text-error-red mt-2 block'>
                필수 입력사항입니다.{' '}
              </span>
            )}
          </div>
          <div>
            <label
              htmlFor='company'
              className='text-md mb-1.5 block font-semibold'
            >
              소속사{' '}
              <span className='text-sub-text-gray font-medium'>
                {' '}
                (선택사항)
              </span>
            </label>
            <Input
              id='company'
              placeholder='예: 스타쉽, 빅히트'
              {...register('company')}
            />
          </div>
          <div>
            <label
              htmlFor='info'
              className='text-md mb-1.5 block font-semibold'
            >
              관련정보{' '}
              <span className='text-sub-text-gray font-medium'>
                {' '}
                (선택사항)
              </span>
            </label>
            <Input
              id='info'
              placeholder='예: 떠오르는 스타'
              {...register('info')}
            />
          </div>
          <div>
            <label
              htmlFor='append'
              className='text-md mb-1.5 block font-semibold'
            >
              비고/하고싶은 말{' '}
              <span className='text-sub-text-gray font-medium'>
                {' '}
                (선택사항)
              </span>
            </label>
            <textarea
              id='append'
              className='ring-outline-gray placeholder:text-outline-gray focus:ring-main-pink shadow-light h-[150px] w-full resize-none rounded-lg border-0 px-4 py-4 ring-1 outline-none ring-inset focus:ring-2 focus:ring-inset'
              placeholder='추가로 전달하고 싶은 내용이 있다면 자유롭게 작성해주세요.'
              {...register('append')}
            />
          </div>
          <div className='border-error-red mb-5 w-full rounded-md border-1 bg-red-50 p-3 text-center'>
            <p>
              💡 신청해주신 아이돌/그룹은 검토 후 업데이트 될 예정입니다. <br />
              일정시간이 소요될 수 있으니 양해 부탁드립니다.
            </p>
          </div>
          <div className='flex gap-4'>
            <Button type='reset' variant='cancel'>
              취소
            </Button>
            <Button type='submit'>신청하기</Button>
          </div>
        </form>
      </Body>
      <Footer>{''}</Footer>
    </Modal>
  );
};

export default IdolRequestModal;
