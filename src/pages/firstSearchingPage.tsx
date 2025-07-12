import Container from '@/components/common/Container';
import SearchBar from '@/components/common/searchBar/SearchBar';
import DistrictCard from '@/components/domain/regions/DistrictCard';
import InfoCard from '@/components/domain/regions/InfoCard';

const FirstSearchingPage = () => {
  return (
    <Container>
      <div className='m-auto flex flex-col items-center justify-center gap-5 p-10'>
        <h1 className='mt-16 text-4xl font-semibold'>
          어느 지역을 여행하나요?
        </h1>
        <p className='-mt-2'>한국의 아름다운 지역을 선택해보세요.</p>
        <SearchBar className='my-8' />
      </div>

      <div className='my-16'>
        <h2 className='text-[32px] font-semibold'>지역 둘러보기</h2>
        <ul className='mt-7 grid grid-cols-4 gap-4'>
          <li>
            <InfoCard variant='selectable' />
          </li>

          <li>
            <InfoCard
              variant='selectable'
              title='경복궁'
              description='조선시대 왕궁 한복입고 방문시 어쩌고'
              details='오전9시 ~ 6시 3호선 경복궁 역 '
            />
          </li>
          <li>
            <InfoCard
              variant='selectable'
              title='경복궁'
              description='조선시대 왕궁 한복입고 방문시 어쩌고'
              details='오전9시 ~ 6시 3호선 경복궁 역 '
            />
          </li>
          <li>
            <InfoCard
              variant='selectable'
              title='경복궁'
              description='조선시대 왕궁 한복입고 방문시 어쩌고'
              details='오전9시 ~ 6시 3호선 경복궁 역 '
            />
          </li>
        </ul>
        <div className='mt-2 flex w-full justify-end'>
          <button className='cursor-pointer font-medium'>모두보기</button>
        </div>
      </div>

      <div className='my-16'>
        <h2 className='text-[32px] font-semibold'>테마별 여행</h2>
        <ul className='mt-7 grid grid-cols-4 gap-4'>
          <li>
            <InfoCard variant='selectable' />
          </li>
          <li>
            <InfoCard
              variant='selectable'
              title='경복궁'
              description='조선시대 왕궁 한복입고 방문시 어쩌고'
              details='오전9시 ~ 6시 3호선 경복궁 역 '
            />
          </li>
          <li>
            <InfoCard
              variant='selectable'
              title='경복궁'
              description='조선시대 왕궁 한복입고 방문시 어쩌고'
              details='오전9시 ~ 6시 3호선 경복궁 역 '
            />
          </li>
          <li>
            <InfoCard
              variant='selectable'
              title='경복궁'
              description='조선시대 왕궁 한복입고 방문시 어쩌고'
              details='오전9시 ~ 6시 3호선 경복궁 역 '
            />
          </li>
        </ul>
        <div className='mt-2 flex w-full justify-end'>
          <button className='cursor-pointer font-medium'>모두보기</button>
        </div>
      </div>
    </Container>
  );
};

export default FirstSearchingPage;
