import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { TextField } from '@mui/material';

import { Grid } from 'rsuite';

import api from '../api/api'
import { useDispatch, useSelector } from 'react-redux';
import { selectUserName } from '../redux-toolkit/userSlice';


export default function U(props) {
  const handleOpen = () => props.handleOpenModal(true);
  const handleClose = () => props.handleOpenModal(false);
  const { notifyToast } = props;
 
  // const dispatch = useDispatch();
  const username = useSelector(selectUserName);

  const [password, setPassword] = useState('');


  
  const validateForm = () => {

   
  
    // if (password === props.password) {
    //   notifyToast("New password cannot be the same as the current password.", "warning");
    //   return false;
    // } 

  
    if (password === '') {
      if (password === '') notifyToast("Password is missing", "warning");
      return false;
    } 
    if (password.length < 6) {
      notifyToast("Password less than 6 characters", "warning");
      return false;
   
    } else {
    
      return true;
    }
  };



  const handleUpdateUser = () => {


    const token = localStorage.getItem("token");
    // Send user details to "/api/auth/register" route

    if (validateForm()){
    api
      .put('/api/auth/updateUserPassword', {
        username: username,
        password: password,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }).then((response) => {

        notifyToast("Password Updated successfully", "success");
        props.handleOpenModal(false);
        // Fetch list of users from "/api/users" route
        api
          .get('/api/auth/users', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            if (props?.handleFetchUsers)
              props.handleFetchUsers();
            console.log('List of users:', response.data);
            // Perform any further actions with the list of users`
          })
          .catch((error) => {

            console.error('Failed to fetch list of users:', error);
          });
      })
      .catch((error) => {
        console.error('Failed to create user:', error);
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
            style={{ marginLeft: '4px', width: '40%',  marginBottom: '15px'}}
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
      </Box>
    </div>
  );
  
}








