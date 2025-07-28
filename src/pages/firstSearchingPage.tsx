import Container from '@/components/common/Container';
import SearchBar from '@/components/common/searchBar/SearchBar';
import CarouselForCard from '@/components/domain/regions/CarouselForCard';
import FirstInfoCard from '@/components/domain/regions/FirstInfoCard';

const FirstSearchingPage = () => {
  const places = [
    { title: '서울', imageUrl: 'https://via.placeholder.com/300x200' },
    { title: '서울', imageUrl: 'https://via.placeholder.com/300x200' },
    { title: '서울', imageUrl: 'https://via.placeholder.com/300x200' },
    { title: '서울', imageUrl: 'https://via.placeholder.com/300x200' },
    { title: '서울', imageUrl: 'https://via.placeholder.com/300x200' },
    { title: '서울', imageUrl: 'https://via.placeholder.com/300x200' },

  ];

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
          <CarouselForCard>
            {places.map((place) => (
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
            ))}
          </CarouselForCard>
        </div>
      </div>

      <div className='my-16'>
        <h2 className='text-[32px] font-semibold'>테마별 여행</h2>
        <div className='relative'>
          <CarouselForCard>
            {places.map((place) => (
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
            ))}
          </CarouselForCard>
        </div>
      </div>
    </Container>
  );
};

export default FirstSearchingPage;
