import { useTranslation } from 'react-i18next';

type AccountStatsSectionProps = {
  joinDate: string;
  stats: {
    travelPlans: number;
    favorites: number;
    visitedPlaces: number;
  };
};

const AccountStatsSection: React.FC<AccountStatsSectionProps> = ({
  joinDate,
  stats,
}) => {
  const { t } = useTranslation();

  const statItems = [
    { label: 'travel.my_travel_plans', count: stats.travelPlans },
    { label: 'places.favorites', count: stats.favorites },
    { label: 'places.visited_places', count: stats.visitedPlaces },
  ];

  return (
    <section className='mb-6 rounded-md bg-gray-50 p-6 shadow-md'>
      <h3 className='text-main-text-navy mb-4 text-lg font-bold'>
        {t('user.account_status')}
      </h3>

      <div className='mb-4 flex items-center justify-between text-sm'>
        <span className='text-main-text-navy font-medium'>
          {t('auth.signup_date')}
        </span>
        <span className='text-gray-400'>{joinDate}</span>
      </div>

      <hr className='border-outline-gray -mt-2 mb-4 border-t' />

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
        {statItems.map(({ label, count }) => (
          <div
            key={label}
            className='border-outline-gray bg-bg-white flex flex-col items-center justify-center rounded-md border p-4 text-center shadow-sm'
          >
            <p className='text-main-pink text-lg font-bold'>{count}</p>
            <p className='text-main-text-gray text-xs'>{t(label)}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AccountStatsSection;
