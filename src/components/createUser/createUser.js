import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { TextField, MenuItem } from '@mui/material';
import axios from 'axios';
import { Grid } from 'rsuite';
import AccountCircle from '@mui/icons-material/AccountCircle';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import api from '../../api/api';

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
const generatePassword = () => {
  const length = 10;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  let password = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
};

export default function BasicModal(props) {
  const handleOpen = () => props.handleOpenModal(true);
  const handleClose = () => props.handleOpenModal(false);
  const { notifyToast, fetchUsers } = props;
  console.log("props", props);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [licenseTime, setLicenseTime] = useState(1);

  const handleGenerateUser = () => {
    const generatedUsername = generatePassword();
    const generatedPassword = generatePassword();

    setUsername(generatedUsername);
    setPassword(generatedPassword);
  };


  const handleCreateUser = () => {
    const token = localStorage.getItem("token");
    // Send user details to "/api/auth/register" route
    api
      .post('/api/auth/register', {
        username: username,
        email: email,
        password: password,
        license: licenseTime
      })
      .then((response) => {
        console.log('User created successfully:', response.data);
        notifyToast("User added successfully", "success");
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

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };


  const handleChange = (event) => {
    const selectedMonths = event.target.value;
    const currentDate = new Date();
    const endDate = new Date(currentDate.setMonth(currentDate.getMonth() + selectedMonths));
    setLicenseTime(selectedMonths);
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
            Create User
          </Typography>
          <div>

            <TextField label="Username" value={username} onChange={handleUsernameChange} InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            }} />
            <TextField label="Password" value={password} onChange={handlePasswordChange} style={{ marginLeft: '15px' }} />
            <TextField label="Email" value={email} onChange={handleEmailChange} style={{ marginLeft: '15px' }} />

            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={licenseTime}
              label="License time"
              onChange={handleChange}
              defaultValue={licenseTime}
            >
              {[...Array(12)].map((_, index) => (
                <MenuItem key={index + 1} value={index + 1}>
                  {index + 1} month
                </MenuItem>
              ))}
            </Select>

            <Grid>  <Button variant="contained" onClick={handleGenerateUser}>
              Generate
            </Button>
              <Button variant="contained" onClick={handleCreateUser}>
                Create
              </Button></Grid>

          </div>
        </Box>
      </Modal>
    </div>
  );
}
