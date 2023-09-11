import React from 'react';
import { Tabs, Tab, Box, Button } from '@mui/material';
import AdminManagementPage from './AdminDashboard'; // Import the UsersManagementPage component
import UsersManagementPage from './UserDahboard'
import AccountPage from '../components/accounts/AccountPage';
import { useNavigate } from 'react-router-dom';
import useToast from '../hooks/alert'
import { ToastContainer, } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { selectDarkMode } from '../redux-toolkit/darkModeSlice';
import { selectlanguage } from '../redux-toolkit/languagesSlice';

import { selectUser } from '../redux-toolkit/userSlice';
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  // const dispatch = useDispatch();
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
};


const MyTabs = () => {
  const isHebrew = useSelector(selectlanguage);

  const darkMode = useSelector(selectDarkMode);

  // Parse the JSON data to get the JavaScript object
  // const parsedData = JSON.parse(dataFromLocalStorage);

  const showToast = useToast();

  const notifyToast = (Msg, Type) => {

    showToast(Msg, Type);
  }
  const user = useSelector(selectUser);



  const [selectedTab, setSelectedTab] = React.useState(0);
  const navigate = useNavigate();
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <div>
      <ToastContainer />
      {/* <Button onClick={handleNavigateToDashboard}>Back</Button> */}
      <Tabs value={selectedTab} onChange={handleTabChange} centered>



        {
          user.role == 1 ? <Tab label={isHebrew === false ? "Users Management" : "ניהול משתמשים"} style={{ color: selectedTab === 1 ? darkMode ? '#fff' : '#326fd6' : selectedTab === 0 ? darkMode ? '#fff' : '#326fd6' : '#000', }} /> : <Tab label={isHebrew === false ? "User Management" : "ניהול משתמש"} style={{ color: selectedTab === 1 ? darkMode ? '#fff' : '#326fd6' : selectedTab === 0 ? darkMode ? '#fff' : '#326fd6' : '#000', }} />
        }


        {/* This tabs need be for both types of user (admin and regular user.) */}
        <Tab label={isHebrew === false ? "Accounts" : "חשבונות"} style={{ color: selectedTab === 1 ? darkMode ? '#fff' : '#326fd6' : selectedTab === 0 ? darkMode ? '#fff' : '#326fd6' : '#000', }} />

      </Tabs >


      {/* <Tab label="Languages" />    #############Version 2##############
        <Tab label="Colors" /> */}

      {/* Add more tabs here if needed */}
      {/* Tabs for Admin only */}
      {
        user.role == 1 ?
          <TabPanel value={selectedTab} index={0}>

            <AdminManagementPage />


          </TabPanel>

          /* Tabs for Regular user only */
          : <TabPanel value={selectedTab} index={0}>

            <UsersManagementPage notifyToast={notifyToast} />     { /* Tab for regular user to manage password*/}

          </TabPanel >}


      <TabPanel value={selectedTab} index={1}>

        <AccountPage />                                           { /* Tab for regular user to manage accounts*/}

      </TabPanel >

    </div >
  );
};

export default MyTabs;
