import Button from '@/components/common/Button';
import AuthInput from '@/components/domain/auth/AuthInput';
import { useToast } from '@/hooks/useToast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form'; // FieldErrors 타입 임포트
import { useTranslation } from 'react-i18next';
import { z } from 'zod'; // Zod 스키마 정의를 위해 임포트
import PhoneInput from '../auth/PhoneInput';
import AgreementForm from '../auth/AgreementForm';

// 상수로 조건 정의
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 20;
const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/;

const signUpSchema = z
  .object({
    email: z.string().email('유효한 이메일 주소를 입력해주세요.'),
    // verificationCode는 input value가 string이므로 string으로 받고, optional 처리
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
  // const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>(
    'info'
  );

  const { showToast } = useToast();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting }, // isSubmitting 상태도 가져와 제출 중 UI 처리
    setValue, // react-hook-form의 setValue 함수 가져오기 (AuthInput의 onClear 연동)
    watch, // 비밀번호 확인 등 필요 시 watch 함수 사용 가능
    // getValues, // 특정 필드 값 가져오기 (필요 시)
  } = useForm<SignUpFormInputs>({
    resolver: zodResolver(signUpSchema), // Zod Resolver 연동
    mode: 'onBlur', // 필드에서 포커스를 잃을 때 유효성 검사
    defaultValues: {
      // 폼 초기값 설정 (선택 사항)
      email: '',
      verificationCode: '',
      name: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    },
  });

  // 비밀번호 실시간 감시
  const password = watch('password', '');

  // 비밀번호 유효성 검사 함수들
  // 비밀번호 유효성 검사 - 상수와 동일한 조건 사용
  const isValidLength =
    password.length >= PASSWORD_MIN_LENGTH &&
    password.length <= PASSWORD_MAX_LENGTH;
  const hasLetterNumberSpecial = PASSWORD_REGEX.test(password);

  /**
   * 에러 메시지 번역 매핑
   */
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
    // alert(`회원가입 시도: ${data.email}`); // alert() 제거, ToastMessage로 대체

    // 실제 회원가입 API 호출 로직 (비동기)
    try {
      // await yourSignUpApiCall(data); // 실제 API 호출 주석 처리
      // setToastMessage('회원가입에 성공했습니다! 로그인 페이지로 이동합니다.');
      // setToastType('success');
      showToast(
        '회원가입에 성공했습니다! 로그인 페이지로 이동합니다.',
        'success'
      );
      // setShowToast(true);
      // 성공 후 리디렉션 처리 (예: navigate('/login'))
    } catch (error) {
      // setToastMessage('회원가입에 실패했습니다. 다시 시도해주세요.');
      showToast('회원가입에 실패했습니다. 다시 시도해주세요.', 'error');
      // setToastType('error');
      // setShowToast(true);
      console.error('회원가입 오류:', error);
    }
  };

  // AuthInput의 onClear prop에 연결할 함수
  // AuthInput에서 (name, value)를 전달받아 react-hook-form의 setValue를 호출합니다.
  const handleAuthInputClear = (
    fieldName: keyof SignUpFormInputs,
    value: string
  ) => {
    setValue(fieldName, value, {
      shouldValidate: true, // 클리어 후 유효성 재검사 (선택 사항)
      shouldDirty: true, // 필드가 dirty 상태로 표시되도록 (선택 사항)
      shouldTouch: true, // 필드가 touched 상태로 표시되도록 (선택 사항)
    });
  };

  return (
    <div className='flex w-full flex-col gap-4'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='mt-8 flex w-full flex-col gap-4'
      >
        <div className=''>
          <AuthInput
            {...register('email')}
            type='email'
            label={t('auth.email')}
            placeholder='k@example.com'
            id='email'
            onClear={(name, value) =>
              handleAuthInputClear(name as keyof SignUpFormInputs, value)
            } // onClear 연결
            autoComplete='email' // 자동 완성 속성 추가
          />
          {errors.email && (
            <p className='text-error-red my-2 text-sm'>
              {getErrorMessage(errors.email.message!)}
            </p>
          )}
        </div>

        <div className=''>
          <AuthInput
            {...register('verificationCode')}
            type='text' // Zod는 string을 받지만, input type은 number로 설정 가능 (브라우저 유효성 도움)
            label={t('auth.verification_code')}
            placeholder={t('auth.enter_verification_code')}
            id='verificationCode'
            onClear={(name, value) =>
              handleAuthInputClear(name as keyof SignUpFormInputs, value)
            }
          />
          {errors.verificationCode && (
            <p className='text-error-red my-2 text-sm'>
              {getErrorMessage(errors.verificationCode.message!)}
            </p>
          )}
        </div>
        <div className=''>
          {/* 이름 필드 */}
          <AuthInput
            {...register('name')}
            type='text'
            label={t('auth.name')}
            placeholder={t('auth.please_enter_name')}
            id='name'
            onClear={(name, value) =>
              handleAuthInputClear(name as keyof SignUpFormInputs, value)
            }
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
            onChange={(phoneValue, fullNumber) => {
              setValue('phoneNumber', phoneValue, { shouldValidate: true });
            }}
            onClear={(name, value) =>
              handleAuthInputClear(name as keyof SignUpFormInputs, value)
            }
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
          {/* 비밀번호  필드 */}
          <AuthInput
            {...register('password')}
            type='password'
            label={t('auth.password')}
            placeholder={t('auth.enter_password')}
            id='password'
            onClear={(name, value) =>
              handleAuthInputClear(name as keyof SignUpFormInputs, value)
            }
            autoComplete='new-password'
          />
          {errors.password && (
            <p className='text-error-red my-2 text-sm'>
              {getErrorMessage(errors.password.message!)}
            </p>
          )}

          {/* 비밀번호 유효성 체크 리스트 - 항상 표시 */}
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
          {/* 비밀번호 확인 필드 */}
          <AuthInput
            {...register('confirmPassword')}
            type='password'
            label={t('auth.confirm_password')}
            placeholder={t('auth.enter_confirm_password')}
            id='confirmPassword'
            onClear={(name, value) =>
              handleAuthInputClear(name as keyof SignUpFormInputs, value)
            }
            autoComplete='new-password'
          />
          {errors.confirmPassword && (
            <p className='text-error-red my-2 text-sm'>
              {getErrorMessage(errors.confirmPassword.message!)}
            </p>
          )}
        </div>
        <AgreementForm />

        {/* 폼 제출 버튼 */}
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
