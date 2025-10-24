import Container from '@/components/common/Container';
import SearchBar from '@/components/domain/searchBar/SearchBar';
import CarouselForCard from '@/components/domain/regions/CarouselForCard';
import FirstInfoCard from '@/components/domain/regions/FirstInfoCard';
import { useRegionMajorQuery } from '@/api/regions/regionsHooks';
import { useAllCategoriesQuery } from '@/api/category/categoryHooks';
import { useTranslation } from 'react-i18next';
import { CATEGORY_IMAGES } from '@/constants/categoryImages';
const FirstSearchingPage = () => {
  const { t, i18n } = useTranslation();
  const { data: major } = useRegionMajorQuery(i18n.language);
  const { data: theme } = useAllCategoriesQuery(i18n.language);

  // 데이터가 로딩 중일 경우 로딩 메시지를 표시
  // if (isLoading) {
  //   return <div>지역 목록을 불러오는 중...</div>;
  // }

  // if (error) {
  //   return <div>오류가 발생했습니다: {error.message}</div>;
  // }

  return (
    <Container>
      <div className='m-auto flex flex-col items-center justify-center gap-5 p-10'>
        <h1 className='mt-16 text-4xl font-semibold'>
          {t('places.which_region_travel')}
        </h1>
        <p className='-mt-2'>{t('places.select_beautiful_regions')}</p>
        <SearchBar
          className='mt-8'
          placeholder={t('places.search_region_placeholder')}
        />
      </div>

      <div className='my-16 px-4'>
        <h2 className='mb-5 text-[32px] font-semibold'>
          {t('places.explore_regions')}
        </h2>
        <div className='grid w-full grid-cols-2 gap-5 lg:grid-cols-4'>
          {major?.regions?.map((place) => (
            <FirstInfoCard
              key={place.id}
              title={place.name}
              imageUrl={place.image || ''}
              isSelected={false}
              id={place.id}
              isRegion={true}
            />
          ))}
        </div>
      </div>

      <div className='my-16 px-4'>
        <h2 className='mb-5 text-[32px] font-semibold'>
          {t('themes.theme_travel')}
        </h2>

        <CarouselForCard length={theme?.categories?.length || 0}>
          {theme?.categories?.map((place) => (
            <FirstInfoCard
              key={place.id}
              id={place.id}
              title={place.name}
              imageUrl={CATEGORY_IMAGES[place.id] || '/placeholder.jpg'}
              isSelected={false}
              isRegion={false}
            />
          ))}
        </CarouselForCard>
      </div>
    </Container>
  );
};

export default FirstSearchingPage;
