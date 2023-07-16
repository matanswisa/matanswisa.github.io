import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import api from '../../api/api';
import { red, blue } from '@mui/material/colors';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';

export default function MultipleSelectPlaceholder(props) {
  const [selectedAccount, setSelectedAccount] = React.useState('');
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleChange = (event) => {
    setSelectedAccount(event.target.value);
    updateSelectedAccount(event.target.value);
  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const updateSelectedAccount = async (accountName) => {
    console.log(accountName);
    const data = {
      accountName: accountName,
    };

    try {
      await api.post('/api/updateIsSelectedAccount', data);
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const open = Boolean(anchorEl);

  return (
    <Box>
      <FormControl>
    
        <InputLabel id="demo-simple-select-label">Account</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          aria-controls="account-menu"
          aria-haspopup="true"
          onClick={handleOpenMenu}
          onClose={handleCloseMenu}
          value={selectedAccount}
          onChange={handleChange}
          renderValue={(value) => (
            <React.Fragment>
              {value && (
                <React.Fragment>
                  <ListItemIcon>
                    {props.accounts.map((account) =>
                      account.AccountName === value ? (
                        <div
                          key={account._id}
                          style={{
                            color:
                              account.AccountColor === 'red'
                                ? red[500]
                                : account.AccountColor === 'blue'
                                ? blue[500]
                                : '',
                          }}
                        ></div>
                      ) : null
                    )}
                  </ListItemIcon>
                  <span style={{ marginLeft: '10px' }}>{value}</span>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        >
          {props.accounts.map((account) => (
            <MenuItem key={account._id} value={account.AccountName}>
              {account.AccountName}
            </MenuItem>
          ))}
         
        </Select>
      </FormControl>
    </Box>
  );
}
