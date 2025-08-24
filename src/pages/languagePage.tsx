import Container from '@/components/common/Container';
import bg from '@assets/lagnage_bg.png';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const LanguagePage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const langCodeMap: { [key: string]: string } = {
    한국어: 'ko',
    English: 'en',
    日本語: 'jp',
    中文: 'cn',
  };

  const codeLangMap: { [key: string]: string } = {
    ko: '한국어',
    en: 'English',
    ja: '日本語',
    zh: '中文',
  };

  const [selectedLanguage, setSelectedLanguage] = useState(
    codeLangMap[i18n.language] || '한국어'
  );
  const languages = ['한국어', 'English', '日本語', '中文'];

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    const codeToSet = langCodeMap[language] || 'ko';

    if (i18n.language !== codeToSet) {
      i18n.changeLanguage(codeToSet);

      const currentParams = new URLSearchParams(window.location.search);
      currentParams.set('lang', codeToSet);
      navigate(`${window.location.pathname}?${currentParams.toString()}`, {
        replace: true,
      });
    }
  };

  const handleConfirm = () => {
    navigate('/');
  };

  return (
    <div>
      <div
        className='relative flex h-[360px] w-full items-center justify-center'
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className='absolute top-0 left-0 h-full w-full bg-black opacity-30'></div>
        <p className='text-bg-white relative z-10 text-5xl'>
          {t('auth.welcome_message_title')}
        </p>
      </div>
      <Container>
        <div className='m-auto mt-[56px] flex max-w-[550px] flex-col gap-6'>
          <p className='text-center text-[32px] font-semibold'>
            {t('languages.choose_starting_language')}
          </p>
          <div className='my-5 flex justify-between gap-3'>
            {languages.map((language) => (
              <button
                key={language}
                onClick={() => handleLanguageSelect(language)}
                className={`hover:text-sub-green flex aspect-square w-full cursor-pointer items-center justify-center rounded-2xl border-2 text-xl font-bold shadow-md transition-all duration-300 ${
                  selectedLanguage === language
                    ? 'border-sub-green bg-sub-green text-white hover:text-white'
                    : 'border-sub-green'
                }`}
              >
                {language}
              </button>
            ))}
          </div>
          <p className='font-sm text-ph-gray text-center'>
            {t('languages.language_can_be_changed_anytime')}
          </p>
          <button
            className='bg-sub-green hover:text-sub-green hover:border-sub-green m-auto mt-8 w-fit cursor-pointer rounded-full border-2 border-white px-7 py-3 text-white transition-all duration-100 hover:border-2 hover:bg-white'
            onClick={handleConfirm}
          >
            {t('common.confirm_selection')}
          </button>
        </div>
      </Container>
    </div>
  );
};

export default LanguagePage;
