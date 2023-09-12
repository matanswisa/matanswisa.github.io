import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Stack, IconButton, InputAdornment, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import api, { axiosAuth, axiosNoAuth } from '../../../api/api';
import { login } from '../../../redux-toolkit/userSlice';
import { useDispatch } from 'react-redux';
import useToast from '../../../hooks/alert';
import { ToastContainer, } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';

import {  selectidx } from '../../../redux-toolkit/languagesSlice';
import { selectMessages } from '../../../redux-toolkit/messagesSlice'
import { getMsg } from '../../../utils/messeageUtils';
import { msgType } from '../../../utils/messagesEnum.js';
import { msgNumber } from '../../../utils/msgNumbers.js';
// ----------------------------------------------------------------------

export default function LoginForm(props) {

  const showToast = useToast();
  const notifyToast = (Msg, Type) => {

    showToast(Msg, Type);
  }

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const languageidx = useSelector(selectidx);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const messages = useSelector(selectMessages);
  console.log(messages);
  const handleLoginForm = () => {
    if (!username || !password) return;

    axiosAuth.post('/api/auth/login', { username, password }).then((res) => {

      localStorage.setItem('user', JSON.stringify(res.data.user));
      dispatch(login(res.data));
      navigate('/dashboard/app', { replace: true });
    }).catch((err) => {
      console.log(err);
      // console.log(err.response.data.isLicenseExpired);
      if (err.response && err.response.data && err.response.data.isLicenseExpried) {
        notifyToast(getMsg(messages, msgType.warnings, msgNumber[30],languageidx).msgText, getMsg(messages, msgType.warnings, msgNumber[30],languageidx).msgType);
        // notifyToast("Your license has expired. Please renew it to continue using the service.", "info");
      } else {
        notifyToast(getMsg(messages, msgType.warnings, msgNumber[14],languageidx).msgText, getMsg(messages, msgType.warnings, msgNumber[14],languageidx).msgType);
        // Toast("Sorry, One or more login details are incorrect. Please try again.", "error");
      }

    })
  };

  return (
    <>
      <Stack spacing={3}>
        <ToastContainer />
        <TextField     inputProps={{ style: { color: 'black' } }} name="User Name"   value={username} onChange={(e) => setUsername(e.target.value)} />

        <TextField InputLabelProps={{
          style: { color: 'black' }, // Set the label color to black
        }}
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          inputProps={{ style: { color: 'black' } }}
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
