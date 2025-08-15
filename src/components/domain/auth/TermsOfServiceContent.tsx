import { useTranslation } from 'react-i18next';

const TermsOfServiceContent = () => {
  const { t } = useTranslation();

  return (
    <div className='text-main-text-navy h-96 space-y-4 overflow-y-scroll text-sm'>
      <p>{t('terms_content.intro')}</p>

      <div>
        <h4 className='text-main-text-navy mt-4 font-medium'>
          {t('terms_content.article1.title')}
        </h4>
        <p>{t('terms_content.article1.content')}</p>
      </div>

      <div>
        <h4 className='text-main-text-navy mt-4 font-medium'>
          {t('terms_content.article2.title')}
        </h4>
        <p>{t('terms_content.article2.service')}</p>
        <p>{t('terms_content.article2.user')}</p>
        <p>{t('terms_content.article2.content')}</p>
      </div>

      <div>
        <h4 className='text-main-text-navy mt-4 font-medium'>
          {t('terms_content.article3.title')}
        </h4>
        <p>{t('terms_content.article3.content')}</p>
      </div>

      <div>
        <h4 className='text-main-text-navy mt-4 font-medium'>
          {t('terms_content.article4.title')}
        </h4>
        <p>{t('terms_content.article4.content')}</p>
      </div>

      <div>
        <h4 className='text-main-text-navy mt-4 font-medium'>
          {t('terms_content.article5.title')}
        </h4>
        <p>{t('terms_content.article5.content')}</p>
      </div>

      <div>
        <h4 className='text-main-text-navy mt-4 font-medium'>
          {t('terms_content.article6.title')}
        </h4>
        <p>{t('terms_content.article6.content')}</p>
      </div>
    </div>
  );
};

export default TermsOfServiceContent;
