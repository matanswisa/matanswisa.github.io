import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';
import api from '../api/api'
import { useSelector } from 'react-redux';
import { selectUser, selectUserName } from '../redux-toolkit/userSlice';



import { selectMessages } from '../redux-toolkit/messagesSlice'
import { getMsg } from '../utils/messeageUtils';
import { msgType } from '../utils/messagesEnum.js';
import { msgNumber } from '../utils/msgNumbers.js';


export default function UserDahsboard(props) {
  const handleOpen = () => props.handleOpenModal(true);
  const handleClose = () => props.handleOpenModal(false);
  const { notifyToast } = props;
  const messages = useSelector(selectMessages);
  // const dispatch = useDispatch();
  const username = useSelector(selectUserName);
  const [password, setPassword] = useState('');
  const user = useSelector(selectUser);

  const validateForm = () => {

    if (password === '') {
      if (password === '')
        notifyToast(getMsg(messages, msgType.warnings, msgNumber[9]).msgText, getMsg(messages, msgType.warnings, msgNumber[9]).msgType);
      //notifyToast("Password is missing", "warning");
      return false;
    }
    if (password.length < 6) {
      notifyToast(getMsg(messages, msgType.warnings, msgNumber[8]).msgText, getMsg(messages, msgType.warnings, msgNumber[8]).msgType);
      //  notifyToast("Password less than 6 characters", "warning");
      return false;

    } else {

      return true;
    }
  };





  const handleUpdateUser = async () => {

    if (validateForm()) {
      await api
        .put('/api/auth/updateUserPassword', {
          username: username,
          password: password,
        }, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          }
        })
        .then((response) => {
          notifyToast(getMsg(messages, msgType.success, msgNumber[11]).msgText, getMsg(messages, msgType.success, msgNumber[11]).msgType);
          // notifyToast("Password Updated successfully", "success");
          props.handleOpenModal(false);
          // Fetch list of users from "/api/users" route
          api
            .get('/api/auth/users', {
              headers: {
                Authorization: `Bearer ${user.accessToken}`,
              }
            })
            .then((response) => {
              if (props?.handleFetchUsers)
                props.handleFetchUsers();

              // Perform any further actions with the list of users
            })
            .catch((error) => {
              console.error('Failed to fetch list of users:', error);
            });
        })
        .catch((err) => {
          if (err.response && err.response.data && err.response.data.samePassword) {
            notifyToast(getMsg(messages, msgType.warnings, msgNumber[29]).msgText, getMsg(messages, msgType.warnings, msgNumber[29]).msgType);
            //  notifyToast("Please enter a different password.", "warning");
            return;
          }
        });
    }
  };




  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Box
        sx={{
          width: '600px',
          height: '220px',
          padding: '20px',
          background: '#fff',
          borderRadius: '8px',
          boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.2)',
          display: 'flex', // Add display:flex to the box to enable flex layout
          flexDirection: 'column', // Set flexDirection to column to stack elements vertically
          justifyContent: 'space-between', // Align elements vertically with space in between
        }}
      >
        <Typography id="modal-modal-title" variant="h6" component="h2" style={{ marginBottom: '4px' }}>
          Change Password
        </Typography>
        <div>

        </div>

        <TextField
          disabled
          id="outlined-disabled"
          label="User Name"
          value={username}
          style={{ marginLeft: '4px', width: '40%', marginBottom: '15px' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          <TextField
            fullWidth
            type='password'
            label="Password"
            value={password}
            onChange={handlePasswordChange}
            style={{ marginLeft: '4px', width: '100%' }}
          />
          <Button variant="contained" onClick={handleUpdateUser} style={{ marginLeft: '15px' }}>
            Update
          </Button>
        </div>
      </Box >
    </div >
  );

}








