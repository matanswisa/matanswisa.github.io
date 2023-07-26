import * as React from 'react';
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
export default function ButtonAppBar() {
  const [accounts, setAccounts] = useState([]);




  const fetchAccounts = async () => {
    try {
      const response = await api.get('/api/accounts');
      setAccounts(response.data);

      
    } catch (error) {
      console.error(error);
    }
  };

  
  useEffect(() => {
    fetchAccounts();
    
  }, []);




  return (
    <Box sx={{ flexGrow: 1 }}>
       <AppBar position="static" sx={{ backgroundColor: '#ffffff', boxShadow: 'none',  }}>
       <Toolbar sx={{ display: 'flex', justifyContent: 'flex-end'  }}>


       {accounts.length > 0 && <SelectAccount />}
     
          
        </Toolbar>
      </AppBar>
    </Box>
  );
}