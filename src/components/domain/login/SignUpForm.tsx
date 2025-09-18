import Button from '@/components/common/Button';
import AuthInput from '@/components/domain/auth/AuthInput';
import { useToast } from '@/hooks/useToast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import PhoneInput from '../auth/PhoneInput';
import AgreementForm from '../auth/AgreementForm';
import {
  useEmailSendMutation,
  useEmailCheckMutation,
} from '@/api/auth/signup/email/emailHooks';
import { useEffect, useRef, useState } from 'react';
import { useSignupMutation } from '@/api/auth/signup/signupHooks';
import { useNavigate } from 'react-router';
import { AxiosError } from 'axios';

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
    phoneNumber: z.string().optional().or(z.literal('')),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, '비밀번호는 최소 8자 이상이어야 합니다.')
      .max(PASSWORD_MAX_LENGTH, '비밀번호는 최대 20자 이하여야 합니다.')
      .regex(PASSWORD_REGEX, '영문, 숫자, 특수문자를 포함해야 합니다.'),
    confirmPassword: z.string(),
    agreements: z.array(z.boolean()).refine((data) => data[0] && data[1], {
      message: '필수 약관에 동의해야 합니다.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

// Zod 스키마로부터 폼 데이터 타입 추론
export type SignUpFormInputs = z.infer<typeof signUpSchema>;

const SignUpForm = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    setValue,
    watch,
    getValues,
    control,
    trigger,
  } = useForm<SignUpFormInputs>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      verificationCode: '',
      name: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      agreements: [false, false, false],
    },
  });

  const { mutate: signupMutate } = useSignupMutation({
    onSuccess: () => {
      showToast(
        '회원가입에 성공했습니다! 로그인 페이지로 이동합니다.',
        'success'
      );
      navigate('/login', { replace: true });
    },
    onError: (
      error: Error /* variables: SignupRequest, context: unknown */
    ) => {
      const axiosError = error as AxiosError;
      const errorMessage =
        String(
          (axiosError.response?.data as { error_message?: string })
            ?.error_message || ''
        ) || '회원가입에 실패했습니다.';
      showToast(errorMessage, 'error');
    },
  });

  const { mutate: sendMutate, isPending: isSendingEmail } =
    useEmailSendMutation({
      onSuccess: () => {
        showToast('인증 메일이 발송되었습니다.', 'success');
        setIsVerifying(true);
        setTimeLeft(60);
      },
      onError: (
        error: Error
        /* variables: emailSendRequest,
        context: unknown */
      ) => {
        const axiosError = error as AxiosError;
        const errorMessage =
          String(
            (axiosError.response?.data as { error_message?: string })
              ?.error_message || ''
          ) || '인증 메일 발송에 실패했습니다.';
        showToast(errorMessage, 'error');
      },
    });

  const { mutate: checkMutate, isPending: isCheckingEmail } =
    useEmailCheckMutation({
      onSuccess: () => {
        showToast('인증 코드가 확인되었습니다.', 'success');
        setIsVerifying(false);
        setIsEmailVerified(true);
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      },
      onError: (
        error: Error
        /* variables: emailCheckRequset,
        context: unknown */
      ) => {
        const axiosError = error as AxiosError;
        const errorMessage =
          String(
            (axiosError.response?.data as { error_message?: string })
              ?.error_message || ''
          ) || '인증 코드 확인에 실패했습니다.';
        showToast(errorMessage, 'error');
      },
    });

  useEffect(() => {
    if (isVerifying) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }
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

  const currentPassword = watch('password', '');
  const isValidLength =
    currentPassword.length >= PASSWORD_MIN_LENGTH &&
    currentPassword.length <= PASSWORD_MAX_LENGTH;
  const hasLetterNumberSpecial = PASSWORD_REGEX.test(currentPassword);
  const agreements = watch('agreements');
  const allAgreementsChecked = (agreements?.[0] && agreements?.[1]) ?? false;

  const getErrorMessage = (error: string | undefined) => {
    if (!error) return ''; // Handle undefined or null error messages
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
      '필수 약관에 동의해야 합니다.': t('auth.agreement_required'),
    };
    return errorMap[error] || error;
  };

  const onSubmit = (data: SignUpFormInputs) => {
    signupMutate({
      email: data.email,
      nickname: data.name,
      phone_number: data.phoneNumber || '',
      password: data.password,
    });
  };

  const handleAuthInputClear = (fieldName: keyof SignUpFormInputs) => {
    setValue(fieldName, '', {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleEmailSend = async () => {
    // email 필드의 유효성 검사만 실행
    const isValidEmail = await trigger('email');
    if (!isValidEmail) {
      return;
    }

    const email = getValues('email');
    if (isVerifying || isSendingEmail) return;
    sendMutate({ email });
  };

  const handleEmailCheck = async () => {
    const email = getValues('email');
    const code = getValues('verificationCode') ?? '';

    // 이메일과 인증 코드 필드 유효성 검사
    const isValidEmailAndCode = await trigger(['email', 'verificationCode']);
    if (!isValidEmailAndCode) {
      return;
    }

    checkMutate({ email, code });
  };

  // 모든 필수 조건이 충족되었는지 확인하는 변수
  const isFormValid = isValid && isEmailVerified && allAgreementsChecked;

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
              disabled={isSendingEmail || isVerifying || isEmailVerified}
            >
              {isSendingEmail ? '전송 중...' : t('auth.email_send')}
            </Button>
          </div>

          {isVerifying && !isEmailVerified && (
            <p className='mt-2 text-sm'>
              남은 시간: <span className='font-bold'>{timeLeft}초</span>
            </p>
          )}

          {errors.email && (
            <p className='text-error-red my-2 text-sm'>
              {getErrorMessage(errors.email.message ?? '')}
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
              disabled={!isVerifying || isEmailVerified}
            />
            <Button
              type='button'
              className='mt-8 flex h-12 flex-2/5'
              onClick={handleEmailCheck}
              disabled={isCheckingEmail || !isVerifying || isEmailVerified}
            >
              {isCheckingEmail ? '확인 중...' : t('auth.email_verification')}
            </Button>
          </div>
          {errors.verificationCode && (
            <p className='text-error-red my-2 text-sm'>
              {getErrorMessage(errors.verificationCode.message ?? '')}
            </p>
          )}
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
              {getErrorMessage(errors.name.message ?? '')}
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
              {getErrorMessage(errors.phoneNumber.message ?? '')}
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
              {getErrorMessage(errors.password.message ?? '')}
            </p>
          )}

          <div className='mt-2 space-y-1'>
            <div
              className={`flex items-center text-sm transition-colors ${
                isValidLength ? 'text-sub-green' : 'text-sub-text-gray'
              }`}
            >
              <span className='mr-2'>•</span>
              {t('auth.password_length_8_20')}
            </div>
            <div
              className={`flex items-center text-sm transition-colors ${
                hasLetterNumberSpecial ? 'text-sub-green' : 'text-sub-text-gray'
              }`}
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
              {getErrorMessage(errors.confirmPassword.message ?? '')}
            </p>
          )}
        </div>
        <AgreementForm control={control} />

        <Button
          type='submit'
          className='mt-6 w-full py-3.5'
          disabled={isSubmitting || !isFormValid}
          variant={!isFormValid ? 'cancel' : 'active'}
        >
          {t('auth.signup')}
        </Button>
      </form>
    </div>
  );
};

export default SignUpForm;
