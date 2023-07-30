import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/router';
import { AuthContextProvider } from '@/context/auth-context';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { SnackBarContextProvider } from '@/context/snack-context';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SnackBar from '@/components/snack-bar';

const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <SnackBarContextProvider>
        <AuthContextProvider>
          <SnackBar />
          <RouterProvider router={router} />
        </AuthContextProvider>
      </SnackBarContextProvider>
    </LocalizationProvider>
  </StrictMode>,
);
