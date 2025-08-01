import Accordion from '@/components/common/Accordion';
import Container from '@/components/common/Container';
import { useList } from '@/hooks/useList';
import { parseHtml } from '@/utils/parseHtml';
import { useTranslation } from 'react-i18next';

const TravelTipsPage = () => {
  const { t } = useTranslation();
  const getList = useList();

  const paymentList = getList('payment.list');
  const emergencyList = getList('emergency.police.list');
  const fireList = getList('emergency.fire.list');
  const rechargeableCardList = getList('transportCard.rechargeableCardList');
  const ezlList = getList('transportCard.ezl.list');
  const tmoneyList = getList('transportCard.tmoney.list');
  const singleUseTicketList = getList('transportCard.singleUseTicketList');
  const pharmacyList = getList('hospital.pharmacyList');
  const foreignerFriendlyList = getList('hospital.foreignerFriendlyList');
  const mainHospitalsList = getList('hospital.mainHospitalsList');
  console.log(ezlList);
  return (
    <Container className='mt-8'>
      <div className='mb-20 flex flex-col items-center justify-center'>
        <h1 className='mb-4 text-4xl font-semibold'>{t('tips.title')}</h1>
        <div className='text-main-text-navy mt-4'>{t('tips.subtitle')}</div>
      </div>
      <div className='w-full space-y-4'>
        {/* 첫 번째 아코디언: 결제 안내 */}
        <Accordion title={t('tips.payment.title')}>
          <ul className='list-disc space-y-2 pl-5 text-sm'>
            {paymentList.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </Accordion>

        {/* 두 번째 아코디언: 112/119 긴급전화 */}
        <Accordion title={t('tips.emergency.title')}>
          <div className='flex flex-col gap-y-6'>
            {/* 상단 2단 박스 */}
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div className='border-sub-green rounded-lg border p-4'>
                <h4 className='text-xl font-bold'>
                  {t('tips.emergency.police.title')}
                </h4>
                <p className='text-main-text-navy/80 text-sm'>
                  {t('tips.emergency.police.description')}
                </p>
                <ul className='mt-3 list-disc space-y-1 pl-5 text-sm'>
                  {emergencyList.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className='border-sub-green rounded-lg border p-4'>
                <h4 className='text-xl font-bold'>
                  {t('tips.emergency.fire.title')}
                </h4>
                <p className='text-main-text-navy/80 text-sm'>
                  {t('tips.emergency.fire.description')}
                </p>
                <ul className='mt-3 list-disc space-y-1 pl-5 text-sm'>
                  {fireList.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            {/* 하단 추가 팁 */}
            <div>
              <h4 className='text-sub-green font-semibold'>
                {' '}
                {t('tips.emergency.additionalTipTitle')}
              </h4>
              <p className='text-main-text-navy/80 mt-1 text-sm'>
                {t('tips.emergency.additionalTipContent')}
              </p>
            </div>
          </div>
        </Accordion>
        <Accordion title={t('tips.transportCard.title')}>
          <div className='flex flex-col gap-y-6'>
            {/* 상단 2단 박스 */}
            <p>{t('tips.transportCard.rechargeableCardTitle')}</p>
            <ul className='list-disc space-y-2 pl-5 text-sm'>
              {rechargeableCardList.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <div>
              <h4 className='text-sub-green font-semibold'>
                {t('tips.transportCard.recommendationTitle')}
              </h4>
              <p className='text-main-text-navy/80 mt-1 text-sm'>
                {t('tips.transportCard.rechargeableCardRecommendation')}
              </p>
            </div>
            <div className='grid grid-cols-2 gap-4 sm:grid-cols-2'>
              <div>
                <div className='border-sub-green flex items-center justify-center rounded-lg border p-4'>
                  <h4 className='text-xl font-bold'>
                    {t('tips.transportCard.ezl.title')}
                  </h4>
                </div>
                <ul className='mt-3 list-disc space-y-1 pl-5 text-sm'>
                  {ezlList.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className='border-sub-green flex items-center justify-center rounded-lg border p-4'>
                  <h4 className='text-xl font-bold'>
                    {t('tips.transportCard.tmoney.title')}
                  </h4>
                </div>
                <ul className='mt-3 list-disc space-y-1 pl-5 text-sm'>
                  {tmoneyList.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            {/* 하단 추가 팁 */}
            <p>{t('tips.transportCard.singleUseTicketTitle')}</p>
            <ul className='list-disc space-y-2 pl-5 text-sm'>
              {singleUseTicketList.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <div>
              <h4 className='text-sub-green font-semibold'>
                {t('tips.transportCard.recommendationTitle')}
              </h4>
              <p className='text-main-text-navy/80 mt-1 text-sm'>
                {t('tips.transportCard.singleUseTicketRecommendation')}
              </p>
            </div>
          </div>
        </Accordion>
        <Accordion title={t('tips.embassy.title')}>
          <div className='flex flex-col gap-y-6'>
            <p>{t('tips.embassy.description')}</p>
            {/* 상단 2단 박스 */}
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
              <div className='border-sub-green rounded-lg border p-4'>
                <h4 className='text-xl font-bold'>
                  {t('tips.embassy.us.name')}
                </h4>
                <p className='text-main-text-navy/80 text-sm'>
                  {parseHtml(t('tips.embassy.us.info'))}
                </p>
              </div>
              <div className='border-sub-green rounded-lg border p-4'>
                <h4 className='text-xl font-bold'>
                  {t('tips.embassy.japan.name')}
                </h4>
                <p className='text-main-text-navy/80 text-sm'>
                  {parseHtml(t('tips.embassy.japan.info'))}
                </p>
              </div>
              <div className='border-sub-green rounded-lg border p-4'>
                <h4 className='text-xl font-bold'>
                  {t('tips.embassy.china.name')}
                </h4>
                <p className='text-main-text-navy/80 text-sm'>
                  {parseHtml(t('tips.embassy.china.info'))}
                </p>
              </div>
            </div>
            {/* 하단 추가 팁 */}
            <div>
              <h4 className='text-sub-green font-semibold'>
                {t('tips.embassy.noteTitle')}
              </h4>
              <p className='text-main-text-navy/80 mt-1 text-sm'>
                {t('tips.embassy.noteContent')}
              </p>
            </div>
          </div>
        </Accordion>
        <Accordion title={t('tips.hospital.title')}>
          <div className='flex flex-col gap-y-6'>
            <div>
              <p className='mb-4'>{t('tips.hospital.pharmacyTitle')}</p>
              <ul className='list-disc space-y-2 pl-5 text-sm'>
                {pharmacyList.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className='mb-4'>
                {t('tips.hospital.foreignerFriendlyTitle')}
              </p>
              <ul className='list-disc space-y-2 pl-5 text-sm'>
                {foreignerFriendlyList.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className='mb-4'>{t('tips.hospital.mainHospitalsTitle')}</p>
              <ul className='list-disc space-y-2 pl-5 text-sm'>
                {mainHospitalsList.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </Accordion>
      </div>
    </Container>
  );
};

export default TravelTipsPage;
