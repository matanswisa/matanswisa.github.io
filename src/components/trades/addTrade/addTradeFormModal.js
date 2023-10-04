



import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import { useEffect, useState, useReducer } from 'react';
import { tickerArrays } from '../tickers/Tickers';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
// @mui
import {
  Paper,
  Button,
  IconButton,
  TextField,
  Input,
  Stack
} from '@mui/material';
import api from '../../../api/api';
import Iconify from '../../iconify/Iconify';
import './addTrade.css';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentAccount, selectUser, setTradesList, setCurrentAccount, selectCurrentAccountTrades, selectAlerts } from '../../../redux-toolkit/userSlice';
import InputAdornment from '@mui/material/InputAdornment';


import Alert from '@mui/material/Alert';

import { brokers } from '../../brokersNames/brokers.js'



import { selectMessages } from '../../../redux-toolkit/messagesSlice';

import { getMsg } from '../../../utils/messeageUtils';
import { msgType } from '../../../utils/messagesEnum.js';
import { msgNumber } from '../../../utils/msgNumbers.js';
import { handleUploadTradeImage } from '../../../utils/uploadImage';
import { selectDarkMode } from '../../../redux-toolkit/darkModeSlice';
import { selectlanguage, selectidx } from '../../../redux-toolkit/languagesSlice';
import LogoImage from '../../../components/logo/logoImage'
import EditNoteIcon from '@mui/icons-material/EditNoteOutlined';
import { selectTradeToEdit } from '../../../redux-toolkit/editTradeFormSlice';
import { filterObjectsByCurrentDate } from '../../../utils/date';
import { ALERTS_TYPE, AlertsMessages } from '../../../constants/alertsMessages';
// import EditNoteIcon from '@mui/icons-material/EditNote';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  height: 735,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 34,
  p: 4,
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


