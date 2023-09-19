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
import { useDispatch, useSelector } from 'react-redux';
import { selectMessages } from '../../redux-toolkit/messagesSlice'
import { getMsg } from '../../utils/messeageUtils';
import { msgType } from '../../utils/messagesEnum.js';
import { msgNumber } from '../../utils/msgNumbers.js';

import { selectlanguage,selectidx } from '../../redux-toolkit/languagesSlice';
import { selectDarkMode } from '../../redux-toolkit/darkModeSlice';

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

//------------------------------------------- create security random password when create user -------------------------------------------
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



//------------------------------------------- component show create user modal ------------------------------------------------------------
function BasicModal(props) {


  //-------------------------------------------------------------- States --------------------------------------------------------------------- 
  const isHebrew = useSelector(selectlanguage);
  const languageidx = useSelector(selectidx);
  const handleClose = () => props.handleOpenModal(false);
  const { notifyToast } = props;
  const [users, setUsers] = useState([]);
  const messages = useSelector(selectMessages);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [licenseTime, setLicenseTime] = useState();
  const [isTrial, setisTrial] = useState(false);
  const darkMode = useSelector(selectDarkMode);


  // This function call when admin click "Generate" button in create user modal and create random security password && username.
  const handleGenerateUser = () => {
    const generatedUsername = generatePassword();
    const generatedPassword = generatePassword();

    setUsername(generatedUsername);
    setPassword(generatedPassword);
  };


  // function fetchUsers() {
  //   api.get('/api/auth/users', {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   }).then((res) => {
  //     setUsers(res.data);
  //   }).catch((error) => {
  //     // Handle error if necessary
  //   });
  // }


  // useEffect(() => {
  //   fetchUsers(); // Call the fetchUsers function to fetch data and update the users state
  // }, []);


  // before create user check if username not exist.
  function checkUsernameExist(username) {
    return users.some(user => user.username === username);
  }


  // before create user check if email not exist.
  function checkEmailExist(email) {
    return users.some(user => user.email === email);
  }




  //validation form before create user.
  const validateForm = () => {
    if (checkUsernameExist(username)) {
      notifyToast(getMsg(messages, msgType.warnings, msgNumber[19],languageidx).msgText, getMsg(messages, msgType.warnings, msgNumber[19],languageidx).msgType);
      // notifyToast("Username already exist", "warning");
      return false;
    }

    if (checkEmailExist(email)) {
      notifyToast(getMsg(messages, msgType.warnings, msgNumber[18],languageidx).msgText, getMsg(messages, msgType.warnings, msgNumber[18],languageidx).msgType);
      // notifyToast("Email already exist", "warning");
      return false;
    }

    // Assuming password, email, and username are defined and assigned values somewhere above this function
    // Email validation regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (password === '' || email === '' || username === '') {

      if (password === '')
        notifyToast(getMsg(messages, msgType.warnings, msgNumber[17],languageidx).msgText, getMsg(messages, msgType.warnings, msgNumber[17],languageidx).msgType);
      //notifyToast("Password is missing", "warning");

      if (email === '')
        notifyToast(getMsg(messages, msgType.warnings, msgNumber[16],languageidx).msgText, getMsg(messages, msgType.warnings, msgNumber[16],languageidx).msgType);
      //  notifyToast("Email is missing", "warning");


      if (username === '')
        notifyToast(getMsg(messages, msgType.warnings, msgNumber[15],languageidx).msgText, getMsg(messages, msgType.warnings, msgNumber[15],languageidx).msgType);
      // notifyToast("Username is missing", "warning");
      return false;

    }

    if (password.length < 6) {
      notifyToast(getMsg(messages, msgType.warnings, msgNumber[8],languageidx).msgText, getMsg(messages, msgType.warnings, msgNumber[8],languageidx).msgType);
      // notifyToast("Password less than 6 characters", "warning");
      return false;
    } else if (!emailRegex.test(email)) {
      notifyToast(getMsg(messages, msgType.warnings, msgNumber[13],languageidx).msgText, getMsg(messages, msgType.warnings, msgNumber[13],languageidx).msgType);
      // notifyToast("Invalid email format", "warning");
      return false;
    } else {
      // Your code for successful form submission goes here
      // If everything is valid, you can proceed with the form submission
      // For example: submitForm();
      return true;
    }
  };


  // this function create a msg of 2 types : "Trial" and "Regular"  , after create the msg struct , send email with this info of user properties to user created. 
  const handleSendMail = async () => {
    let welcomeMessage;

    const formattedLicenseDate = licenseTime.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    if (isTrial) {

      const trialDays = 7; // Assuming the trial period is 7 days
      welcomeMessage = `Welcome to TradeExalt!

           
       Your trial account has been created, login credentials:  

        Username: ${username}
        Password: ${password}
        License Expiration Date: ${formattedLicenseDate}

       This is a trial account, and you can enjoy all the premium features of TradeExalt for ${trialDays} days, To get started, simply visit www.TradeExalt.co.il and sign in using your credentials. 
                  
        As a user of our TradeExalt app, it's essential that you carefully read and understand our Terms of Service and Privacy Policy. By accepting these terms and conditions,

        you also agree to be bound by the terms of the TradeExalt website. Please take the time to review the complete Terms of Service and Privacy Policy provided with this email.
          
        License Expiration Date: ${formattedLicenseDate}
        
        !Happy trading 
              
        ,Best regards 
        TradeExalt Team`;
    }
    else {
      const formattedLicenseDate = licenseTime.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

      welcomeMessage = `Welcome to TradeExalt!
          
      Your account has been created,Your login credentials:  

        Username: ${username}
        Password: ${password}
        License Expiration Date: ${formattedLicenseDate}
        
        For security purposes, we recommend changing your password after your first login. To get started, simply visit www.TradeExalt.co.il and sign in using your credentials.  As a user of our TradeExalt app, 

        it's essential that you carefully read and understand our Terms of Service and Privacy Policy. By accepting these terms and conditions, you also agree to be bound by the terms of the TradeExalt website.
    
        Please take the time to review the complete Terms of Service and Privacy Policy provided with this email. 
        
        !Happy trading 
        
        ,Best regards 
        TradeExalt Team`;

    }

    const data = {
      to: email,
      subject: 'Welcome to TradeExalt!',
      text: welcomeMessage,
      isTrial: isTrial,

    }

    await api.post('/api/sendEmail', data).then((res) => {
      notifyToast(getMsg(messages, msgType.success, msgNumber[7],languageidx).msgText, getMsg(messages, msgType.success, msgNumber[7],languageidx).msgType);
      //   notifyToast("mail Send successfully", "success");
    }).catch((err) => {
      notifyToast(getMsg(messages, msgType.errors, msgNumber[8],languageidx).msgText, getMsg(messages, msgType.errors, msgNumber[8],languageidx).msgType);
      // notifyToast("Mail not send", "error");
      console.log(err);
      return false;
    })

  }

  //this function call after user click on  "Create" Button. 
  const handleCreateUser = () => {
    if (validateForm()) {
      api
        .post('/api/auth/register', {
          username: username,
          email: email,
          password: password,
          license: licenseTime,


        })
        .then(async (response) => {
          handleSendMail();
          await props.handleOpenModal(false);
          await notifyToast(getMsg(messages, msgType.success, msgNumber[8],languageidx).msgText, getMsg(messages, msgType.success, msgNumber[8],languageidx).msgType);
          // notifyToast("User added successfully", "success");
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
              <Button variant="contained" onClick={handleGenerateUser} style={{ backgroundColor: darkMode ? '#1ba6dc' : "", color: darkMode ? 'white' : "", }}>
                Generate
              </Button>

              <Button variant="contained" onClick={handleCreateUser} style={{ backgroundColor: darkMode ? '#1ba6dc' : "", color: darkMode ? 'white' : "", }}>
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