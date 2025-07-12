import Container from '@/components/common/Container';
import bg from '@assets/lagnage_bg.png';
import { useState } from 'react';

const LanguagePage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('한국어');
  const languages = ['한국어', 'English', '日本語', '中文'];

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
          Korip에 오신 것을 환영합니다
        </p>
      </div>
      <Container>
        <div className='m-auto mt-[56px] flex max-w-[550px] flex-col gap-6'>
          <p className='text-center text-[32px] font-semibold'>
            시작 언어를 선택하세요
          </p>
          <div className='my-5 flex justify-between gap-3'>
            {languages.map((language) => (
              <button
                key={language}
                onClick={() => setSelectedLanguage(language)}
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
            언제든지 프로필 기본설정에서 언어를 변경할 수 있습니다.{' '}
          </p>
          <button className='bg-sub-green hover:text-sub-green hover:border-sub-green m-auto mt-8 w-fit cursor-pointer rounded-full border-2 border-white px-7 py-3 text-white transition-all duration-100 hover:border-2 hover:bg-white'>
            선택확인
          </button>
        </div>
      </Container>
    </div>
  );
};

export default LanguagePage;
