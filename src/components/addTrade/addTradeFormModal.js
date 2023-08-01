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
import { futuresTickers } from './Tickers';

// @mui
import {
  Paper,
  Button,
  IconButton,
  TextField,
  Input,
} from '@mui/material';
import api from '../../api/api';
import Iconify from '../iconify/Iconify';
import './addTrade.css';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentAccount, selectUser, setTradesList } from '../../redux-toolkit/userSlice';
import { config } from '../../api/apiAuthConfig';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 550,
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



export default function BasicModal(props) {

  const user = useSelector(selectUser);
  const currentAccount = useSelector(selectCurrentAccount);

  const handleOpen = () => props.handleOpenModal(true);
  const handleClose = () => props.handleOpenModal(false);
  const { notifyToast } = props;
  const tradeInfo = props?.tradeInfo;
  const editMode = props?.isEditMode;
  const prevStatusState = props?.prevState;

  const reduxDispatch = useDispatch();

  const initialState = {
    positionType: tradeInfo?.longShort || '',
    positionStatus: tradeInfo?.status || '',
    positionCommision: tradeInfo?.commission || '',
    positionDuration: tradeInfo?.duration || '',
    entryPrice: tradeInfo?.entryPrice || 0,
    exitPrice: tradeInfo?.exitPrice || 0,
    contractsCounts: tradeInfo?.contracts || 0,
    netPnL: tradeInfo?.netPnL || 0,
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


  const [formState, dispatch] = useReducer(formReducer, initialState);
  const { comments, positionDuration, positionType, positionStatus, positionCommision, entryPrice, exitPrice, contractsCounts, netPnL, netROI, positionDate, stopPrice, positionSymbol } = formState;




  const handlePositionFieldInput = (event, field) => {
    if (field === 'positionSymbol' && event !== null) {
      dispatch({ type: 'UPDATE_FIELD', field: `${field}`, value: event.year });
    } else if (event !== null) {
      console.log(`field: ${field}, value: ${event.target.value}`)
      dispatch({ type: 'UPDATE_FIELD', field: `${field}`, value: event.target.value });
    }
  };

  const clearPositionFieldInput = (event, field) => {
    // Currently removed the function that make the inputes field clear
    // dispatch({ type: 'DELETE_FIELD', field: `${field}`, value: event.target.value });
  }



  useEffect(() => {
    handleOpen();

    return () => {
      if (editMode)
        props?.handleEditTradeLeavePanel(null);
    }

  }, []);

  const handleSaveTrade = async () => {
    const data = {
      entryDate: positionDate,
      symbol: positionSymbol,
      status: positionStatus,
      netROI,
      stopPrice,
      longShort: positionType,
      contracts: contractsCounts,
      entryPrice,
      exitPrice,
      duration: positionDuration,
      commission: positionCommision > 0 ? positionCommision * -1 : positionCommision,
      comments,
      netPnL: positionStatus === "Loss" ? netPnL * -1 : netPnL,
      tradeId: tradeInfo?._id || '',
    }

    if (validateForm()) {

      if (validateForm()) {
        if (!editMode) {
          console.log("config", config);
          await api
            .post('/api/addTrade', { userId: user._id, accountId: currentAccount._id, tradeData: data }, config).then((res) => {
              if (selectedFile !== null) {
                handleUpload(res.data.tradeId);
              }
              // props.updateTradeLists()

              reduxDispatch(setTradesList(res.data));
              console.log(res.data);
              notifyToast("Trade added successfully", "success");
              handleClose();

            }).catch((err) => {
              notifyToast("Couldn't add trade", "error");
            })
        }
        else if (editMode === true) {

          const netPnL = prevStatusState !== data.status && data.status === "Win" && data.netPnL < 0
            ? -data.netPnL
            : data.netPnL;

          data.netPnL = netPnL;
          await api.post('/api/editTrade', data)
            .then((response) => {
              notifyToast("Trade Edit succssfully", "success")
              handleUpload(tradeInfo?._id);
              // props.updateTradeLists()

              reduxDispatch(setTradesList(response.data));


            })
            .catch((error) => {
              notifyToast("Trade can't be updated", "error")
            });

        }

      } else {
        console.log('Please fill in all the fields');
      }
    };
  }

  const validateForm = () => {

    const currentDate = new Date().toISOString().slice(0, 10); // Get today's date in the format "YYYY-MM-DD"

    if (positionDate > currentDate) {
      const errorMessage = "the selected date is above today's date.";

      notifyToast(errorMessage, "warning");

      return false;

    }

    if (positionType === '' || positionStatus === '' ||
      contractsCounts <= 0 || Number.isNaN(netPnL) || positionSymbol === "" || selectedFile === "" || !positionDate) {

      if (positionType === '') notifyToast("Position type is missing", "warning");
      else if (positionStatus === '') notifyToast("Position status is missing", "warning");
      else if (!netPnL) notifyToast("Net PnL is missing", "warning");
      else if (!contractsCounts) notifyToast("Number of contracts field is missing", "warning");
      else if (positionSymbol === "") notifyToast("Position symbol is missing", "warning");
      else if (!positionDate) notifyToast("Date field is missing", "warning");

      console.log(positionDate > currentDate);


      return false;
    }
    return true;
  };

  //Upload image related code:
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };


  const handleUpload = (tradeId) => {
    if (!selectedFile) { notifyToast("Don't have image file to upload", "error"); return; }
    // Create a new FormData object
    const formData = new FormData();
    // Append the selected file to the FormData object
    formData.append('file', selectedFile);
    formData.append('tradeId', tradeId);

    // Make a POST request to the server with the file data
    fetch('http://localhost:8000/api/uploadTradeImage', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        // Handle the response from the server

        props.updateTradeLists()
      })
      .catch(error => {
        // Handle any errors that occurred during the upload
        console.error(error);
      });
  };

  const fileInputRef = React.useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {

    if (selectedFile) {
      notifyToast("Image successfully uploaded", "success");
    }
  }, [selectedFile])

  return (
    <Modal
      open={props.openModal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={28}>


            <Grid item xs={6} md={7}>
              <Item>
                {' '}
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Add New Trade
                </Typography>
              </Item>
            </Grid>

            <Grid item xs={6} md={4}>
              <Grid item xs={6} md={4}>
                <label htmlFor="file-input">
                  <input ref={fileInputRef} name="file" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                  <Button
                    size="small"
                    variant="outlined"
                    component="span"
                    startIcon={<Iconify icon={'eva:file-add-outline'} />}
                    onClick={handleButtonClick}
                  >
                    Upload Image
                  </Button>
                </label>

              </Grid>
            </Grid>
          </Grid >
        </Box >

        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
          <Grid item xs={6}>
            <Item>
              <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch' } }} noValidateautoComplete="off">
                <TextField
                  id="outlined-multiline-flexible"
                  label="Comments"
                  value={comments}
                  multiline
                  maxRows={7}
                  onChange={(e) => handlePositionFieldInput(e, 'comments')}
                />
              </Box>{' '}
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item>
              <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch' } }} noValidateautoComplete="off">
                <TextField id="standard-basic" required="true"
                  value={positionDate}
                  onChange={(e) => handlePositionFieldInput(e, 'positionDate')}
                  label="Open Date" variant="standard" type="date" />
              </Box>{' '}
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-standard-label">Type</InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={positionType}
                  onChange={(e) => handlePositionFieldInput(e, 'positionType')}
                  label="Type"
                  required="true"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={'Short'}>Short</MenuItem>
                  <MenuItem value={'Long'}>Long</MenuItem>

                </Select>
              </FormControl>
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item>
              <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch' } }} noValidateautoComplete="off">
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  required="true"
                  options={futuresTickers}
                  value={positionSymbol}
                  onChange={(e, newValue) => { handlePositionFieldInput(newValue, 'positionSymbol') }}
                  sx={{ width: 600 }}
                  renderInput={(params) => <TextField {...params} label="Symbol" value={positionSymbol} variant="standard" />}
                />
              </Box>
            </Item>
          </Grid>
          <Grid item xs={6}>

            <Item>
              {' '}
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-standard-label">Status</InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
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
            </Item>

          </Grid>
        </Grid>

        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
          <Grid item xs={6}>
            <Item>
              {' '}
              <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch' } }} noValidateautoComplete="off">
                <TextField
                  className="standard-basic"
                  value={positionDuration}
                  onFocus={(e) => clearPositionFieldInput(e, 'positionDuration')}
                  onChange={(e) => handlePositionFieldInput(e, 'positionDuration')}
                  label="Duration"
                  variant="standard"
                />
              </Box>
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item>
              {' '}
              <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch' } }} noValidateautoComplete="off">
                <TextField
                  className="outlined-number"

                  type="number"
                  value={positionCommision}
                  onChange={(e) => handlePositionFieldInput(e, 'positionCommision')}
                  onFocus={(e) => clearPositionFieldInput(e, 'positionCommision')}
                  label="Commission"
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            </Item>
          </Grid>

          <Grid item xs={6}>
            <Item>
              {' '}
              <TextField
                className="outlined-number"

                label="Entry Price"
                value={entryPrice}
                type="number"
                onChange={(e) => handlePositionFieldInput(e, 'entryPrice')}
                onFocus={(e) => clearPositionFieldInput(e, 'entryPrice')}
                InputLabelProps={{ shrink: true }}
              />
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item>
              <TextField
                className="outlined-number"

                label="Exit Price"
                value={exitPrice}
                onChange={(e) => handlePositionFieldInput(e, 'exitPrice')}
                onFocus={(e) => clearPositionFieldInput(e, 'exitPrice')}
                type="number"
                InputLabelProps={{ shrink: true }}
              />
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item>
              <TextField
                className="outlined-number"
                required="true"
                label="Contracts"
                value={contractsCounts}
                onChange={(e) => handlePositionFieldInput(e, 'contractsCounts')}
                onFocus={(e) => clearPositionFieldInput(e, 'contractsCounts')}
                type="number"
                InputLabelProps={{ shrink: true }}
              />
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item>
              {' '}
              <TextField
                className="outlined-number"
                required="true"
                label="Net P&L"
                value={netPnL}
                onChange={(e) => handlePositionFieldInput(e, 'netPnL')}
                onFocus={(e) => clearPositionFieldInput(e, 'netPnL')}
                type="number"
                InputLabelProps={{ shrink: true }}
              />
            </Item>
          </Grid>

          <Grid item xs={6}>
            <Item>
              <TextField
                className="outlined-number"
                label="Net ROI"
                type="number"
                value={netROI}
                onChange={(e) => handlePositionFieldInput(e, 'netROI')}
                onFocus={(e) => clearPositionFieldInput(e, 'netROI')}
                InputLabelProps={{ shrink: true }}
              />
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item>
              <TextField
                className="outlined-number"
                label="Stop loss"
                type="number"
                value={stopPrice}
                onChange={(e) => handlePositionFieldInput(e, 'stopPrice')}
                onFocus={(e) => clearPositionFieldInput(e, 'stopPrice')}
                InputLabelProps={{ shrink: true }}
              />
            </Item>
          </Grid>
          <Item>
            <br />
            <Button variant="contained" onClick={handleSaveTrade}>Save</Button>
          </Item >
        </Grid >
      </Box >
    </Modal >
  );
}
