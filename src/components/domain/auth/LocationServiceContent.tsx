import { useTranslation } from 'react-i18next';

const LocationServiceContent = () => {
  const { t } = useTranslation();

  return (
    <div className='text-main-text-navy h-96 space-y-4 overflow-y-scroll text-sm'>
      <p>{t('location_content.intro')}</p>

      <div>
        <h4 className='text-main-text-navy mt-4 font-medium'>
          {t('location_content.article1.title')}
        </h4>
        <p>{t('location_content.article1.content')}</p>
        <ul className='mt-2 ml-4 list-inside list-disc space-y-1'>
          {t('location_content.article1.purposes', { returnObjects: true }).map(
            (purpose, index) => (
              <li key={index}>{purpose}</li>
            )
          )}
        </ul>
      </div>

      <div>
        <h4 className='text-main-text-navy mt-4 font-medium'>
          {t('location_content.article2.title')}
        </h4>
        <p>{t('location_content.article2.content')}</p>
        <ul className='mt-2 ml-4 list-inside list-disc space-y-1'>
          {t('location_content.article2.methods', { returnObjects: true }).map(
            (method, index) => (
              <li key={index}>{method}</li>
            )
          )}
        </ul>
      </div>

      <div>
        <h4 className='text-main-text-navy mt-4 font-medium'>
          {t('location_content.article3.title')}
        </h4>
        <p>{t('location_content.article3.realtime')}</p>
        <p>{t('location_content.article3.saved')}</p>
        <p>{t('location_content.article3.analytics')}</p>
      </div>

      <div>
        <h4 className='text-main-text-navy mt-4 font-medium'>
          {t('location_content.article4.title')}
        </h4>
        <p>{t('location_content.article4.content')}</p>
        <ul className='mt-2 ml-4 list-inside list-disc space-y-1'>
          {t('location_content.article4.exceptions', {
            returnObjects: true,
          }).map((exception, index) => (
            <li key={index}>{exception}</li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className='text-main-text-navy mt-4 font-medium'>
          {t('location_content.article5.title')}
        </h4>
        <p>{t('location_content.article5.content')}</p>
      </div>

      <div>
        <h4 className='mt-4 font-medium text-gray-800'>
          {t('location_content.article6.title')}
        </h4>
        <p>{t('location_content.article6.content')}</p>
        <p className='mt-2 font-medium text-gray-700'>
          {t('location_content.article6.contact')}
        </p>
      </div>
    </div>
  );
};

export default LocationServiceContent;
