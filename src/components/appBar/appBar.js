import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SelectAccount from '../../components/accounts/selectAccount'
import api from '../../api/api';
import { useEffect, useState } from 'react';
import { selectUserAccounts  } from '../../redux-toolkit/userSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function ButtonAppBar() {
  


 


  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#f9fafb', boxShadow: 'none', }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'flex-end' }}>

     

          

        
        </Toolbar>
      </AppBar>
    </Box>
  );
}