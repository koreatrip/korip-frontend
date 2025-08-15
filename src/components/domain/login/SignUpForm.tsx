import Button from '@/components/common/Button';
import AuthInput from '@/components/domain/auth/AuthInput';
import { useToast } from '@/hooks/useToast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useSSR, useTranslation } from 'react-i18next';
import { z } from 'zod';
import PhoneInput from '../auth/PhoneInput';
import AgreementForm from '../auth/AgreementForm';
import {
  useEmailSendMutation,
  useEmailCheckMutation,
} from '@/api/auth/signup/email/emailHooks';
import { useEffect, useRef, useState } from 'react';

// 상수로 조건 정의
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 20;
const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/;

const signUpSchema = z
  .object({
    email: z.string().email('유효한 이메일 주소를 입력해주세요.'),
    verificationCode: z.string().optional(),
    name: z
      .string()
      .min(2, '이름은 최소 2자 이상이어야 합니다.')
      .max(50, '이름은 50자를 초과할 수 없습니다.'),
    phoneNumber: z.string().optional().or(z.literal('')), // 빈 문자열도 허용하도록 추가
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, '비밀번호는 최소 8자 이상이어야 합니다.')
      .max(PASSWORD_MAX_LENGTH, '비밀번호는 최대 20자 이하여야 합니다.')
      .regex(PASSWORD_REGEX, '영문, 숫자, 특수문자를 포함해야 합니다.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'], // 에러 메시지가 표시될 필드
  });

// Zod 스키마로부터 폼 데이터 타입 추론
type SignUpFormInputs = z.infer<typeof signUpSchema>;

