import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import defaultLayout from '@/layouts/defaultLayout';
import ProtectedRoute from '@/components/domain/auth/ProtectedRoute';
import Spinner from '@/components/common/Spinner';
import { InterestProvider } from '@/context/InterestContext';

// =================================================================
// [1] 페이지들을 Lazy Load로 변환 (사용자가 해당 페이지 갈 때 다운로드)
// =================================================================

// 공개 페이지
const FirstSearchingPage = lazy(() => import('@/pages/firstSearchingPage'));
const LoginPage = lazy(() => import('@/pages/loginPage'));
const SignUpPage = lazy(() => import('@/pages/signUpPage'));
const ResetPasswordPage = lazy(() => import('@/pages/resetPasswordPage'));
const RegionsPage = lazy(() => import('@/pages/regionsPage'));
const DistrictListPage = lazy(() => import('@/pages/districtListPage'));
const StayListPage = lazy(() => import('@/pages/stayListPage'));
const AttractionsPage = lazy(() => import('@/pages/attractionsPage'));
const TravelTipsPage = lazy(() => import('@/pages/travelTipsPage'));
const LanguagePage = lazy(() => import('@/pages/languagePage'));
const FindPasswordPage = lazy(
  () => import('@/pages/accountRecovery/findPasswordPage')
);
const FindAccountPage = lazy(
  () => import('@/pages/accountRecovery/findAccountPage')
);

// Status / Callback 페이지
const OAuthCallbackPage = lazy(
  () => import('@/pages/statusPage/oAuthCallbackPage')
);
const GoogleCalendarCallbackPage = lazy(
  () => import('@/pages/statusPage/googleCalendarCallbackPage')
);
const NotFoundPage = lazy(() => import('@/pages/statusPage/notFoundPage'));
const ErrorPage = lazy(() => import('@/pages/statusPage/errorPage'));

// 보호된 페이지 / 마이페이지
const PlannerPage = lazy(() => import('@/pages/plannerPage'));
const MyPage = lazy(() => import('@/pages/myPage'));
const ProfileCard = lazy(
  () => import('@/components/domain/myPage/ProfileCard')
);
const MyPlannerPage = lazy(() => import('@/pages/myPage/myPlannerPage'));
const FavoritePlacesPage = lazy(() => import('@/pages/myPage/places'));
const FavoriteRegionsPage = lazy(() => import('@/pages/myPage/regions'));
const InterestPage = lazy(() => import('@/pages/interestPage'));
const TripDetailPage = lazy(() => import('@/pages/tripDetailPage'));
const TripEditPage = lazy(() => import('@/pages/tripEditPage'));

// =================================================================
// [2] 로딩 중일 때 보여줄 스피너 래퍼 (Suspense)
// =================================================================
const Load = (
  Component: React.LazyExoticComponent<any> | React.ComponentType<any>
) => {
  return (
    <Suspense
      fallback={
        <div className='flex h-[calc(100vh-80px)] items-center justify-center'>
          <Spinner />
        </div>
      }
    >
      <Component />
    </Suspense>
  );
};

// =================================================================
// [3] 라우터 설정 (element 부분에 Load() 함수 사용)
// =================================================================
export const router = createBrowserRouter([
  {
    path: '/',
    Component: defaultLayout,
    errorElement: Load(ErrorPage),
    children: [
      // 공개 페이지들
      {
        index: true,
        element: Load(FirstSearchingPage),
      },
      {
        path: 'login',
        element: Load(LoginPage),
      },
      {
        path: 'register',
        element: Load(SignUpPage),
      },
      {
        path: 'auth/password-reset-success',
        element: Load(ResetPasswordPage),
      },
      {
        path: 'explore/regions',
        element: Load(RegionsPage),
      },
      {
        path: 'explore/districts',
        element: Load(DistrictListPage),
      },
      {
        path: 'explore/stays',
        element: Load(StayListPage),
      },
      {
        path: 'explore/attractions',
        element: Load(AttractionsPage),
      },
      {
        path: 'tips',
        element: Load(TravelTipsPage),
      },
      {
        path: 'first-region-search',
        element: Load(FirstSearchingPage),
      },
      {
        path: 'language',
        element: Load(LanguagePage),
      },
      {
        path: 'callback',
        element: Load(OAuthCallbackPage),
      },
      {
        path: '/calendar/google/callback',
        element: Load(GoogleCalendarCallbackPage),
      },
      {
        path: '/forgot-password',
        element: Load(FindPasswordPage),
      },
      {
        path: '/find-account',
        element: Load(FindAccountPage),
      },

      // 보호된 페이지들
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'planner/:planId',
            element: Load(PlannerPage),
          },
          {
            path: 'mypage',
            element: Load(MyPage),
            children: [
              {
                index: true,
                element: Load(ProfileCard),
              },
              { path: 'plan', element: Load(MyPlannerPage) },
              { path: 'places', element: Load(FavoritePlacesPage) },
              { path: 'regions', element: Load(FavoriteRegionsPage) },
            ],
          },
          {
            path: 'interest',
            element: (
              <InterestProvider>
                {/* Provider 안쪽만 Lazy Loading 적용 */}
                {Load(InterestPage)}
              </InterestProvider>
            ),
          },
          {
            path: 'trip/:id',
            element: Load(TripDetailPage),
          },
          {
            path: 'trip/:id/edit',
            element: Load(TripEditPage),
          },
        ],
      },
      {
        path: '*',
        element: Load(NotFoundPage),
      },
    ],
  },
]);
