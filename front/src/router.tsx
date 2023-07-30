import App from '@/App';
import LoginPage from '@/login/login-page';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/ok',
    element: <App />,
  },
]);
