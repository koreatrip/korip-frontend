import Container from '@/components/common/Container';
import SearchBar from '@/components/domain/searchBar/SearchBar';
import CarouselForCard from '@/components/domain/regions/CarouselForCard';
import FirstInfoCard from '@/components/domain/regions/FirstInfoCard';
import { useRegionMajorQuery } from '@/api/regions/regionsHooks';

const FirstSearchingPage = () => {
  const { data: places } = useRegionMajorQuery('ko');

  // if (isLoading) {
  //   return <div>지역 목록을 불러오는 중...</div>;
  // }

  // if (error) {
  //   return <div>오류가 발생했습니다: {error.message}</div>;
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

      <div className='my-16'>
        <h2 className='text-[32px] font-semibold'>지역 둘러보기</h2>
        <div className='relative'>
          <CarouselForCard lenght={places?.regions?.length ?? 0}>
            {places?.regions?.map((place) => (
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
      </div>

      <div className='my-16'>
        <h2 className='text-[32px] font-semibold'>테마별 여행</h2>
        <div className='relative'>
          {/* <CarouselForCard>
           {Array.isArray(places) ? (
              places?.map((place) => (
                <FirstInfoCard
                  key={place.title}
                  variant='selectable'
                  title={place.title}
                  imageUrl={place.imageUrl}
                  isSelected={false}
                  onClick={() => {}}
                  onViewDetails={() => {}}
                  onFavorite={() => {}}
                />
              ))
            ) : (
              <div>No places available.</div>
            )}
          </CarouselForCard> */}
        </div>
      </div>
    </Container>
  );
};

export default FirstSearchingPage;