//--------------------------------------------This component show Addtrade Modal -------------------------------------------//
export default function TradeFormModal(props) {


  //------------------------------------------------  States ----------------------------------------------------- //
  const [errorMessage, setErrorMessage] = useState(null);
  const languageidx = useSelector(selectidx);
  const isHebrew = useSelector(selectlanguage);
  const darkMode = useSelector(selectDarkMode);
  const messages = useSelector(selectMessages);
  const [value, setValue] = React.useState(0);
  const user = useSelector(selectUser);
  const currentAccount = useSelector(selectCurrentAccount);
  const handleOpen = () => props.handleOpenModal(true);
  const handleClose = () => props.handleOpenModal(false);
  const { notifyToast } = props;
  const tradeInfo = props?.tradeInfo;
  const editMode = props?.isEditMode;
  const prevStatusState = props?.prevState;
  const reduxDispatch = useDispatch();
  const fileInputRef = React.useRef(null);
  const trades = useSelector(selectCurrentAccountTrades);
  const alerts = useSelector(selectAlerts);


  //selector
  const editedTrade = useSelector(selectTradeToEdit);

  const checkOverTradingAlert = async (alerts, trades) => {
    console.log("Over tading it is?");
    const tradesOfToday = filterObjectsByCurrentDate(trades);
    console.log(tradesOfToday);
    if (alerts[ALERTS_TYPE.OVER_TRADING_ALERT].condition < tradesOfToday.length) {
      console.log("Trigger over trading");
      await handleToggleAlert(ALERTS_TYPE.OVER_TRADING_ALERT);
    }
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const activeTickers = tickerArrays[value];


  const labelStyle = {
    minWidth: 0, // Adjust as needed
    fontSize: '14px', // Adjust font size as needed
    padding: '6px 12px', // Adjust padding as needed
  };


  const initialState = {
    positionType: tradeInfo?.longShort || '',
    positionStatus: tradeInfo?.status || '',
    positionCommision: tradeInfo?.commission || '',
    positionDuration: tradeInfo?.duration || '',
    entryPrice: tradeInfo?.entryPrice || 0,
    exitPrice: tradeInfo?.exitPrice || 0,
    contractsCounts: tradeInfo?.contracts || 0,
    netPnL: tradeInfo?.netPnL || 0,
    riskReward: 0,
    netROI: tradeInfo?.netROI || 0,
    positionDate: tradeInfo?.entryDate.split('T')[0] || '',
    stopPrice: tradeInfo?.stopPrice || 0,
    positionSymbol: tradeInfo?.symbol || '',
    comments: tradeInfo?.comments || '',

  };


  const formReducer = (state, action) => {
    switch (action.type) {
      case 'UPDATE_FIELD':
        return {
          ...state,
          [action.field]: action.value,
        };
      case 'DELETE_FIELD': return {
        ...state,
        [action.field]: ''
      }
      case 'RESET_FORM':
        return initialState;
      default:
        return state;
    }
  };




  const handleToggleAlert = async (index) => {
    const data = {
      userId: user._id,
      indexofAlert: index,
    };

    try {
      const response = await api.put('/api/auth/toggleAlert', data, {
        headers: { Authorization: "Bearer " + user.accessToken }
      });

      if (response.status === 200) {
        console.log("ok");
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


  function calculateRiskReward(EntryPrice, TakeProfit, StopLoss, Type) {

    if (EntryPrice === StopLoss) {
      return "0";
    }

    if (Type === "Short") {

      if (parseFloat(TakeProfit) >= parseFloat(EntryPrice) || parseFloat(StopLoss) <= parseFloat(EntryPrice)) {
        return "0";
      }
    }

    if (Type === "Long") {
      if (parseFloat(TakeProfit) <= parseFloat(EntryPrice) || parseFloat(StopLoss) >= parseFloat(EntryPrice)) {
        return "0";
      }
    }

    let defaultRR = '1/';
    // Calculate the risk (the difference between Entry Price and Stop Loss)
    const risk = EntryPrice - StopLoss;

    // Calculate the reward (the difference between Take Profit and Entry Price)
    const reward = TakeProfit - EntryPrice;

    // Calculate the risk-reward ratio (RRR)
    const riskRewardRatio = reward / risk;

    // Format the riskRewardRatio to a string with one decimal place
    const formattedRRR = riskRewardRatio.toFixed(1);
    // Remove the decimal and trailing zero if it's an integer
    const resultRR = formattedRRR.endsWith('.0') ? formattedRRR.slice(0, -2) : formattedRRR;

    // Append the formattedRRR to defaultRR from the right side
    const finalRR = defaultRR + resultRR + 'RR';

    return finalRR;
  }


  function calculateNetPNLBinance(Type, Qty, EntryPrice, TakeProfit, StopLoss, WinOrLoss) {

    if (Type === "Short") {

      if (WinOrLoss == "Win") {

        if (parseFloat(TakeProfit) >= parseFloat(EntryPrice)) { /// not valid option. tp must be below from entry when is short 
          // notifyToast(getMsg(messages, msgType.warnings, msgNumber[35], languageidx).msgText, getMsg(messages, msgType.warnings, msgNumber[35], languageidx).msgType);

          // setErrorMessage("Take profit must be below Entry Price");
          return "";
        }
        else {
          const winAmount = Qty * (EntryPrice - TakeProfit);
          return winAmount;

        }

      }
      else if (WinOrLoss == "Loss") {

        if (parseFloat(StopLoss) <= parseFloat(EntryPrice) || parseFloat(EntryPrice) === 0 || parseFloat(StopLoss) === 0) { /// not valid option. 
          // notifyToast(getMsg(messages, msgType.warnings, msgNumber[37], languageidx).msgText, getMsg(messages, msgType.warnings, msgNumber[37], languageidx).msgType);

          return "";
        }
        else {
          const lossAmount = Qty * (EntryPrice - StopLoss);
          return lossAmount;
        }
      }
    }

    else if (Type === "Long") {
      if (WinOrLoss == "Win") {
        if (parseFloat(TakeProfit) <= parseFloat(EntryPrice) || parseFloat(EntryPrice) === 0 || parseFloat(TakeProfit) === 0) { /// not valid option. 
          // notifyToast(getMsg(messages, msgType.warnings, msgNumber[34], languageidx).msgText, getMsg(messages, msgType.warnings, msgNumber[34], languageidx).msgType);

          return "";
        }
        else {
          const winAmount = Qty * (TakeProfit - EntryPrice);
          return winAmount;
        }
      }

      else if (WinOrLoss == "Loss") {
        if (parseFloat(StopLoss) >= parseFloat(EntryPrice) || parseFloat(EntryPrice) === 0 || parseFloat(StopLoss) === 0) { /// not valid option. 
          // notifyToast(getMsg(messages, msgType.warnings, msgNumber[36], languageidx).msgText, getMsg(messages, msgType.warnings, msgNumber[36], languageidx).msgType);
          return "";
        }
        else {

          const lossAmount = Qty * (StopLoss - EntryPrice);
          return lossAmount;
        }
      }
    }

  }

  const [formState, dispatch] = useReducer(formReducer, initialState);
  const { comments, positionDuration, positionType, positionStatus, positionCommision, entryPrice, exitPrice, contractsCounts, netROI, positionDate, stopPrice, positionSymbol } = formState;


  useEffect(() => {
    if (currentAccount?.Broker === brokers.Binance) {
      if (positionType === "Short") {

        setNetPnL(calculateNetPNLBinance("Short", contractsCounts, entryPrice, exitPrice, stopPrice, positionStatus));



      } else if (positionType === "Long") {
        setNetPnL(calculateNetPNLBinance("Long", contractsCounts, entryPrice, exitPrice, stopPrice, positionStatus));


      }
    }

    else if (currentAccount?.Broker === brokers.Tradovate) { //// not work yet.
      if (positionType === "Short") {
        setNetPnL(2220);

      } else if (positionType === "Long") {
        // You might want to set a default value when positionType is not "Short"
        setNetPnL(2220);

      }
    }
  }, [positionType, contractsCounts, entryPrice, exitPrice, stopPrice, positionStatus]); // Listen for changes in positionType


  useEffect(() => {
    if (exitPrice && entryPrice && stopPrice && positionType) {
      setRiskReward(calculateRiskReward(entryPrice, exitPrice, stopPrice, positionType));
    }
  }, [exitPrice, entryPrice, stopPrice, positionType]);


  // Inside your modal component, use state for netPnL
  const [netPnL, setNetPnL] = useState(0);
  const [riskReward, setRiskReward] = useState('0');

  const handlePositionFieldInput = (event, field) => {
    if (field === 'positionSymbol' && event !== null) {
      dispatch({ type: 'UPDATE_FIELD', field: `${field}`, value: event.year });
    } else if (event !== null) {

      dispatch({ type: 'UPDATE_FIELD', field: `${field}`, value: event.target.value });
    }
  };

  //------------------------------------------------ handle check broker before save  new trade -----------------------------------------------------//

  // before add new trade this condition check which broker in selected account to Adjust the fields structs that come from the data 
  const handleSaveTrade = async () => {
    let data = {};

    // if (currentAccount?.Broker === brokers.Tradovate) {

    data = {
      entryDate: positionDate,
      symbol: positionSymbol,
      status: positionStatus,
      netROI,
      stopPrice,
      longShort: positionType,
      contracts: contractsCounts,
      entryPrice: entryPrice,
      exitPrice: exitPrice,
      duration: positionDuration,
      commission: positionCommision > 0 ? positionCommision * -1 : positionCommision,
      comments,
      netPnL: positionStatus == "Loss" ? netPnL * -1 : netPnL,
      riskReward: riskReward,
    }

    //-------------------------------------------------------------- handle new trade adding -------------------------------------------------------------//
    if (validateForm()) {

      if (!editMode) {
        await api
          .post('/api/addTrade', { userId: user._id, accountId: currentAccount._id, tradeData: data }, { headers: { Authorization: "Berear " + user.accessToken } }).then(async (res) => {
            if (selectedFile !== null) {
              handleUpload(res.data.tradeId);
            }
            reduxDispatch(setCurrentAccount(res.data.account));  //update balance
            reduxDispatch(setTradesList(res.data.tradesWithImage));

            await checkOverTradingAlert(alerts, trades);
            notifyToast(getMsg(messages, msgType.success, msgNumber[4], languageidx).msgText, getMsg(messages, msgType.success, msgNumber[4], languageidx).msgType);
            //  notifyToast("Trade added successfully", "success");
            handleClose();

          }).catch((err) => {
            console.error(err);
            notifyToast(getMsg(messages, msgType.errors, msgNumber[4], languageidx).msgText, getMsg(messages, msgType.errors, msgNumber[4], languageidx).msgType);
            //  notifyToast("Couldn't add trade", "error");
            handleClose();
          })
      }

      //------------------------------------------------------- handle edit trade ----------------------------------------------------------------------------//
      else if (editMode === true) {
        if (validateForm()) {
          data.netPnL = data.status !== prevStatusState ? data.netPnL * -1 : data.netPnL;
          // console.log(trade
          await api.post('/api/editTrade', { tradeId: editedTrade._id, userId: user._id, accountId: currentAccount._id, tradeData: data }, { headers: { Authorization: 'Bearer ' + user.accessToken } })
            .then((res) => {
              notifyToast(getMsg(messages, msgType.success, msgNumber[5], languageidx).msgText, getMsg(messages, msgType.success, msgNumber[5], languageidx).msgType);
              //      notifyToast("Trade Edit succssfully", "success")
              handleUploadTradeImage(editedTrade?._id, user._id, currentAccount._id, selectedFile).then(response => response.json())
                .then(data => {
                  notifyToast(getMsg(messages, msgType.success, msgNumber[6], languageidx).msgText, getMsg(messages, msgType.success, msgNumber[6], languageidx).msgType);
                  // notifyToast("Trade image uploaded successfully", "success");

                  dispatch(setTradesList(data));
                })
                .catch(error => {
                  // notifyToast(getMsg(messages, msgType.errors, msgNumber[10]).msgText, getMsg(messages, msgType.errors, msgNumber[10]).msgType);
                  // Handle any errors that occurred during the upload
                  // notifyToast("Error uploading trade image", "error");
                  console.error(error);
                });

              reduxDispatch(setCurrentAccount(res.data.account));  //update balance
              reduxDispatch(setTradesList(res.data.tradesWithImage));
              handleClose();
            });
        }

      }
    }
  };


  //------------------------------------------------ handle validation before add new trade -----------------------------------------------------//
  const validateForm = () => {

    const currentDate = new Date().toISOString().slice(0, 10); // Get today's date in the format "YYYY-MM-DD"

    if (positionDate > currentDate) {

      notifyToast(getMsg(messages, msgType.warnings, msgNumber[28], languageidx).msgText, getMsg(messages, msgType.warnings, msgNumber[28], languageidx).msgType);
      // notifyToast(errorMessage, "warning");
      return false;
    }



    if (positionType === "Short") {

      if (positionStatus === "Win") {
        if (exitPrice >= entryPrice) {
          notifyToast(getMsg(messages, msgType.warnings, msgNumber[35], languageidx).msgText, getMsg(messages, msgType.warnings, msgNumber[35], languageidx).msgType);
          return false;
        }
      }

      else if (positionStatus === "Loss") {
        if (stopPrice <= entryPrice) {
          notifyToast(getMsg(messages, msgType.warnings, msgNumber[37], languageidx).msgText, getMsg(messages, msgType.warnings, msgNumber[37], languageidx).msgType);
          return false;
        }
      }
    }

    if (positionType === "Long") {

      if (positionStatus === "Win") {
        if (exitPrice <= entryPrice) {
          notifyToast(getMsg(messages, msgType.warnings, msgNumber[34], languageidx).msgText, getMsg(messages, msgType.warnings, msgNumber[34], languageidx).msgType);
          return false;
        }
      }
      else if (positionStatus === "Loss") {
        if (stopPrice >= entryPrice) {
          notifyToast(getMsg(messages, msgType.warnings, msgNumber[36], languageidx).msgText, getMsg(messages, msgType.warnings, msgNumber[36], languageidx).msgType);
          return false;
        }
      }

    }



    if (positionType === '' || positionStatus === '' || entryPrice < 1 || exitPrice < 1 || stopPrice < 1 ||
      contractsCounts < 1 || Number.isNaN(netPnL) || positionSymbol === "" || selectedFile === "" || !positionDate) {

      if (positionType === '') {
        notifyToast(getMsg(messages, msgType.warnings, msgNumber[27], languageidx).msgText, getMsg(messages, msgType.warnings, msgNumber[27], languageidx).msgType);
        //  notifyToast("Position type is missing", "warning");
        return false;
      }

      else if (contractsCounts < 1) {
        if (currentAccount?.Broker === brokers.Tradovate) {
          notifyToast(getMsg(messages, msgType.warnings, msgNumber[38], languageidx).msgText, getMsg(messages, msgType.warnings, msgNumber[38], languageidx).msgType);

          // notifyToast("Number of contracts must be above Zero.","warning");

        }
        else {
          notifyToast(getMsg(messages, msgType.warnings, msgNumber[39], languageidx).msgText, getMsg(messages, msgType.warnings, msgNumber[39], languageidx).msgType);

          //  notifyToast("Quantity must be above Zero.","warning");
        }
        return false;
      }

      else if (!positionStatus) {
        notifyToast(getMsg(messages, msgType.warnings, msgNumber[26], languageidx).msgText, getMsg(messages, msgType.warnings, msgNumber[26], languageidx).msgType);
        //notifyToast("Position status is missing", "warning");
        return false;
      }
      else if (!contractsCounts) {
        notifyToast(getMsg(messages, msgType.warnings, msgNumber[24], languageidx).msgText, getMsg(messages, msgType.warnings, msgNumber[24], languageidx).msgType);
        //  notifyToast("Number of contracts field is missing", "warning");
        return false;
      }
      else if (positionSymbol === "") {
        notifyToast(getMsg(messages, msgType.warnings, msgNumber[23], languageidx).msgText, getMsg(messages, msgType.warnings, msgNumber[23], languageidx).msgType);
        //  notifyToast("Position symbol is missing", "warning");
        return false;
      }
      else if (!positionDate) {
        notifyToast(getMsg(messages, msgType.warnings, msgNumber[22], languageidx).msgText, getMsg(messages, msgType.warnings, msgNumber[22], languageidx).msgType);
        // notifyToast("Date field is missing", "warning");
        return false;
      }
      else if (entryPrice < 1) {
        notifyToast(getMsg(messages, msgType.warnings, msgNumber[21], languageidx).msgText, getMsg(messages, msgType.warnings, msgNumber[21], languageidx).msgType);
        // notifyToast(" entry Price is missing", "warning");
        return false;
      }
      else if (exitPrice < 1) {
        notifyToast(getMsg(messages, msgType.warnings, msgNumber[20], languageidx).msgText, getMsg(messages, msgType.warnings, msgNumber[20], languageidx).msgType);
        //notifyToast("exit Price  is missing", "warning");
        return false;
      }

      else if (stopPrice < 1) {
        notifyToast(getMsg(messages, msgType.warnings, msgNumber[40], languageidx).msgText, getMsg(messages, msgType.warnings, msgNumber[40], languageidx).msgType);
        //notifyToast("exit Price  is missing", "warning");
        return false;
      }

    }
    return true;
  };


  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  }

  const handleUpload = (tradeId) => {
    console.log(editMode);
    if (!selectedFile && editMode == false) {
      notifyToast(getMsg(messages, msgType.errors, msgNumber[5], languageidx).msgText, getMsg(messages, msgType.errors, msgNumber[5], languageidx).msgType);
      // notifyToast("Don't have image file to upload", "error"); 
      return;

    }
    // Create a new FormData object
    const formData = new FormData();
    // Append the selected file to the FormData object
    formData.append('file', selectedFile);
    formData.append('tradeId', tradeId);
    console.log(formData);
    // Make a POST request to the server with the file data
    fetch('http://localhost:8000/api/uploadTradeImage', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        // Handle the response from the server

        //TODO: need to add here the function - dispatch(setTradeList(data))
      })
      .catch(error => {
        // Handle any errors that occurred during the upload
        console.error(error);
      });
  };



  const handleButtonClick = () => {
    fileInputRef.current.click();
  };


  useEffect(() => {
    if (selectedFile) {
      notifyToast(getMsg(messages, msgType.success, msgNumber[6], languageidx).msgText, getMsg(messages, msgType.success, msgNumber[6], languageidx).msgType);
      //   notifyToast("Image successfully uploaded", "success");
    }
  }, [selectedFile])


  return (
    // currentAccount?.Broker === brokers.Tradovate ?
    <>
      {errorMessage && <Alert severity="warning">{errorMessage}</Alert>}

      <Modal
        open={props.openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >


        <Box sx={style} >


          <Stack direction="row" spacing={2} sx={{ marginBottom: '60px' }}>

            <Box >

              <Typography style={{ fontFamily: 'sans-serif', fontWeight: 'bolder', fontSize: '20px' }}> {isHebrew === false ? "New Trade" : "הוספת טרייד"}</Typography>
            </Box>
            {/* <LogoImage w = '350px' h= '280px'/> */}
            <Box style={{ marginLeft: "678px" }}>

              <label htmlFor="file-input">
                <input ref={fileInputRef} name="file" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                <Button style={{ backgroundColor: darkMode ? '#1ba6dc' : "", color: darkMode ? 'white' : "", }}
                  size="small"
                  variant="outlined"
                  component="span"
                  startIcon={<Iconify icon={'eva:file-add-outline'} />}
                  onClick={handleButtonClick}
                >
                  {isHebrew === false ?
                    "Upload Image" :
                    "העלאת תמונה"}
                </Button>
              </label>

            </Box>
          </Stack>

          <Stack direction="row" spacing={2} >
            <Box sx={{ width: "300px", marginBottom: '20px' }}>

              <Stack spacing={2} >
                <Box sx={{ marginBottom: '5px' }} >
                  <TextField required="true"
                    sx={{ width: "280px" }}
                    value={positionDate}
                    onChange={(e) => handlePositionFieldInput(e, 'positionDate')}
                    label="Open Date" variant="standard" type="date" />
                </Box >

                <Box>

                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    required="true"
                    options={activeTickers}
                    value={positionSymbol}
                    onChange={(e, newValue) => { handlePositionFieldInput(newValue, 'positionSymbol') }}
                    sx={{ width: "280px", marginBottom: '13px' }}
                    renderInput={(params) => <TextField {...params} label={isHebrew === false ? "Symbol" : "סימן"} value={positionSymbol} variant="standard" />}

                  />

                </Box>
                <Box>
                  <FormControl variant="standard" >
                    <InputLabel id="demo-simple-select-standard-label"> {isHebrew === false ? "Status" : "סטטוס"}</InputLabel>
                    <Select
                      sx={{ width: "280px", marginBottom: '13px' }}
                      disablePortal
                      id="combo-box-demo"
                      value={positionStatus}
                      onChange={(e) => handlePositionFieldInput(e, 'positionStatus')}
                      label="Status"
                      required="true"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={'Win'}>Win</MenuItem>
                      <MenuItem value={'Loss'}>Loss</MenuItem>
                      <MenuItem value={'BreakEven'}>Break Even</MenuItem>
                    </Select>
                  </FormControl>
                </Box>


                <Box sx={{ marginBottom: '13px' }}>

                  <FormControl variant="standard" >
                    <InputLabel id="demo-simple-select-standard-label"> {isHebrew === false ? "Type" : "סוג"}</InputLabel>
                    <Select
                      sx={{ width: "280px" }}
                      className="outlined-number"
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={positionType}
                      onChange={(e) => handlePositionFieldInput(e, 'positionType')}
                      label="Type"
                      required="true"
                      InputLabelProps={{ shrink: true }}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={'Short'}>Short</MenuItem>
                      <MenuItem value={'Long'}>Long</MenuItem>

                    </Select>
                  </FormControl>
                </Box>
              </Stack >
            </Box >
            <Box sx={{ width: "300px" }}>
              <Stack spacing={2} >
                <Box style={{ backgroundColor: darkMode ? '#121212' : "", color: darkMode ? 'white' : "", }}>
                  {' '}
                  <TextField
                    sx={{ width: "280px" }}
                    className="outlined-number"
                    label={isHebrew === false ? "Entry Price" : "שער כניסה"}
                    required="true"
                    value={entryPrice}
                    type="number"
                    onChange={(e) => handlePositionFieldInput(e, 'entryPrice')}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify icon={'eva:corner-up-right-outline'} />
                        </InputAdornment>
                      ),
                    }}

                  />
                </Box>
                <Box >
                  <TextField
                    className="outlined-number"
                    sx={{ width: "280px" }}
                    required="true"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify icon={'eva:layers-outline'} />
                        </InputAdornment>
                      ),
                    }}
                    label={currentAccount?.Broker === brokers.Tradovate ? (isHebrew === false ? "Contracts" : "חוזים") : (isHebrew === false ? "Quantity" : "כמות")}

                    value={contractsCounts}
                    onChange={(e) => handlePositionFieldInput(e, 'contractsCounts')}

                    type="number"
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>
                <Box >
                  <TextField
                    sx={{ width: "280px" }}
                    className="outlined-number"
                    label={isHebrew === false ? "Stop loss" : "עצירת הפסד"}
                    type="number"
                    value={stopPrice}
                    required="true"
                    onChange={(e) => handlePositionFieldInput(e, 'stopPrice')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify icon={'eva:close-square-outline'} />
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>
                <Box sx={{ marginBottom: '30px' }}>
                  <TextField
                    className="outlined-number"

                    sx={{ width: "280px" }}
                    label={isHebrew === false ? "Take Profit" : "לקיחת רווחים"}
                    value={exitPrice}
                    onChange={(e) => handlePositionFieldInput(e, 'exitPrice')}
                    required="true"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {positionType === "Long" ?
                            <Iconify icon={'eva:trending-up-outline'} /> :
                            <Iconify icon={'eva:trending-down-outline'} />}
                        </InputAdornment>
                      ),
                    }}
                  />

                </Box>
                <Box sx={{ marginBottom: '30px' }}>
                </Box>
              </Stack>
            </Box>

            <Box sx={{ width: "300px", border: darkMode === true ? '1px solid #121212' : '', }}>
              <Stack spacing={2} >

                <Box >
                  <TextField
                    className="outlined-number"
                    sx={{ width: "280px" }}
                    type="number"
                    value={positionCommision}
                    onChange={(e) => handlePositionFieldInput(e, 'positionCommision')}
                    label={isHebrew === false ? "Commission" : "עמלה"}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          $      -
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                {' '}
                <Box >
                  <TextField
                    className="standard-basic"
                    value={positionDuration}
                    sx={{ width: "280px" }}
                    onChange={(e) => handlePositionFieldInput(e, 'positionDuration')}
                    label={isHebrew === false ? "Trade Duration" : "זמן עסקה"}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify icon={'eva:clock-outline'} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>


                <Box style={{ backgroundColor: darkMode ? '#121212' : "", color: darkMode ? 'white' : "", }}>
                  {' '}
                  <TextField
                    className="outlined-number"
                    required="true"
                    disabled
                    sx={{ width: "280px" }}
                    label={isHebrew === false ? "Net P&L" : "רווח/הפסד נטו"}
                    value={netPnL}
                    onChange={(e) => handlePositionFieldInput(e, 'netPnL')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          $
                        </InputAdornment>
                      ),
                    }}
                    type="number"
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>


                <Box style={{ backgroundColor: darkMode ? '#121212' : "", color: darkMode ? 'white' : "", }}>
                  {' '}
                  <TextField
                    className="outlined-number"
                    disabled
                    sx={{ width: "280px" }}
                    label={isHebrew === false ? "Risk/Reward" : "סיכון/סיכ  וי"}
                    value={riskReward}
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>
              </Stack >
            </Box >

          </Stack >

          <Box style={{ marginBottom: "30px" }} >
            <Typography>Notes<EditNoteIcon fontSize="large" /></Typography>

            <TextField
              id="filled-multiline-static"
              sx={{
                width: '930px', // Change the width as needed
                border: darkMode === true ? '1px solid white' : '', // Add a white border
              }}
              multiline
              rows={7}
              value={comments}
              variant="outlined"
              onChange={(e) => handlePositionFieldInput(e, 'comments')}
            />
          </Box>

          <Box style={{ marginLeft: "780px" }} >
            <Button style={{ backgroundColor: darkMode ? '#1ba6dc' : "", color: darkMode ? 'white' : "", }} variant="contained" onClick={handleSaveTrade} > {isHebrew === false ? "Save" : "שמור"}</Button>

            <Button style={{ backgroundColor: darkMode ? '#1ba6dc' : "", color: darkMode ? 'white' : "", marginLeft: "7px" }} variant="outlined" onClick={handleClose} > {isHebrew === false ? "Cancel" : "ביטול"}</Button>
          </Box>

        </Box >

      </Modal >
    </>
  );

}













