import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import api from '../../../api/api';
import { login } from '../../../redux-toolkit/userSlice';
import { useDispatch } from 'react-redux';
// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginForm = () => {
    if (!username || !password) return
    api.post('/api/auth/login', { username, password }).then((res) => {
      localStorage.setItem('token', res.data.token);
      dispatch(login(res.data));
    
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate('/dashboard/firstloginpage', { replace: true });
    }).catch((err) => {
      alert(err);
    })
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField name="User Name" label="User Name" value={username} onChange={(e) => setUsername(e.target.value)} />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 4 }}>


      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleLoginForm}>
        Login
      </LoadingButton>
    </>
  );
}