const SignUpForm = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // useMutation 훅에서 mutate 함수를 sendMutate 별칭으로 받아옵니다.
  const { mutate: sendMutate, isPending: isSendingEmail } =
    useEmailSendMutation({
      onSuccess: () => {
        showToast('인증 메일이 발송되었습니다.', 'success');
        setIsVerifying(true);
        setTimeLeft(60);
      },
      onError: (error) => {
        // API 응답의 에러 메시지를 추출합니다.
        const errorMessage =
          error.response?.data?.error_message ||
          '인증 메일 발송에 실패했습니다.';
        // 추출한 에러 메시지를 토스트로 보여줍니다.
        showToast(errorMessage, 'error');
      },
    });

  // useMutation 훅에서 mutate 함수를 checkMutate 별칭으로 받아옵니다.
  const { mutate: checkMutate, isPending: isCheckingEmail } =
    useEmailCheckMutation({
      onSuccess: () => {
        showToast('인증 코드가 확인되었습니다.', 'success');
        // 인증 성공 시 타이머 중지
        setIsVerifying(false);
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      },
      onError: () => {
        showToast('인증 코드 확인에 실패했습니다.', 'error');
      },
    });
  useEffect(() => {
    if (isVerifying) {
      // 1초마다 남은 시간 업데이트
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }
    // 컴포넌트 언마운트 시 또는 isVerifying이 false가 될 때 타이머 정리
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isVerifying]);
  useEffect(() => {
    if (timeLeft === 0) {
      setIsVerifying(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      showToast('인증 유효 시간이 만료되었습니다.', 'error');
    }
  }, [timeLeft]);
  const { showToast } = useToast();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    setValue,
    watch,
    getValues,
  } = useForm<SignUpFormInputs>({
    resolver: zodResolver(signUpSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      verificationCode: '',
      name: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    },
  });

  const currentPassword = watch('password', '');
  const isValidLength =
    currentPassword.length >= PASSWORD_MIN_LENGTH &&
    currentPassword.length <= PASSWORD_MAX_LENGTH;
  const hasLetterNumberSpecial = PASSWORD_REGEX.test(currentPassword);

  const getErrorMessage = (error: string) => {
    const errorMap: Record<string, string> = {
      '유효한 이메일 주소를 입력해주세요.': t('auth.invalid_email_format'),
      '이름은 최소 2자 이상이어야 합니다.': t('auth.name_min_length'),
      '이름은 50자를 초과할 수 없습니다.': t('auth.name_max_length'),
      '유효한 전화번호 형식(010-XXXX-XXXX)을 입력해주세요.': t(
        'auth.invalid_phone_format'
      ),
      '비밀번호는 최소 8자 이상이어야 합니다.': t(
        'auth.password_min_8_characters'
      ),
      '비밀번호는 최대 20자 이하여야 합니다.': t(
        'auth.password_max_20_characters'
      ),
      '영문, 숫자, 특수문자를 포함해야 합니다.': t(
        'auth.letter_number_special_combo'
      ),
      '비밀번호가 일치하지 않습니다.': t('auth.password_mismatch'),
    };
    return errorMap[error] || error;
  };

  const onSubmit = async (data: SignUpFormInputs) => {
    console.log('회원가입 폼 데이터:', data);
    try {
      // await yourSignUpApiCall(data);
      showToast(
        '회원가입에 성공했습니다! 로그인 페이지로 이동합니다.',
        'success'
      );
    } catch (error) {
      showToast('회원가입에 실패했습니다. 다시 시도해주세요.', 'error');
      console.error('회원가입 오류:', error);
    }
  };

  const handleAuthInputClear = (fieldName: keyof SignUpFormInputs) => {
    setValue(fieldName, '', {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleEmailSend = () => {
    const email = getValues('email');
    if (!email) {
      showToast('이메일을 입력해주세요.', 'error');
      return;
    }
    if (isVerifying || isSendingEmail) return;
    sendMutate({ email });
  };

  const handleEmailCheck = () => {
    const email = getValues('email');
    const code = getValues('verificationCode');
    if (!email || !code) {
      showToast('이메일과 인증 코드를 입력해주세요.', 'error');
      return;
    }
    checkMutate({ email, code });
  };

  return (
    <div className='flex w-full flex-col gap-4'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='mt-8 flex w-full flex-col gap-4'
      >
        <div className=''>
          <div className='flex items-center justify-between gap-2'>
            <AuthInput
              {...register('email')}
              type='email'
              label={t('auth.email')}
              placeholder='k@example.com'
              id='email'
              onClear={() => handleAuthInputClear('email')}
              autoComplete='email'
            />
            <Button
              type='button'
              className='mt-8 flex h-12 flex-2/5'
              onClick={handleEmailSend}
              disabled={isSendingEmail || isVerifying}
            >
              {isSendingEmail ? '전송 중...' : t('auth.email_send')}
            </Button>
          </div>

          {isVerifying && (
            <p className='mt-2 text-sm'>
              남은 시간: <span className='font-bold'>{timeLeft}초</span>
            </p>
          )}

          {errors.email && (
            <p className='text-error-red my-2 text-sm'>
              {getErrorMessage(errors.email.message!)}
            </p>
          )}
        </div>
        <div className=''>
          <div className='flex items-center justify-between gap-2'>
            <AuthInput
              {...register('verificationCode')}
              type='text'
              label={t('auth.verification_code')}
              placeholder={t('auth.enter_verification_code')}
              id='verificationCode'
              onClear={() => handleAuthInputClear('verificationCode')}
            />
            <Button
              type='button'
              className='mt-8 flex h-12 flex-2/5'
              onClick={handleEmailCheck}
              disabled={isCheckingEmail}
            >
              {isCheckingEmail ? '확인 중...' : t('auth.email_verification')}
            </Button>
            {errors.verificationCode && (
              <p className='text-error-red my-2 text-sm'>
                {getErrorMessage(errors.verificationCode.message!)}
              </p>
            )}
          </div>
        </div>

        <div className=''>
          <AuthInput
            {...register('name')}
            type='text'
            label={t('auth.name')}
            placeholder={t('auth.please_enter_name')}
            id='name'
            onClear={() => handleAuthInputClear('name')}
            autoComplete='name'
          />
          {errors.name && (
            <p className='text-error-red my-2 text-sm'>
              {getErrorMessage(errors.name.message!)}
            </p>
          )}
        </div>
        <div className=''>
          <PhoneInput
            label={t('auth.phone_number')}
            placeholder={t('auth.phone_number_placeholder')}
            value={watch('phoneNumber')}
            onChange={(phoneValue) => {
              setValue('phoneNumber', phoneValue, { shouldValidate: true });
            }}
            onClear={() => handleAuthInputClear('phoneNumber')}
            defaultCountry='KR'
            name='phoneNumber'
            id='phoneNumber'
          />
          {errors.phoneNumber && (
            <p className='text-error-red my-2 text-sm'>
              {getErrorMessage(errors.phoneNumber.message!)}
            </p>
          )}
        </div>

        <div className=''>
          <AuthInput
            {...register('password')}
            type='password'
            label={t('auth.password')}
            placeholder={t('auth.enter_password')}
            id='password'
            onClear={() => handleAuthInputClear('password')}
            autoComplete='new-password'
          />
          {errors.password && (
            <p className='text-error-red my-2 text-sm'>
              {getErrorMessage(errors.password.message!)}
            </p>
          )}

          <div className='mt-2 space-y-1'>
            <div
              className={`flex items-center text-sm transition-colors ${isValidLength ? 'text-sub-green' : 'text-sub-text-gray'}`}
            >
              <span className='mr-2'>•</span>
              {t('auth.password_length_8_20')}
            </div>
            <div
              className={`flex items-center text-sm transition-colors ${hasLetterNumberSpecial ? 'text-sub-green' : 'text-sub-text-gray'}`}
            >
              <span className='mr-2'>•</span>
              {t('auth.letter_number_special_combo')}
            </div>
          </div>
        </div>
        <div className=''>
          <AuthInput
            {...register('confirmPassword')}
            type='password'
            label={t('auth.confirm_password')}
            placeholder={t('auth.enter_confirm_password')}
            id='confirmPassword'
            onClear={() => handleAuthInputClear('confirmPassword')}
            autoComplete='new-password'
          />
          {errors.confirmPassword && (
            <p className='text-error-red my-2 text-sm'>
              {getErrorMessage(errors.confirmPassword.message!)}
            </p>
          )}
        </div>
        <AgreementForm />

        <Button
          type='submit'
          variant='active'
          className='mt-6 w-full py-3.5'
          disabled={isSubmitting || !isValid}
        >
          {t('auth.signup')}
        </Button>
      </form>
    </div>
  );
};

export default SignUpForm;
