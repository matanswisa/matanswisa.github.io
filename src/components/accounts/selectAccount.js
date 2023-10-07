import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import api from '../../api/api';
import ListItemIcon from '@mui/material/ListItemIcon';
import { useEffect, useState } from 'react';
import { selectCurrentAccount, selectUser, selectUserAccounts , selectAlerts, setAlerts,selectCurrentAccountTrades} from '../../redux-toolkit/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentAccount } from '../../redux-toolkit/userSlice';
import { selectlanguage } from '../../redux-toolkit/languagesSlice';
import { toggleLoading } from '../../redux-toolkit/loadingSlice'
import { ALERTS_TYPE, AlertsMessages } from '../../constants/alertsMessages';


//--------------------------------------------This component show Selected Account options on top left-------------------------------------------//
export default function MultipleSelectPlaceholder(props) {


  //------------------------------------------------  States ----------------------------------------------------- //
  const [selectedAccountName, setSelectedAccountName] = useState(''); //refers to account name*
  const [selectedAccountColor, setSelectedAccountColor] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const accounts = useSelector(selectUserAccounts);
  const user = useSelector(selectUser);
  const currentAccount = useSelector(selectCurrentAccount);
  console.log(currentAccount);
  const isHebrew = useSelector(selectlanguage);
  const [selectedAccount, setSelectedAccount] = useState(currentAccount);
  // const accounts = useSelector(selectUserAccounts);
  const alerts = useSelector(selectAlerts);
  
  let trades;
  if(currentAccount?.trades) {
    // Inside this block, assign the value using useSelector
    trades = currentAccount?.trades;
  }
  

  
  

  const changeLoading = () => {
    dispatch(toggleLoading());
  }


  const fetchSelectedAccount = () => {
    api.post('/api/getSelectedAccount', { userId: user._id }, { headers: { Authorization: `Berear ${user.accessToken}` } }).then((res) => {
      const isAccountInList = accounts.find(acnt => acnt._id == res.data._id);
      const account = accounts[accounts.length - 1];
      if (!isAccountInList) {
        dispatch(setCurrentAccount(account));
        setSelectedAccountColor(account.Label);
        setSelectedAccountName(account.AccountName);
      } else {
        // dispatch(setCurrentAccount(res.data));
        setSelectedAccount(res.data);
        setSelectedAccountColor(res.data.Label);
        setSelectedAccountName(res.data.AccountName);
      }
    }).catch((err) => {
      console.log(err);
      // alert(err);
    });
  }

  //Responsible to intialize current account for user.

  useEffect(() => {
    fetchSelectedAccount();
  }, [])

  useEffect(() => {
    if (selectedAccount != null) {
      dispatch(setCurrentAccount(selectedAccount));
    }
  }, [selectedAccount])

  

  
  const checkOverTradingAlert =  (alerts) => {

    const tradesOfToday = filterObjectsByCurrentDate(trades);
    console.log(tradesOfToday);

    if (alerts[ALERTS_TYPE.OVER_TRADING_ALERT].condition <= tradesOfToday.length) {
      console.log("Trigger over trading");
       turnOnAlert(ALERTS_TYPE.OVER_TRADING_ALERT);
    }
  }

  const checkLossesInRow =  (alerts) => {

    const tradesOfToday = filterObjectsByCurrentDate(trades);
    
    const tradesWithLosses  = filterTradesWithLosses(trades);
   
    
    if (alerts[ALERTS_TYPE.LOSSING_TRADE_IN_ROW].condition <=tradesWithLosses) {
      console.log("Trigger losses in a row");
       turnOnAlert(ALERTS_TYPE.LOSSING_TRADE_IN_ROW);
    }
  }

  
  const filterTradesWithLosses = (trades) =>{
    const lossTrades = trades.filter((trade) => trade.status === 'Loss');
  
    return lossTrades.length;
  }


  

  const turnOnAlert = async (index) => {
    const data = {
      userId: user._id,
      indexofAlert: index,
    };

    try {
      const response = await api.put('/api/auth/TurnAlertOn', data, {
        headers: { Authorization: "Bearer " + user.accessToken }
      });

      if (response.status === 200) {
        dispatch(setAlerts(response.data));
        // You can also do other actions here if needed
      } else {
        // Handle other status codes, e.g., 400, 500, etc.
        console.log("Request failed with status code:", response.status);
      }
    } catch (err) {
      // Handle any exceptions that occurred during the request
      console.error(err);
      // Handle the error as needed
    }
  };



  // Assuming entryDate and currentDate are Date objects
  function areDatesEqual(entryDate, currentDate) {
    const entryYear = entryDate.getFullYear();
    const entryMonth = entryDate.getMonth();
    const entryDay = entryDate.getDate();

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();

    return entryYear === currentYear && entryMonth === currentMonth && entryDay === currentDay;
  }


  function filterObjectsByCurrentDate(trades) {
   
    const currentDate = new Date(); // Get the current date and time

    const tradesOfToday = trades.filter((trade) => {
      // Split the entryDate string by 'T' to get the date component
      const entryDateParts = trade.entryDate.split('T');

      // Parse the date portion into a Date object
      const entryDate = new Date(entryDateParts[0]);

      // Compare the entryDate with currentDate to check if it's from today or later
      return areDatesEqual(entryDate, currentDate);
    });

    return tradesOfToday;
  }


  //------------------------------------------------ handle update the new account choosen -----------------------------------------------------//
  const handleChange = (event) => {
    const accountId = event.target.value
    api.post('/api/setSelectedAccount', { userId: user._id, accountId }, { headers: { Authorization: `Berear ${user.accessToken}` } }).then((res) => {

      setSelectedAccountName(res.data.AccountName)
      setSelectedAccountColor(res.data.Label);
      dispatch(setCurrentAccount(res.data));

       checkOverTradingAlert(alerts);
       checkLossesInRow(alerts);
      changeLoading();
    }).catch((err) => {
      console.error(err);
      // alert('Error: ' + err);
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
        <InputLabel id="demo-simple-select-label"> {isHebrew === false ? "Account" : "חשבון"}</InputLabel>
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
              disabled={selectedAccountName === account.AccountName} // Disable the selected account
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