import useSnackbarContext from '@/context/snack-context';
import { Snackbar, Alert } from '@mui/material';

export default function SnackBar() {
  const snackBarContext = useSnackbarContext();

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      open={snackBarContext.isDisplayed}
      autoHideDuration={6000}
      onClose={snackBarContext.onClose}
    >
      <Alert
        onClose={snackBarContext.onClose}
        severity={snackBarContext.snackType}
        sx={{ width: '100%' }}
      >
        {snackBarContext.msg}
      </Alert>
    </Snackbar>
  );
}
