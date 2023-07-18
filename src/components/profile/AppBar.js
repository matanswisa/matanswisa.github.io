import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Menu, MenuItem } from '@mui/material';
import { AccountCircle, ExitToApp, Settings } from '@mui/icons-material';
import BasicModal from '../accounts/AccountsPage';
import ChildModal from  '../accounts/createAccount'

const AppNavbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    // Implement your sign out logic here
    console.log('Sign out clicked');
    handleMenuClose();
  };

  const handleSettings = () => {
    // Implement your settings logic here
    console.log('Settings clicked');
    handleMenuClose();
  };

  const [openmodal, setIsOpenmodal] = useState(false);
  
  const handleOpenModal = (tradeId) => {
    setIsOpenmodal(true);
  };



  return (
       
    <div  style={{ width: '8%'  , borderRadius: '8px'}}> {/* Set a smaller width value */}
      <AppBar  position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            aria-haspopup="true"
            onClick={handleMenuOpen}
            size="small"
            sx={{ mr: 1 }}
          >
            <AccountCircle fontSize="large" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleSignOut}>
              <ExitToApp sx={{ mr: 1 }} fontSize="small" />
              Sign Out
            </MenuItem>
            <MenuItem onClick={handleOpenModal}>
              <Settings sx={{ mr: 1 }} fontSize="small" />
              Settings
            </MenuItem>
            {openmodal && <BasicModal openModal={openmodal} handleOpenModal={setIsOpenmodal} />}
       
          </Menu>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default AppNavbar;
