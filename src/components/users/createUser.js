import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { TextField, MenuItem } from '@mui/material';
import { Grid } from 'rsuite';
import AccountCircle from '@mui/icons-material/AccountCircle';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import api from '../../api/api';
import PropTypes from 'prop-types';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  height: 260,
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



function BasicModal(props) {
  const handleClose = () => props.handleOpenModal(false);
  const { notifyToast } = props;
  const [users, setUsers] = useState([]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [licenseTime, setLicenseTime] = useState();
  const [isTrial, setisTrial] = useState(false);

  const handleGenerateUser = () => {
    const generatedUsername = generatePassword();
    const generatedPassword = generatePassword();

    setUsername(generatedUsername);
    setPassword(generatedPassword);
  };


  function fetchUsers() {
    const token = localStorage.getItem("token");
    api.get('/api/auth/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      setUsers(res.data);
    }).catch((error) => {
      // Handle error if necessary
    });
  }


  useEffect(() => {
    fetchUsers(); // Call the fetchUsers function to fetch data and update the users state
  }, []);


  function checkUsernameExist(username) {
    return users.some(user => user.username === username);
  }



  function checkEmailExist(email) {
    return users.some(user => user.email === email);
  }



  const validateForm = () => {
    if (checkUsernameExist(username)) {
      notifyToast("Username already exist", "error");
      return false;
    }

    if (checkEmailExist(email)) {
      notifyToast("Email already exist", "error");
      return false;
    }



    // Assuming password, email, and username are defined and assigned values somewhere above this function

    // Email validation regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (password === '' || email === '' || username === '') {
      if (password === '') notifyToast("Password is missing", "warning");
      if (email === '') notifyToast("Email is missing", "warning");
      if (username === '') notifyToast("Username is missing", "warning");
      return false;

    }

    if (password.length < 6) {
      notifyToast("Password less than 6 characters", "warning");
      return false;
    } else if (!emailRegex.test(email)) {
      notifyToast("Invalid email format", "warning");
      return false;
    } else {
      // Your code for successful form submission goes here
      // If everything is valid, you can proceed with the form submission
      // For example: submitForm();
      return true;
    }
  };



  const handleSendMail = async () => {
    let welcomeMessage;


    const formattedLicenseDate = licenseTime.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
      if(isTrial){

        const trialDays = 7; // Assuming the trial period is 7 days
        welcomeMessage = `Welcome to TradeExalt!
          
          Your trial account has been created. This is a trial account, and you can enjoy all the premium features of TradeExalt for ${trialDays} days.
      
          To get started, simply visit www.TradeExalt.co.il and sign in using your credentials. 
                  
          As a user of our TradeExalt app, it's essential that you carefully read and understand our Terms of Service and Privacy Policy. By accepting these terms and conditions, you also agree to be bound by the terms of the TradeExalt website.
          
          Please take the time to review the complete Terms of Service and Privacy Policy provided with this email.
          
          License Expiration Date: ${formattedLicenseDate}
        
          !Happy trading 
              
          ,Best regards 
          TradeExalt Team`;
      }
      else
      {
        const formattedLicenseDate = licenseTime.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
    
       welcomeMessage = `:Your login credentials 
        Username: ${username}
        Password: ${password}
    
        License Expiration Date: ${formattedLicenseDate}
        
        For security purposes, we recommend changing your password after your first login. 
        
        To get started, simply visit www.TradeExalt.co.il and sign in using your credentials. 
            
        As a user of our TradeExalt app, it's essential that you carefully read and understand our Terms of Service and Privacy Policy. By accepting these terms and conditions, you also agree to be bound by the terms of the TradeExalt website.
    
        Please take the time to review the complete Terms of Service and Privacy Policy provided with this email.
        
        !Happy trading 
        
        ,Best regards 
        TradeExalt Team`;

      }


    const data = {
      to: email,
      subject: 'Welcome to TradeExalt!',
      text: welcomeMessage,
      isTrial:isTrial,

    }

    await api.post('/api/sendEmail', data).then((res) => {
      notifyToast("mail Send successfully", "success");
    }).catch((err) => {

      notifyToast("Mail not send", "error");
      console.log(err);
      return false;
    })

  }

  const handleCreateUser = () => {
    console.log(licenseTime);
    if (validateForm()) {

      api
        .post('/api/auth/register', {
          username: username,
          email: email,
          password: password,
          license: licenseTime,
        

        })
        .then(async (response) => {
          console.log('User created successfully:', response.data);
          handleSendMail();
          await props.handleOpenModal(false);
          await notifyToast("User added successfully", "success");
          // Fetch list of users from "/api/users" route
        })
        .catch((error) => {
          console.error('Failed to create user:', error);
        });
    }
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
    const selectedValue = event.target.value;
    const currentDate = new Date();
  
    if (selectedValue === "Trial") {
      setisTrial(true);
      const endDate = new Date(currentDate);
      endDate.setDate(currentDate.getDate() + 7);
      setLicenseTime(endDate);
    } else {
      setisTrial(false);
      const selectedMonths = Number(selectedValue);
      const endDate = new Date(currentDate);
      endDate.setMonth(currentDate.getMonth() + selectedMonths);

      setLicenseTime(endDate);
    }
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


            <Typography id="modal-modal-title" variant="h6" component="h5" style={{ fontSize: "12px", color: 'grey', marginLeft: '14px' }}>
              License Time
            </Typography>
          
        <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={licenseTime}
      label="License time"
      onChange={handleChange}
    >
      <MenuItem value="Trial">Trial</MenuItem>
      {[...Array(12)].map((_, index) => (
        <MenuItem key={index + 1} value={index + 1}>
          {index + 1} month
        </MenuItem>
      ))}
    </Select>
            <Grid container justify="flex-end" style={{ marginRight: '15px' }}>
              <Button variant="contained" onClick={handleGenerateUser}>
                Generate
              </Button>

              <Button variant="contained" onClick={handleCreateUser}>
                Create
              </Button>
            </Grid>

          </div>
        </Box>
      </Modal>
    </div>
  );
}



BasicModal.propTypes = {
  openModal: PropTypes.bool,
  fetchUsers: PropTypes.func,
  handleOpenModal: PropTypes.func,
  notifyToast: PropTypes.func,
}

export default BasicModal;