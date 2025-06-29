import Accordion from '@/components/common/Accordion';
import Container from '@/components/common/Container';

const TravelTipsPage = () => {
  return (
    <Container className='mt-8'>
      <div className='mb-20 flex flex-col items-center justify-center'>
        <h1 className='mb-4 text-4xl font-semibold'>한국 여행 팁</h1>
        <div className='text-main-text-navy mt-4'>무엇이 궁금하신가요?</div>
      </div>
      <div className='w-full space-y-4'>
        {/* 첫 번째 아코디언: 결제 안내 */}
        <Accordion title='결제 안내'>
          <ul className='list-disc space-y-2 pl-5 text-sm'>
            <li>
              대부분의 가게, 식당, 편의점에서는 해외카드(VISA, Mastercard, JCB,
              UnionPay 등) 사용이 가능해요.
            </li>
            <li>
              시장이나 작은 식당, 시골 지역은 카드가 안 되는 곳도 있으니 현금도
              조금 준비하는 걸 추천해요.
            </li>
          </ul>
        </Accordion>

        {/* 두 번째 아코디언: 112/119 긴급전화 */}
        <Accordion title='112/119 응급전화 사용법'>
          <div className='flex flex-col gap-y-6'>
            {/* 상단 2단 박스 */}
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div className='border-sub-green rounded-lg border p-4'>
                <h4 className='text-xl font-bold'>112</h4>
                <p className='text-main-text-navy/80 text-sm'>
                  경찰(24시간 통역서비스)
                </p>
                <ul className='mt-3 list-disc space-y-1 pl-5 text-sm'>
                  <li>범죄 신고, 교통사고, 분실물 신고</li>
                  <li>긴급 상황 시 24시간 언제든 연락 가능</li>
                </ul>
              </div>
              <div className='border-sub-green rounded-lg border p-4'>
                <h4 className='text-xl font-bold'>119</h4>
                <p className='text-main-text-navy/80 text-sm'>
                  소방·응급의료 (17개 외국어 지원)
                </p>
                <ul className='mt-3 list-disc space-y-1 pl-5 text-sm'>
                  <li>화재, 응급의료, 구조 요청 시 사용</li>
                  <li>긴급 상황 시 24시간 언제든 연락 가능</li>
                  <li>전화를 걸면 자동으로 위치 추적</li>
                </ul>
              </div>
            </div>
            {/* 하단 추가 팁 */}
            <div>
              <h4 className='text-sub-green font-semibold'>추가 팁</h4>
              <p className='text-main-text-navy/80 mt-1 text-sm'>
                1330은 한국관광공사에서 운영하는 24시간 다국어 관광안내 및 통역
                서비스로, 긴급 상황 시 112나 119와의 3자 통화를 통해 통역을
                지원해줘요.
              </p>
            </div>
          </div>
        </Accordion>
        <Accordion title='교통카드 사용방법 (eZL, T-money 등)'>
          <div className='flex flex-col gap-y-6'>
            {/* 상단 2단 박스 */}
            <p>충전식 교통카드(eZL/T-money)</p>
            <ul className='list-disc space-y-2 pl-5 text-sm'>
              <li>
                한국에서 가장 널리 쓰이는 교통카드예요. 한 번 구입해서 여러 번
                충전하며 쓸 수 있어요.
              </li>
              <li>구매장소: 편의점(GS25, CU, 세븐일레븐, 이마트24 등)</li>
              <li>지하철, 버스, 공항철도, 일부 택시까지 사용 가능</li>
              <li>서울, 부산, 제주 등 대부분 지역에서 호환됨</li>
              <li>카드 가격에 보증금 없음</li>
              <li>현금으로만 충전 가능</li>
              <li>남은 잔액은 일부 편의점에서 수수료 제외 후 환불 가능</li>
              <li>충전된 금액은 일부 편의점에서 사용 가능</li>
              <li>버스와 지하철 환승할인 가능</li>
            </ul>
            <div>
              <h4 className='text-sub-green font-semibold'>추천</h4>
              <p className='text-main-text-navy/80 mt-1 text-sm'>
                여러 번 대중교통을 이용할 계획이라면 이 카드가 가장 편리해요
              </p>
            </div>
            <div className='grid grid-cols-2 gap-4 sm:grid-cols-2'>
              <div>
                <div className='border-sub-green flex items-center justify-center rounded-lg border p-4'>
                  <h4 className='text-xl font-bold'>eZL</h4>
                </div>
                <ul className='mt-3 list-disc space-y-1 pl-5 text-sm'>
                  <li>IC형: 결제칩이 있어 생활결제 가능</li>
                  <li>
                    RF형: 결제칩이 없어 대중교통 전용일부 편의점 결제 가능
                  </li>
                  <li>
                    eZL 사이트에 등록해두면 카드 분실신고 시 잔액을 환급받을 수
                    있음
                  </li>
                </ul>
              </div>
              <div>
                <div className='border-sub-green flex items-center justify-center rounded-lg border p-4'>
                  <h4 className='text-xl font-bold'>T-money</h4>
                </div>
                <ul className='mt-3 list-disc space-y-1 pl-5 text-sm'>
                  <li>
                    RF형: 결제칩이 없어 대중교통 전용일부 편의점 결제 가능
                  </li>
                  <li>
                    티머니 사이트에 등록해두면 카드 분실신고 시 잔액을 환급받을
                    수 있음
                  </li>
                </ul>
              </div>
            </div>
            {/* 하단 추가 팁 */}
            <p>1회용 교통카드(Single-Use SubWay Ticket)</p>
            <ul className='list-disc space-y-2 pl-5 text-sm'>
              <li>서울 지하철에서만 사용하는 일회용 카드예요.</li>
              <li>지하철역 내 자동발매기에서 구매 가능</li>
              <li>
                보증금 500원이 포함되어 있어요
                <br />
                (예: 지하철 요금 1,250원 + 보증금 500원 = 1,750원 지불)
              </li>
              <li>
                도착역에서 보증금 환급기 사용하면 500원 돌려받을 수 있어요
              </li>
              <li>충전 불가능, 재사용 불가능</li>
            </ul>
            <div>
              <h4 className='text-sub-green font-semibold'>추천</h4>
              <p className='text-main-text-navy/80 mt-1 text-sm'>
                지하철을 딱 1~2번 정도 이용할 경우 유용해요!
              </p>
            </div>
          </div>
        </Accordion>
        <Accordion title='대사관 연락처 (국가별)'>
          <div className='flex flex-col gap-y-6'>
            <p>
              한국에 있는 주요 국가의 대사관 연락처와 주소 목록입니다. 분실,
              사고, 긴급상황 시 도움을 요청할 수 있어요.
            </p>
            {/* 상단 2단 박스 */}
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
              <div className='border-sub-green rounded-lg border p-4'>
                <h4 className='text-xl font-bold'>미국 대사관</h4>
                <p className='text-main-text-navy/80 text-sm'>
                  서울 종로구 세종로 <br /> 02-397-4114
                </p>
              </div>
              <div className='border-sub-green rounded-lg border p-4'>
                <h4 className='text-xl font-bold'>일본 대사관</h4>
                <p className='text-main-text-navy/80 text-sm'>
                  서울 종로구 수송동
                  <br />
                  02-2170-5200
                </p>
              </div>
              <div className='border-sub-green rounded-lg border p-4'>
                <h4 className='text-xl font-bold'>중국 대사관</h4>
                <p className='text-main-text-navy/80 text-sm'>
                  서울 서대문구 연희동
                  <br />
                  02-738-1038
                </p>
              </div>
            </div>
            {/* 하단 추가 팁 */}
            <div>
              <h4 className='text-sub-green font-semibold'>참고</h4>
              <p className='text-main-text-navy/80 mt-1 text-sm'>
                각 대사관은 평일 근무시간에만 운영하며, 비상 시엔 긴급 번호로
                연결 가능합니다.
              </p>
            </div>
          </div>
        </Accordion>
        <Accordion title='병원/ 약국 찾는 방법 + 위치 정보 제공'>
          <div className='flex flex-col gap-y-6'>
            <div>
              <p className='mb-4'>약국 이용 안내</p>
              <ul className='list-disc space-y-2 pl-5 text-sm'>
                <li>
                  약국은 일반 의약품(감기약 등) 구매 가능하지만, 항생제는 병원
                  처방이 필요해요.
                </li>
                <li>대부분의 약국에서 기본적인 영어 소통이 가능해요.</li>
                <li>편의점에서 일부 의약품을 판매하고있어요.</li>
              </ul>
            </div>
            <div>
              <p className='mb-4'>외국인 친화 의료기관</p>
              <ul className='list-disc space-y-2 pl-5 text-sm'>
                <li>서울대학교병원: 영어, 중국어, 일본어 지원</li>
                <li>연세의료원: 국제진료센터 운영</li>
                <li>삼성서울병원: 외국인 전용 데스크</li>
                <li>아산병원: 통역 서비스 제공</li>
              </ul>
            </div>
            <div>
              <p className='mb-4'>주요 병원 정보</p>
              <ul className='list-disc space-y-2 pl-5 text-sm'>
                <li>
                  외국인 진료가 가능한 병원 정보는 현재 업데이트 중입니다.
                  응급상황 시에는 119에 전화하여 가장 가까운 응급실로
                  이송받으시기 바랍니다.
                </li>
              </ul>
            </div>
          </div>
        </Accordion>
      </div>
    </Container>
  );
};

export default TravelTipsPage;
