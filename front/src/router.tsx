import LoginPage from '@/pages/login/login-page';
import HomePage from '@/pages/home/home-page';
import AssetPage from '@/pages/asset/asset-page';
import { createBrowserRouter } from 'react-router-dom';
import AuthGuardMiddleware from '@/middleware/auth-guard-middleware';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <AuthGuardMiddleware>
        <HomePage />
      </AuthGuardMiddleware>
    ),
  },
  {
    path: '/asset/:assetId',
    element: (
      <AuthGuardMiddleware>
        <AssetPage />
      </AuthGuardMiddleware>
    ),
  },
]);
