import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { TextField } from '@mui/material';

import { Grid } from 'rsuite';

import api from '../api/api'


export default function U (props) {
  const handleOpen = () => props.handleOpenModal(true);
  const handleClose = () => props.handleOpenModal(false);
  const { notifyToast } = props;

  
  const [password, setPassword] = useState('');
  

  const handleUpdateUser = () => {
    const token = localStorage.getItem("token");
    // Send user details to "/api/auth/register" route
    api
      .post('/api/auth/register', {
        password: password,
        
      })
      .then((response) => {
       
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
  };


  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };


  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Box
      sx={{
        width: '600px', // Set the desired width of the box
        height:'190px',
        padding: '20px',
        background: '#fff', // Set the background color
        borderRadius: '8px',
        boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.2)',
      }}
    >
      <Typography id="modal-modal-title" variant="h6" component="h2" style={{ marginBottom: '30px' }}>
        Change Password
      </Typography>
      <div style={{ display: 'flex', alignItems: 'center' }}>
      <Grid>
          <TextField fullWidth type='password' label="Password" value={password} onChange={handlePasswordChange} style={{ marginLeft: '4px' , width: '100%',}} />
         
          </Grid>
          
          <Button variant="contained" onClick={handleUpdateUser} style={{ marginLeft: '15px' }}>
              Update
            </Button>
        </div>
    </Box>
  </div>
);
}








