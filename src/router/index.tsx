import ProfileCard from '@/components/domain/myPage/ProfileCard';

import defaultLayout from '@/layouts/defaultLayout';

import MyPage from '@/pages/myPage';
import FavoritePlacesPage from '@/pages/myPage/places';
import MyPlannerPage from '@/pages/myPage/myPlannerPage';
import FavoriteRegionsPage from '@/pages/myPage/regions';

import { InterestProvider } from '@/context/InterestContext';
import DistrictListPage from '@/pages/districtListPage';
import InterestPage from '@/pages/interestPage';
import PlannerPage from '@/pages/plannerPage';
import RegionsPage from '@/pages/regionsPage';
import SignUpPage from '@/pages/signUpPage';
import TravelTipsPage from '@/pages/travelTipsPage';
import TripDetailPage from '@/pages/tripDetailPage';
import { createBrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/loginPage';
import FirstSearchingPage from '@/pages/firstSearchingPage';
import LanguagePage from '@/pages/languagePage';
import ResetPasswordPage from '@/pages/resetPasswordPage';
import NotFoundPage from '@/pages/statusPage/notFoundPage';
import ErrorPage from '@/pages/statusPage/errorPage';
import AttractionsPage from '@/pages/attractionsPage';
import ProtectedRoute from '@/components/domain/auth/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: defaultLayout,
    children: [
      // 공개 페이지들
      {
        index: true,
        element: <FirstSearchingPage />,
      },
      {
        path: '404',
        element: <NotFoundPage />,
      },
      {
        path: 'error',
        element: <ErrorPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <SignUpPage />,
      },
      {
        path: 'auth/password-reset-success',
        element: <ResetPasswordPage />,
      },
      {
        path: 'explore/regions',
        element: <RegionsPage />,
      },
      {
        path: 'explore/districts',
        element: <DistrictListPage />,
      },
      {
        path: 'explore/attractions',
        element: <AttractionsPage />,
      },
      {
        path: 'tips',
        element: <TravelTipsPage />,
      },
      {
        path: 'first-region-search',
        element: <FirstSearchingPage />,
      },
      {
        path: 'language',
        element: <LanguagePage />,
      },

      // 보호된 페이지들
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'planner',
            element: <PlannerPage />,
          },
          {
            path: 'mypage',
            element: <MyPage />,
            children: [
              {
                index: true,
                element: <ProfileCard />,
              },
              { path: 'plan', element: <MyPlannerPage /> },
              { path: 'places', element: <FavoritePlacesPage /> },
              { path: 'regions', element: <FavoriteRegionsPage /> },
            ],
          },
          {
            path: 'interest',
            element: (
              <InterestProvider>
                <InterestPage />
              </InterestProvider>
            ),
          },
          {
            path: 'trip/:id',
            element: <TripDetailPage />,
          },
          {
            path: 'trip/:id/edit',
            element: <PlannerPage />,
          },
        ],
      },
    ],
  },
]);
