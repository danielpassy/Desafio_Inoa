import {
  Facebook,
  Google,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import api from '@/libs/data';
import useAuthContext from '@/context/auth-context';
import useSnackbarContext from '@/context/snack-context';
import { useNavigate } from 'react-router-dom';

function SelectableTitle({
  title,
  LoginSelected,
  setLoginSelected,
}: {
  title: string;
  LoginSelected: boolean;
  setLoginSelected: (x: boolean) => void;
}) {
  return (
    <Typography
      sx={{
        cursor: 'pointer',
      }}
      component={'span'}
      variant="h6"
      className={LoginSelected ? 'font-light' : 'font-semibold'}
      onClick={() => setLoginSelected(false)}
    >
      {title}
    </Typography>
  );
}

export default function LoginPage() {
  const [LoginSelected, setLoginSelected] = useState(true);
  const centerFlex = {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
  };

  return (
    <Box
      sx={{
        width: {
          lg: '30vw',
          sm: '50vw',
          xs: '90vw',
        },
        margin: 'auto',
        pt: 3,
      }}
    >
      <Card raised>
        <CardContent sx={{ ...centerFlex, mx: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-evenly',
            }}
          >
            <Typography
              sx={{ cursor: 'pointer' }}
              component={'span'}
              variant="h6"
              className={LoginSelected ? 'font-semibold' : 'font-light'}
              onClick={() => setLoginSelected(true)}
            >
              Login
            </Typography>

            <Divider sx={{ mx: 2 }} flexItem orientation="vertical" />

            <SelectableTitle
              title={'Register'}
              LoginSelected={LoginSelected}
              setLoginSelected={setLoginSelected}
            />
          </Box>
          <Box className="py-2" />

          {LoginSelected ? <LoginForm /> : <RegisterForm />}

          <Divider sx={{ my: 3 }} />

          <Box sx={{ textAlign: 'center', pb: 3 }}>
            <Typography variant="subtitle2" component="span">
              Or Login With
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <Button
              color="primary"
              variant="contained"
              sx={{ mx: 'auto', backgroundColor: 'blue' }}
            >
              <Google sx={{ mr: 1 }} />
              Google
            </Button>
            <Divider
              sx={{ mx: 2 }}
              flexItem
              orientation="vertical"
              variant="middle"
            />
            <Button
              color="primary"
              variant="contained"
              sx={{ mx: 'auto', backgroundColor: 'light-blue' }}
            >
              <Facebook sx={{ mr: 1 }} />
              Facebook
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const authContext = useAuthContext();
  const snackbar = useSnackbarContext();
  const navigate = useNavigate();

  const submit = async () => {
    try {
      const user = await api.auth.login(email, password);
      authContext.setUser(user);
      navigate('/');
    } catch (err: any) {
      snackbar.displayMsg(err.response.data.message);
    }
  };
  return (
    <>
      <TextField
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="my-2"
        label="Email"
        variant="outlined"
      />

      {/* Password */}
      <FormControl className="my-2" variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          type={showPassword ? 'text' : 'password'}
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              submit();
            }
          }}
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
      <Button onClick={submit} className="my-2" variant="outlined">
        Login
      </Button>
    </>
  );
}

function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const passwordsMatch = password === repeatPassword;
  const canSubmit = !!(
    email.length > 5 &&
    password &&
    repeatPassword &&
    passwordsMatch
  );

  const submit = async () => {
    await api.auth.register(email, password);
    navigate('/login');
  };

  return (
    <>
      <TextField
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="my-2"
        label="Email"
        variant="outlined"
      />

      {/* Password */}
      <TextField
        variant="outlined"
        type={showPassword ? 'text' : 'password'}
        label="Password"
        className="my-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Reapeat Password */}
      <TextField
        variant="outlined"
        error={!passwordsMatch}
        helperText={passwordsMatch ? null : 'Passwords do not match'}
        type={showPassword ? 'text' : 'password'}
        label="Reapeat Password"
        className="my-2"
        value={repeatPassword}
        onChange={(e) => setRepeatPassword(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Button
        onClick={submit}
        disabled={!canSubmit}
        className="my-2"
        variant="outlined"
      >
        Register
      </Button>
    </>
  );
}
