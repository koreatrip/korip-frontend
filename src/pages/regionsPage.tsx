import InfoCard from '@/components/domain/regions/InfoCard';
import Carousel from '@/components/domain/regions/Carousel';
import Weather from '@/components/domain/weather/Weather';
import Container from '@/components/common/Container';
import { Trans, useTranslation } from 'react-i18next';
import { useModalStore } from '@/stores/useModalStore';
import LoginPromptModal from '@/components/domain/auth/LoginPromptModal';
import { useNavigate } from 'react-router';
import { usePlacesQuery } from '@/api/place/placeHooks';
import LoadingPage from './statusPage/loadingPage';
import { useEffect, useState } from 'react';
import { useNumericSearchParam } from '@/hooks/useNumericSearchParam';
import EmptyCard from '@/components/common/ui/EmptyCard';
import { useUserProfileQuery } from '@/api/user/userHooks';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import PlaceDetailModal from '@/components/domain/regions/PlaceDetailModal';
import { useScheduleDropdown } from '@/hooks/useScheduleDropdown';
import ErrorPage from './statusPage/errorPage';
import { ERROR_CODES } from '@/constants/errorCodes';
import type { AxiosError } from 'axios';
import { NetworkError } from '@/components/NetworkError';

const RegionsPage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const { stack, actions } = useModalStore();
  const { isLoggedIn } = useAuthCheck();

  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);

  const {
    openDropdownId,
    toggleDropdown,
    dropdownItems,
    isAddingToSchedule,
    dropdownButtonRef,
    dropdownContentRef,
  } = useScheduleDropdown();

  const regionId = useNumericSearchParam('region_id');
  const subregionId = useNumericSearchParam('subregion_id');
  const currentLanguage = i18n.language || 'ko';

  const {
    data: placesData,
    isLoading,
    error,
  } = usePlacesQuery(
    {
      region_id: regionId!,
      ...(subregionId && { subregion_id: subregionId }),
      lang: currentLanguage,
    },
    {
      enabled: !!regionId,
    }
  );

  const { data: userProfile } = useUserProfileQuery();

  const region = placesData?.region;
  const subregion = placesData?.subregion;
  const popularSubregions = placesData?.popular_subregions || [];
  const majorPlaces = placesData?.major_places || [];
  const userRecommendedPlaces = placesData?.user_recommended_places || [];
  const accommodations = placesData?.stay_places || [];

  const handlePlaceDetailOpen = (placeId: number) => {
    setSelectedPlaceId(placeId);
  };

  const handlePlaceDetailClose = () => {
    setSelectedPlaceId(null);
  };

  const getLocationDisplayName = () => {
    if (!region?.name) return '날씨 정보';
    if (subregionId && subregion?.name) {
      return `${region.name} ${subregion.name} 날씨`;
    }
    return `${region.name} 날씨`;
  };

  const getCurrentRegionName = () => {
    if (region?.name) {
      if (subregionId && subregion?.name) {
        return `${region.name} ${subregion.name}`;
      }
      return region.name;
    }
    return '지역을 선택해주세요';
  };

  const interestNames =
    userProfile?.preferences_display?.map((pref) => pref.name).join(', ') ||
    '관심사 없음';

  useEffect(() => {
    if (!regionId && !error) {
      // error 있으면 리다이렉트 안 하게
      navigate(`/explore/regions?region_id=1&lang=${currentLanguage}`, {
        replace: true,
      });
    }
  }, [regionId, currentLanguage, navigate, error]);

  if (error) {
    const axiosError = error as AxiosError;
    if (
      axiosError?.code === 'ERR_NETWORK' ||
      axiosError?.response?.status === 504
    )
      return <NetworkError onRetry={() => window.location.reload()} />;
    return <ErrorPage error={error} errorCode={ERROR_CODES.DATA_NOT_FOUND} />;
  }
  if (isLoading || !regionId) return <LoadingPage />;
  return (
    <div className='mt-8 w-full'>
      <Container>
        <Carousel />

        <div className='mt-[60px] flex flex-col'>
          <h1 className='tablet-bp:text-4xl mb-4 text-2xl font-semibold'>
            {region?.name || '...'}
          </h1>
          <h2 className='tablet-bp:text-[32px] mb-3.5 text-xl font-semibold'>
            {region?.description || '...'}
          </h2>
          <p className='text-sub-text-gray tablet-bp:text-base text-sm'>
            {region?.feature}
          </p>
        </div>

        <div className='mt-[60px] flex flex-col'>
          <h1 className='tablet-bp:text-[32px] mb-4 text-xl font-semibold'>
            {getLocationDisplayName()}
          </h1>
          <div className='flex justify-center'>
            <Weather />
          </div>
        </div>

        <div className='mt-16'>
          <h2 className='tablet-bp:text-[32px] text-xl font-semibold'>
            {t('places.popular_area_info')}
          </h2>
          <div className='mt-2 flex w-full justify-end'>
            <button
              className='cursor-pointer font-medium'
              onClick={() => {
                const params = new URLSearchParams({ lang: currentLanguage });
                if (regionId) params.set('region_id', String(regionId));

                const targetSubregionId =
                  subregionId || popularSubregions[0]?.id;
                if (targetSubregionId) {
                  params.set('subregion_id', String(targetSubregionId));
                }

                navigate(`/explore/districts?${params.toString()}`);
              }}
            >
              {t('common.view_all')}
            </button>
          </div>
          <ul className='tablet-bp:grid-cols-2 desktop-bp:grid-cols-4 mt-4 grid grid-cols-1 gap-4'>
            {popularSubregions.length > 0
              ? popularSubregions.map((sub) => (
                  <li key={sub.id}>
                    <InfoCard
                      id={sub.id}
                      type='region'
                      variant='selectable'
                      title={sub.name}
                      description={sub.description || ''}
                      details={sub.feature || ''}
                      isFavorite={sub.is_favorite}
                    />
                  </li>
                ))
              : Array.from({ length: 4 }).map((_, i) => (
                  <li key={`empty-subregion-${i}`}>
                    <EmptyCard type='subregions' />
                  </li>
                ))}
          </ul>
        </div>

        <h1 className='tablet-bp:text-4xl mt-14 text-2xl font-semibold'>
          {t('places.currently_viewing', { location: getCurrentRegionName() })}
        </h1>

        <div className='mt-16'>
          <h2 className='tablet-bp:text-[32px] text-xl font-semibold'>
            {t('places.main_attractions')}
          </h2>
          <div className='mt-2 flex w-full justify-end'>
            <button
              className='cursor-pointer font-medium'
              onClick={() => {
                const params = new URLSearchParams({ lang: currentLanguage });
                if (regionId) params.set('region_id', String(regionId));

                const targetSubregionId =
                  subregionId || popularSubregions[0]?.id;
                if (targetSubregionId) {
                  params.set('subregion_id', String(targetSubregionId));
                }

                navigate(`/explore/attractions?${params.toString()}`);
              }}
            >
              {t('common.view_all')}
            </button>
          </div>
          <ul className='tablet-bp:grid-cols-2 desktop-bp:grid-cols-4 mt-4 grid grid-cols-1 gap-4'>
            {majorPlaces.length > 0
              ? majorPlaces.slice(0, 4).map((place) => (
                  <li key={place.id}>
                    <InfoCard
                      id={place.id}
                      type='place'
                      variant='interactive'
                      title={place.name}
                      description={place.description ?? ''}
                      details={place.feature ?? ''}
                      imageUrl={place.image_url || ''}
                      isFavorite={place.is_favorite}
                      onViewDetails={() => handlePlaceDetailOpen(place.id)}
                      isDropdownOpen={openDropdownId === place.id}
                      onToggleDropdown={() => toggleDropdown(place.id)}
                      dropdownItems={dropdownItems}
                      isAddingToSchedule={isAddingToSchedule}
                      dropdownButtonRef={dropdownButtonRef}
                      dropdownContentRef={dropdownContentRef}
                    />
                  </li>
                ))
              : Array.from({ length: 4 }).map((_, i) => (
                  <li key={`empty-attraction-${i}`}>
                    <EmptyCard type='attractions' />
                  </li>
                ))}
          </ul>
        </div>

        {isLoggedIn && (
          <div className='mt-7'>
            <h2 className='tablet-bp:text-[32px] text-xl font-semibold'>
              {t('places.recommended_spots_for_user', {
                name: userProfile?.name || '사용자',
              })}
            </h2>
            <p className='text-sub-text-gray tablet-bp:text-base text-sm'>
              <Trans
                i18nKey='places.selected_based_on_interests'
                values={{ interest: interestNames }}
                components={{
                  InterestSpan: <span className='font-medium' />,
                }}
              />
            </p>
            <ul className='tablet-bp:grid-cols-2 desktop-bp:grid-cols-3 mt-7 grid grid-cols-1 gap-4'>
              {userRecommendedPlaces.length > 0
                ? userRecommendedPlaces.slice(0, 3).map((place) => (
                    <li key={place.id}>
                      <InfoCard
                        id={place.id}
                        type='place'
                        variant='interactive'
                        title={place.name}
                        imageUrl={place.image_url || ''}
                        description={place.description ?? ''}
                        details={place.feature ?? ''}
                        isFavorite={place.is_favorite}
                        onViewDetails={() => handlePlaceDetailOpen(place.id)}
                        isDropdownOpen={openDropdownId === place.id}
                        onToggleDropdown={() => toggleDropdown(place.id)}
                        dropdownItems={dropdownItems}
                        isAddingToSchedule={isAddingToSchedule}
                        dropdownButtonRef={dropdownButtonRef}
                        dropdownContentRef={dropdownContentRef}
                      />
                    </li>
                  ))
                : Array.from({ length: 3 }).map((_, i) => (
                    <li key={`empty-user-recommended-${i}`}>
                      <EmptyCard type='user-recommended' />
                    </li>
                  ))}
            </ul>
          </div>
        )}

        <div className='my-16'>
          <h2 className='tablet-bp:text-[32px] text-xl font-semibold'>
            {t('places.recommended_accommodations')}
          </h2>
          <div className='mt-2 flex w-full justify-end'>
            <button
              className='cursor-pointer font-medium'
              onClick={() => {
                const params = new URLSearchParams({ lang: currentLanguage });
                if (regionId) params.set('region_id', String(regionId));

                const targetSubregionId =
                  subregionId || popularSubregions[0]?.id;
                if (targetSubregionId) {
                  params.set('subregion_id', String(targetSubregionId));
                }

                navigate(`/explore/stays?${params.toString()}`);
              }}
            >
              {t('common.view_all')}
            </button>
          </div>
          <ul className='tablet-bp:grid-cols-2 desktop-bp:grid-cols-4 mt-4 grid grid-cols-1 gap-4'>
            {accommodations.length > 0
              ? accommodations.map((accommodation) => (
                  <li key={accommodation.id}>
                    <InfoCard
                      id={accommodation.id}
                      type='place'
                      variant='interactive'
                      imageUrl={accommodation.image_url || ''}
                      title={accommodation.name}
                      description={accommodation.description ?? undefined}
                      details={accommodation.feature ?? undefined}
                      isFavorite={accommodation.is_favorite}
                      onViewDetails={() =>
                        handlePlaceDetailOpen(accommodation.id)
                      }
                      isDropdownOpen={openDropdownId === accommodation.id}
                      onToggleDropdown={() => toggleDropdown(accommodation.id)}
                      dropdownItems={dropdownItems}
                      isAddingToSchedule={isAddingToSchedule}
                      dropdownButtonRef={dropdownButtonRef}
                      dropdownContentRef={dropdownContentRef}
                    />
                  </li>
                ))
              : Array.from({ length: 4 }).map((_, i) => (
                  <li key={`empty-accommodation-${i}`}>
                    <EmptyCard type='accommodations' />
                  </li>
                ))}
          </ul>
        </div>
      </Container>

      <LoginPromptModal
        isOpen={stack.isLoginPromptOpen}
        onClose={actions.closeLoginPrompt}
      />

      <PlaceDetailModal
        isOpen={selectedPlaceId !== null}
        onClose={handlePlaceDetailClose}
        placeId={selectedPlaceId}
        lang={currentLanguage}
      />
    </div>
  );
};

export default RegionsPage;
