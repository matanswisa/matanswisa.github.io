import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import api from '../../api/api';
import ListItemIcon from '@mui/material/ListItemIcon';
import { useEffect, useState } from 'react';
import { selectUser } from '../../redux-toolkit/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getAccounts, setCurrentAccount } from '../../redux-toolkit/userSlice';


export default function MultipleSelectPlaceholder(props) {
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedAccountColor, setSelectedAccountColor] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const token = localStorage.getItem('token');


  const accounts = user.accounts;


  useEffect(() => {
    if (accounts) {
      setSelectedAccount(getSelectedAccountName(accounts))
      setSelectedAccountColor(getSelectedAccountLabel(accounts))
      dispatch(setCurrentAccount(getSelectedAccountObject(accounts)));
    }
  }, [accounts])


  // const fetchAccounts = async () => {
  //   try {
  //     // const response = await api.post('/api/accounts', { userId: user._id }, {
  //     //   headers: {
  //     //     Authorization: `Bearer ${token}`,
  //     //   }
  //     // });

  //     const initialSelectedAccount = getSelectedAccountName(response.data);
  //     setAccounts(response.data);
  //     setSelectedAccount(initialSelectedAccount);

  //     const initialSelectedAccountColor = getSelectedAccountLabel(response.data);
  //     setSelectedAccountColor(initialSelectedAccountColor);

  //     dispatch(setUserAccounts(response.data));
  //     console.log(initialSelectedAccount);
  //     dispatch(setCurrentAccount(getSelectedAccountObject(response.data)));
  //   } catch (error) {
  //     console.error(error);
  //   }


  const getSelectedAccountLabel = (accountList) => {
    const selectedAccount = accountList.find(account => account.IsSelected === 'true');

    return selectedAccount ? selectedAccount.Label : '';
  };
  const getSelectedAccountName = (accountList) => {
    const selectedAccount = accountList.find(account => account.IsSelected === 'true');
    return selectedAccount ? selectedAccount.AccountName : '';
  };

  const getSelectedAccountObject = (accountList) => {
    return accountList.find(account => account.IsSelected === 'true');
  }


  const handleChange = (event) => {
    console.log(event.target.value);
    setSelectedAccount(event.target.value);
    setSelectedAccountColor(getAccountColor(event.target.value));
    updateSelectedAccount(event.target.value);
  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const updateSelectedAccount = async (accountName) => {

    const data = {
      AccountName: accountName,
    };

    try {
      await api.post('/api/updateIsSelectedAccount', data);
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const getAccountColor = (accountName) => {
    const account = accounts.find(
      (account) => account.AccountName === accountName
    );
    return account ? account.Label : '';
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
          value={selectedAccount}
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
              value={account.AccountName}
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