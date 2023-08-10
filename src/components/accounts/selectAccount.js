import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import api from '../../api/api';
import ListItemIcon from '@mui/material/ListItemIcon';
import { useEffect, useState } from 'react';
import { selectCurrentAccount, selectUser, selectUserAccounts } from '../../redux-toolkit/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getAccounts, setCurrentAccount } from '../../redux-toolkit/userSlice';
import { configAuth } from '../../api/configAuth';


export default function MultipleSelectPlaceholder(props) {


  const [selectedAccountName, setSelectedAccount] = useState(''); //refers to account name*
  const [selectedAccountColor, setSelectedAccountColor] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const dispatch = useDispatch();
  const accounts = useSelector(selectUserAccounts);
  const user = useSelector(selectUser);

  const currentAccount = useSelector(selectCurrentAccount);


  //Responsible to intialize current account for user.
  useEffect(() => {
    const token = localStorage.getItem('token');
    api.post('/api/getSelectedAccount', { userId: user._id }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }).then((res) => {
      dispatch(setCurrentAccount(res.data));
      setSelectedAccountColor(res.data.Label);
      setSelectedAccount(res.data.AccountName);
    }).catch((err) => {
      console.log(err);
      alert(err);
    });
  }, [])


  const handleChange = (event) => {
    const accountId = event.target.value
    api.post('/api/setSelectedAccount', { userId: user._id, accountId }, configAuth).then((res) => {
      console.log(res.data);
      setSelectedAccount(res.data.AccountName)
      setSelectedAccountColor(res.data.Label);
      dispatch(setCurrentAccount(res.data));
    }).catch((err) => {
      console.error(err);
      alert('Error: ' + err);
    });

  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };


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
          value={selectedAccountName}
          onChange={handleChange}
          renderValue={(value) => (
            <React.Fragment>
              {value && (
                <React.Fragment>
                  <ListItemIcon>
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: selectedAccountColor,
                        marginRight: '10px',
                      }}
                    ></div>
                  </ListItemIcon>
                  <span style={{ marginLeft: '10px' }}>{value}</span>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        >
          {accounts.map((account) => (
            <MenuItem
              key={account._id}
              value={account._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: account.Label,
                  marginRight: '10px',
                }}
              ></div>
              {account.AccountName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}