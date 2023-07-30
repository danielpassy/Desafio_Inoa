import LoginPage from '@/pages/login/login-page';
import HomePage from '@/pages/home/home-page';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <HomePage />,
  },
]);
