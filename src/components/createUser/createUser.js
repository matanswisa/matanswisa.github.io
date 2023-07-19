import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { TextField } from '@mui/material';
import axios from 'axios';
import { Grid } from 'rsuite';

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
  const { notifyToast } = props;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleGenerateUser = () => {
    const generatedUsername = generatePassword();
    const generatedPassword = generatePassword();

    setUsername(generatedUsername);
    setPassword(generatedPassword);
  };

  const handleCreateUser = () => {
    // Send user details to "/api/auth/register" route
    axios
      .post('/api/auth/register', {
        username: username,
        email: email,
        password: password,
      })
      .then((response) => {
        console.log('User created successfully:', response.data);
        // Fetch list of users from "/api/users" route
        axios
          .get('/api/users')
          .then((response) => {
            console.log('List of users:', response.data);
            // Perform any further actions with the list of users
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

      <TextField label="Username" value={username} onChange={handleUsernameChange}  />
      <TextField label="Password" value={password} onChange={handlePasswordChange} style={{ marginLeft: '15px' }} />
      <TextField label="Email" value={email} onChange={handleEmailChange} style={{ marginLeft: '15px' }} />
 
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
