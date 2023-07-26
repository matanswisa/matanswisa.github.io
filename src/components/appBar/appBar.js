import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SelectAccount from '../../components/accounts/selectAccount'
export default function ButtonAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
       <AppBar position="static" sx={{ backgroundColor: '#ffffff', boxShadow: 'none',  }}>
       <Toolbar sx={{ display: 'flex', justifyContent: 'flex-end'  }}>
         
        <SelectAccount/>
          
        </Toolbar>
      </AppBar>
    </Box>
  );
}