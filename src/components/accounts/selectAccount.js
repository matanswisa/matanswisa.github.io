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
import { useEffect, useState } from 'react';
import { selectUser } from '../../redux-toolkit/userSlice';
import { useSelector } from 'react-redux';



export default function MultipleSelectPlaceholder(props) {
  const [accounts, setAccounts] = useState([]);


  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedAccountColor, setSelectedAccountColor] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const user = useSelector(selectUser);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAccounts();
    setSelectedAccount(getSelectedAccountName(accounts))
    setSelectedAccountColor(getSelectedAccountLabel(accounts))
  }, []);



  const fetchAccounts = async () => {
    try {
      const response = await api.get('/api/accounts', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }, { userId: user._id });
      setAccounts(response.data);


      const initialSelectedAccount = getSelectedAccountName(response.data);
      setSelectedAccount(initialSelectedAccount);

      const initialSelectedAccountColor = getSelectedAccountLabel(response.data);
      setSelectedAccountColor(initialSelectedAccountColor);
    } catch (error) {
      console.error(error);
    }
  };

  const getSelectedAccountLabel = (accountList) => {
    const selectedAccount = accountList.find(account => account.IsSelected === 'true');

    return selectedAccount ? selectedAccount.Label : '';
  };
  const getSelectedAccountName = (accountList) => {
    const selectedAccount = accountList.find(account => account.IsSelected === 'true');
    return selectedAccount ? selectedAccount.AccountName : '';
  };



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