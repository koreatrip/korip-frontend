import Container from '@/components/common/Container';
import bg from '@assets/lagnage_bg.png';
import Button from '@/components/common/Button';
const LanguagePage = () => {
  return (
    <div>
      <div
        className='relative flex h-[360px] w-full items-center justify-center'
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className='absolute top-0 left-0 h-full w-full bg-black opacity-30'></div>
        <p className='text-bg-white relative z-10 text-5xl'>
          Korip에 오신 것을 환영합니다
        </p>
      </div>
      <Container>
        <div className='m-auto mt-[56px] flex max-w-[550px] flex-col gap-6'>
          <p className='text-center text-[32px]'>시작 언어를 선택하세요</p>
          <div className='flex gap-3'>
            <Button>한국어</Button>
            <Button>한국어</Button>
            <Button>한국어</Button>
            <Button>한국어</Button>
          </div>
          <p>언제든지 프로필 기본설정에서 언어를 변경할 수 있습니다. </p>
          <Button>ds</Button>
        </div>
      </Container>
    </div>
  );
};

export default LanguagePage;
