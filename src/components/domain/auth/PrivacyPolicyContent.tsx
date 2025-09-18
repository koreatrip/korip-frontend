import { useTranslation } from 'react-i18next';

type TranslationArray = string[];

const PrivacyPolicyContent = () => {
  const { t } = useTranslation();

  return (
    <div className='text-main-text-navy h-96 space-y-4 overflow-y-scroll text-sm'>
      <p>{t('privacy_content.intro')}</p>

      <div>
        <h4 className='text-main-text-navy mt-4 font-medium'>
          {t('privacy_content.article1.title')}
        </h4>
        <p>{t('privacy_content.article1.content')}</p>
        <ul className='mt-2 ml-4 list-inside list-disc space-y-1'>
          {(
            t('privacy_content.article1.purposes', {
              returnObjects: true,
            }) as TranslationArray
          ).map((purpose: string, index: number) => (
            <li key={index}>{purpose}</li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className='text-main-text-navy mt-4 font-medium'>
          {t('privacy_content.article2.title')}
        </h4>
        <p>{t('privacy_content.article2.required')}</p>
        <p>{t('privacy_content.article2.optional')}</p>
        <p>{t('privacy_content.article2.auto')}</p>
      </div>

      <div>
        <h4 className='text-main-text-navy mt-4 font-medium'>
          {t('privacy_content.article3.title')}
        </h4>
        <p>{t('privacy_content.article3.member')}</p>
        <p>{t('privacy_content.article3.nonmember')}</p>
        <p>{t('privacy_content.article3.legal')}</p>
      </div>

      <div>
        <h4 className='text-main-text-navy mt-4 font-medium'>
          {t('privacy_content.article4.title')}
        </h4>
        <p>{t('privacy_content.article4.content')}</p>
        <ul className='mt-2 ml-4 list-inside list-disc space-y-1'>
          {(
            t('privacy_content.article4.exceptions', {
              returnObjects: true,
            }) as TranslationArray
          ).map((exception: string, index: number) => (
            <li key={index}>{exception}</li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className='text-main-text-navy mt-4 font-medium'>
          {t('privacy_content.article5.title')}
        </h4>
        <p>{t('privacy_content.article5.content')}</p>
        <ul className='mt-2 ml-4 list-inside list-disc space-y-1'>
          {(
            t('privacy_content.article5.partners', {
              returnObjects: true,
            }) as TranslationArray
          ).map((partner: string, index: number) => (
            <li key={index}>{partner}</li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className='text-main-text-navy mt-4 font-medium'>
          {t('privacy_content.article6.title')}
        </h4>
        <p>{t('privacy_content.article6.content')}</p>
      </div>
    </div>
  );
};

export default PrivacyPolicyContent;
