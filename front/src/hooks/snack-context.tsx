import { AlertColor } from '@mui/material/Alert';
import { ReactNode, createContext, useContext, useRef, useState } from 'react';

interface SnackbarContextType {
  msg: string;
  snackType: AlertColor;
  isDisplayed: boolean;
  displayMsg: (msg: string, type?: AlertColor) => void;
  onClose: () => void;
}

const SnackbarContext = createContext<SnackbarContextType>(
  {} as SnackbarContextType,
);

export const SnackBarContextProvider = (props: { children: ReactNode }) => {
  const [msg, setMsg] = useState('');
  const [snackType, setSnackType] = useState<AlertColor>('error');
  const refTimer = useRef<number | undefined>(undefined);

  const [isDisplayed, setIsDisplayed] = useState(false);

  const displayHandler = (msg: string, type: AlertColor = 'error') => {
    setMsg(msg);
    setIsDisplayed(true);
    setSnackType(type);
    refTimer.current = window.setTimeout(() => {
      closeHandler();
    }, 5000);
  };

  const closeHandler = () => {
    window.clearTimeout(refTimer.current);
    setIsDisplayed(false);
  };
  return (
    <SnackbarContext.Provider
      value={{
        msg,
        snackType,
        isDisplayed,
        displayMsg: displayHandler,
        onClose: closeHandler,
      }}
    >
      {props.children}
    </SnackbarContext.Provider>
  );
};

const useSnackbar = () => {
  return useContext(SnackbarContext);
};
export default useSnackbar;
