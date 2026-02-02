import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFindAccountMutation } from '@/api/auth/account/accountHooks';

export const useFindAccount = () => {
  const { t } = useTranslation();

  // 상태값들
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullPhoneNumber, setFullPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [foundAccounts, setFoundAccounts] = useState<any[]>([]);

  // API Mutation
  const findAccountMutation = useFindAccountMutation({
    onSuccess: (data) => {
      if (data.accounts.length > 0) {
        setFoundAccounts(data.accounts);
        setError('');
      } else {
        setError('등록된 계정이 없습니다.');
      }
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || '계정 찾기에 실패했습니다.');
    },
  });

  // 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      setError(t('auth.please_enter_phone'));
      return;
    }
    setError('');
    findAccountMutation.mutate({ phone_number: fullPhoneNumber });
  };

  const handlePhoneChange = (cleanValue: string, fullNumber: string) => {
    setPhoneNumber(cleanValue);
    setFullPhoneNumber(fullNumber);
    setError('');
  };

  const handleReset = () => {
    setPhoneNumber('');
    setFullPhoneNumber('');
    setError('');
  };

  return {
    formState: { phoneNumber, error, foundAccounts },
    handlers: { handleSubmit, handlePhoneChange, handleReset },
    isLoading: findAccountMutation.isPending,
  };
};
