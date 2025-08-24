import {
  useRegionDetailQuery,
  useRegionsQuery,
} from '@/api/regions/regionsHooks';
import DistrictCard from '@/components/domain/regions/DistrictCard';
import { useNumericSearchParam } from '@/hooks/useNumericSearchParam';
import { useTranslation } from 'react-i18next';
import LoadingPage from './statusPage/loadingPage';
import i18n from '@/i18n/i18n';
import ListPageLayout from '@/layouts/listPageLayout';
import { useNavigate } from 'react-router';

const DistrictListPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const regionId = useNumericSearchParam('region_id');
  const currentLanguage = i18n.language || 'ko';
  // 시/도 목록 조회
  const {
    data: regionsResponse,
    isLoading: isRegionsLoading,
    error: isRegionsError,
  } = useRegionsQuery(currentLanguage);

  // 선택된 시/도의 구/군 목록 조회
  const {
    data: regionDetail,
    isLoading: isRegionDetailLoading,
    error: isRegionDetailError,
  } = useRegionDetailQuery(regionId, currentLanguage, {
    enabled: !!regionId,
  });
  console.log('dddd', regionDetail);
  const regions = regionsResponse?.regions || [];
  const subregions = regionDetail?.regions?.subregions?.results || [];

  // 현재 선택된 지역 이름 찾기
  const getCurrentRegionName = () => {
    if (!regionId) return '전체';

    // API 데이터에서 지역 이름 찾기
    if (regionDetail?.regions?.name) {
      return regionDetail.regions.name;
    }

    // fallback으로 regions 목록에서 찾기
    const currentRegion = regions.find((region) => region.id === regionId);
    return currentRegion?.name || '선택된 지역';
  };

  if (isRegionsLoading) return <LoadingPage />;
  if (regionId && isRegionDetailLoading) return <LoadingPage />; // 스켈레톤으로 바꿔야함
  if (isRegionsError) return <div>error: {isRegionsError.message}</div>;
  if (isRegionDetailError)
    return <div>error: {isRegionDetailError.message}</div>;

  return (
    <ListPageLayout
      title={t('places.explore_all_areas', { regions: getCurrentRegionName() })}
      subtitle={t('places.total_districts', {
        count: regionId ? subregions.length : regions.length,
      })}
    >
      {/* 카드들만 렌더링 */}
      {regionId ? (
        // 특정 지역의 구/군 목록 표시
        subregions.length > 0 ? (
          subregions.map((subregion) => (
            <DistrictCard
              key={subregion.id}
              data={subregion}
              type='subregion'
              onClick={() =>
                navigate(
                  `/explore/attractions?subregion_id=${subregion.id}&lang=${currentLanguage}`
                )
              }
            />
          ))
        ) : (
          <div className='col-span-full text-center text-gray-500'>
            해당 지역의 구역 정보가 없습니다.
          </div>
        )
      ) : (
        // 전체 지역 목록 표시
        regions.map((region) => (
          <DistrictCard key={region.id} data={region} type='region' />
        ))
      )}
    </ListPageLayout>
  );
};

export default DistrictListPage;
