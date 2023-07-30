import { createContext, useContext, useRef, useState } from 'react';

export const SnackBarContextProvider = (props: { children: any }) => {
  const [msg, setMsg] = useState('');
  const refTimer = useRef<number | undefined>(undefined);

  const [isDisplayed, setIsDisplayed] = useState(false);

  const displayHandler = (msg: any) => {
    setMsg(msg);
    setIsDisplayed(true);
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
        isDisplayed,
        displayMsg: displayHandler,
        onClose: closeHandler,
      }}
    >
      {props.children}
    </SnackbarContext.Provider>
  );
};

const SnackbarContext = createContext({
  msg: '',
  isDisplayed: false,
  displayMsg: (msg: string): any => ({}),
  onClose: (): any => ({}),
});

const useSnackbarContext = () => {
  return useContext(SnackbarContext);
};
export default useSnackbarContext;
