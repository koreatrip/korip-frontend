import Container from '@/components/common/Container';
import SearchBar from '@/components/domain/searchBar/SearchBar';
import CarouselForCard from '@/components/domain/regions/CarouselForCard';
import FirstInfoCard from '@/components/domain/regions/FirstInfoCard';
import { useRegionMajorQuery } from '@/api/regions/regionsHooks';
import { useAllCategoriesQuery } from '@/api/category/categoryHooks';

const FirstSearchingPage = () => {
  const { data: major } = useRegionMajorQuery('ko');
  const { data: theme } = useAllCategoriesQuery('ko');

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
          어느 지역을 여행하나요?
        </h1>
        <p className='-mt-2'>한국의 아름다운 지역을 선택해보세요.</p>
        <SearchBar className='mt-8' />
      </div>

      <div className='my-16 px-4'>
        <h2 className='mb-5 text-[32px] font-semibold'>지역 둘러보기</h2>
        <div className='grid w-full grid-cols-2 gap-4 lg:grid-cols-4'>
          {major?.regions?.map((place) => (
            <FirstInfoCard
              key={place.id}
              variant='selectable'
              title={place.name}
              imageUrl={''}
              isSelected={false}
              onClick={() => {}}
              onViewDetails={() => {}}
              onFavorite={() => {}}
            />
          ))}
        </div>
      </div>

      <div className='my-16 px-4'>
        <h2 className='mb-5 text-[32px] font-semibold'>테마별 여행</h2>

        <CarouselForCard length={theme?.categories?.length || 0}>
          {theme?.categories?.map((place) => (
            <FirstInfoCard
              key={place.id}
              variant='selectable'
              title={place.name}
              imageUrl={''}
              isSelected={false}
              onClick={() => {}}
              onViewDetails={() => {}}
              onFavorite={() => {}}
            />
          ))}
        </CarouselForCard>
      </div>
    </Container>
  );
};

export default FirstSearchingPage;
