import Button from '@/components/common/Button';
import AuthInput from '@/components/domain/auth/AuthInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form'; // FieldErrors 타입 임포트
import { z } from 'zod'; // Zod 스키마 정의를 위해 임포트

const signUpSchema = z
  .object({
    email: z.string().email('유효한 이메일 주소를 입력해주세요.'),
    // verificationCode는 input value가 string이므로 string으로 받고, optional 처리
    verificationCode: z.string().optional(),
    name: z
      .string()
      .min(2, '이름은 최소 2자 이상이어야 합니다.')
      .max(50, '이름은 50자를 초과할 수 없습니다.'),
    phoneNumber: z
      .string()
      .regex(
        /^010-\d{4}-\d{4}$/,
        '유효한 전화번호 형식(010-XXXX-XXXX)을 입력해주세요.'
      )
      .optional()
      .or(z.literal('')), // 빈 문자열도 허용하도록 추가
    password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'], // 에러 메시지가 표시될 필드
  });

// Zod 스키마로부터 폼 데이터 타입 추론
type SignUpFormInputs = z.infer<typeof signUpSchema>;

const SignUpForm = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>(
    'info'
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting }, // isSubmitting 상태도 가져와 제출 중 UI 처리
    setValue, // react-hook-form의 setValue 함수 가져오기 (AuthInput의 onClear 연동)
    // watch, // 비밀번호 확인 등 필요 시 watch 함수 사용 가능
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

  const onSubmit = async (data: SignUpFormInputs) => {
    console.log('회원가입 폼 데이터:', data);
    // alert(`회원가입 시도: ${data.email}`); // alert() 제거, ToastMessage로 대체

    // 실제 회원가입 API 호출 로직 (비동기)
    try {
      // await yourSignUpApiCall(data); // 실제 API 호출 주석 처리
      setToastMessage('회원가입에 성공했습니다! 로그인 페이지로 이동합니다.');
      setToastType('success');
      setShowToast(true);
      // 성공 후 리디렉션 처리 (예: navigate('/login'))
    } catch (error) {
      setToastMessage('회원가입에 실패했습니다. 다시 시도해주세요.');
      setToastType('error');
      setShowToast(true);
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
            label='Email'
            placeholder='k@example.com'
            id='email'
            onClear={(name, value) =>
              handleAuthInputClear(name as keyof SignUpFormInputs, value)
            } // onClear 연결
            autoComplete='email' // 자동 완성 속성 추가
          />
          {errors.email && (
            <p className='my-2 text-sm text-red-500'>{errors.email.message}</p>
          )}
        </div>

        <div className=''>
          <AuthInput
            {...register('verificationCode')}
            type='number' // Zod는 string을 받지만, input type은 number로 설정 가능 (브라우저 유효성 도움)
            label='인증 코드 (선택 사항)'
            placeholder='인증 코드를 입력해주세요.'
            id='verificationCode'
            onClear={(name, value) =>
              handleAuthInputClear(name as keyof SignUpFormInputs, value)
            }
          />
          {errors.verificationCode && (
            <p className='my-2 text-sm text-red-500'>
              {errors.verificationCode.message}
            </p>
          )}
        </div>
        <div className=''>
          {/* 이름 필드 */}
          <AuthInput
            {...register('name')}
            type='text'
            label='이름'
            placeholder='이름을 입력해주세요.'
            id='name'
            onClear={(name, value) =>
              handleAuthInputClear(name as keyof SignUpFormInputs, value)
            }
            autoComplete='name'
          />
          {errors.name && (
            <p className='my-2 text-sm text-red-500'>{errors.name.message}</p>
          )}
        </div>

        <div className=''>
          {/* 전화번호 필드 (선택 사항) */}
          <AuthInput
            {...register('phoneNumber')}
            type='text'
            label='전화번호 (선택 사항)'
            placeholder='010-XXXX-XXXX'
            id='phoneNumber'
            onClear={(name, value) =>
              handleAuthInputClear(name as keyof SignUpFormInputs, value)
            }
            autoComplete='tel'
          />
          {errors.phoneNumber && (
            <p className='my-2 text-sm text-red-500'>
              {errors.phoneNumber.message}
            </p>
          )}
        </div>

        <div className=''>
          {/* 비밀번호 필드 */}
          <AuthInput
            {...register('password')}
            type='password'
            label='비밀번호'
            placeholder='비밀번호를 입력해주세요.'
            id='password'
            onClear={(name, value) =>
              handleAuthInputClear(name as keyof SignUpFormInputs, value)
            }
            autoComplete='new-password' // 새 비밀번호 자동 완성
          />
          {errors.password && (
            <p className='my-2 text-sm text-red-500'>
              {errors.password.message}
            </p>
          )}
        </div>
        <div className=''>
          {/* 비밀번호 확인 필드 */}
          <AuthInput
            {...register('confirmPassword')}
            type='password'
            label='비밀번호 확인'
            placeholder='비밀번호를 다시 입력해주세요.'
            id='confirmPassword'
            onClear={(name, value) =>
              handleAuthInputClear(name as keyof SignUpFormInputs, value)
            }
            autoComplete='new-password' // 새 비밀번호 확인 자동 완성
          />
          {errors.confirmPassword && (
            <p className='my-2 text-sm text-red-500'>
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* 폼 제출 버튼 */}
        <Button
          type='submit'
          variant='active'
          className='mt-6 w-full py-3.5' // 높이를 AuthInput과 유사하게 조정
          disabled={isSubmitting || !isValid} // 제출 중이거나 폼이 유효하지 않을 때 비활성화
        >
          {isSubmitting ? '계정 생성 중...' : '계정 생성'}
        </Button>
      </form>
    </div>
  );
};

export default SignUpForm;
