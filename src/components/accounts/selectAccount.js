import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import api from '../../api/api';
export default function MultipleSelectPlaceholder(props) {
  const [selectedAccount, setSelectedAccount] = React.useState('');

  const handleChange = (event) => {
    setSelectedAccount(event.target.value);
    updateSelectedAccount(event.target.value);
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


  return (
    <Box>
      <FormControl fullWidth>
        
        <InputLabel  id="demo-simple-select-label">Account</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedAccount}
          label="Account"
          onChange={handleChange}
          size="small"
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