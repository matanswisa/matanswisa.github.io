import React from 'react';
import { Tabs, Tab, Box,Button } from '@mui/material';
import AdminManagementPage from '../../pages/AdminDashboard'; // Import the UsersManagementPage component
import UsersManagementPage from '../../pages/UserDahboard'
import AccountPage from '../../components/accounts/AccountPage';
import { useNavigate } from 'react-router-dom';
import useToast from '../../hooks/alert'
import { ToastContainer, } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

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

    const dataFromLocalStorage = localStorage.getItem('user');
    // Parse the JSON data to get the JavaScript object
    const parsedData = JSON.parse(dataFromLocalStorage);

    const showToast = useToast();

    const notifyToast = (Msg, Type) => {

        showToast(Msg, Type);
    }

   
    
  const [selectedTab, setSelectedTab] = React.useState(0);
  const navigate = useNavigate();
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleNavigateToDashboard = () => {
    navigate('/dashboard'); // Replace '/dashboard' with the path to your dashboard page
  };
  return (
    <div>
       <ToastContainer />
            <Button onClick={handleNavigateToDashboard}>Back</Button>
      <Tabs value={selectedTab} onChange={handleTabChange} centered>

        
      {parsedData.user.role == 1 ?   <Tab label="Users Management" /> :   <Tab label="User Management" />
      }
       

        <Tab label="Accounts" />

        
        {/* <Tab label="Languages" />    #############Version 2##############
        <Tab label="Colors" /> */}
        
        {/* Add more tabs here if needed */}
      </Tabs>




      {parsedData.user.role == 1 ? <TabPanel value={selectedTab} index={0}>
        <AdminManagementPage />
      </TabPanel> : <TabPanel value={selectedTab} index={0}>
        <UsersManagementPage notifyToast={notifyToast} />
      </TabPanel>}


      <TabPanel value={selectedTab} index={1}>
       
      <AccountPage/>
      </TabPanel>
{/* 
      <TabPanel value={selectedTab} index={2}>    #############Version 2##############
       

      </TabPanel>
      <TabPanel value={selectedTab} index={3}>
     
      </TabPanel> */}
      {/* Add more TabPanels here for additional tabs */}

    </div>
  );
};

export default MyTabs;
