import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { TextField } from '@mui/material';

import { Grid } from 'rsuite';

import api from '../api/api'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  height: 230,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function FirstLoginPage (props) {
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
    <div>
      <Modal
         open={props.openModal}
         onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" style={{ marginBottom: '20px' }}>
            Change Password
          </Typography>
          <div>

            <TextField label="Password" value={password} onChange={handlePasswordChange} style={{ marginLeft: '15px' }} />

            <Grid>  
              <Button variant="contained" onClick={handleUpdateUser}>
                Update Password
              </Button></Grid>

          </div>
        </Box>
      </Modal>
    </div>
  );
}
