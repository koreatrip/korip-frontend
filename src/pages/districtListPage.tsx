import Container from '@/components/common/Container';
import DistrictCard from '@/components/domain/regions/DistrictCard';
import Tag from '@/components/domain/regions/Tag';

const DistrictListPage = () => {
  return (
    <div className='flex flex-grow flex-col'>
      {/* 상단 흰색 섹션 */}
      <section>
        <Container className='py-8'>
          <h1 className='mb-4 text-4xl font-semibold'>
            서울 모든 구역 둘러보기
          </h1>
          <Tag />
          <div className='text-main-text-navy mt-4'>총 25개 구역</div>
        </Container>
      </section>
      <section className='bg-bg-section w-full flex-grow pt-8 pb-16'>
        <Container>
          {/* 반응형 그리드로 수정 */}
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            <DistrictCard />
            <DistrictCard />
            <DistrictCard />
            <DistrictCard />
            <DistrictCard />
            <DistrictCard />
            <DistrictCard />
            <DistrictCard />
          </div>
        </Container>
      </section>
    </div>
  );
};

export default DistrictListPage;
