import useSnackbar from '@/hooks/snack-context';
import { Snackbar, Alert } from '@mui/material';

export default function SnackBar() {
  const snackBarContext = useSnackbar();

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
