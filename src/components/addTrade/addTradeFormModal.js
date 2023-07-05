import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';

import Grid from '@mui/material/Grid';
import { useEffect, useState, useReducer } from 'react';
// @mui
import {

  Paper,

  Button,

  IconButton,

  TextField,
} from '@mui/material';
import api from '../../api/api';
import Iconify from '../iconify/Iconify';
import { setTrades } from '../../redux-toolkit/tradesSlice';

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


  console.log("props.tradeInfo=", props.tradeInfo);

  const handleOpen = () => props.handleOpenModal(true);
  const handleClose = () => props.handleOpenModal(false);

  const { notifyToast } = props;

  const tradeInfo = props?.tradeInfo;

  const editMode = props?.isEditMode;

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


  console.log("tradeInfo", tradeInfo);


  const [formState, dispatch] = useReducer(formReducer, initialState);

  const { comments, positionDuration, positionType, positionStatus, positionCommision, entryPrice, exitPrice, contractsCounts, netPnL, netROI, positionDate, stopPrice, positionSymbol } = formState;




  const handlePositionFieldInput = (event, field) => {

    console.log(`field: ${field}, value: ${event.target.value}`)
    dispatch({ type: 'UPDATE_FIELD', field: `${field}`, value: event.target.value });
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
      commission: positionCommision,
      comments,
      netPnL,
      tradeId: tradeInfo?._id || '',
    }
    console.log('WHAT INSIDE?', data);
    if (validateForm()) {
      console.log("form is validate");

      if (!editMode) {
        await api
          .post('/api/addTrade', data).then((res) => {
            console.log("lol", "Add Trade", "success")
            notifyToast("Trade added successfully", "success");

            const fetchTrades = async () => {
              const result = await api.get('/api/fetchTrades');
              return result;
            }

            fetchTrades().then((result) => {

              dispatch(setTrades(result.data));
            }).catch((error) => {

            });
          }).catch((err) => {
            notifyToast("Couldn't add trade", "error");
          })


      }
      else if (editMode === true) {
        console.log('inside edit trade!', tradeInfo?._id);
        await api.post('/api/editTrade', data)
          .then((response) => {
            notifyToast("Trade Edit succssfully", "success")
          })
          .catch((error) => {
            notifyToast("Trade can't be updated", "error")
          });

      }

    } else {
      console.log('Please fill in all the fields');
    }
  };


  const validateForm = () => {
    if (positionType === '' || positionStatus === '' ||
      contractsCounts <= 0 || Number.isNaN(netPnL) || positionSymbol === "") {
      return false;
    }
    return true;
  };


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
                <Item>
                  <IconButton size="small" color="inherit" >
                    <Iconify icon={'eva:file-add-outline'} />
                  </IconButton>
                </Item>
              </Grid>
            </Grid>
          </Grid >
        </Box >
        <br />

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
                <TextField id="standard-basic" required="true" value={positionSymbol}
                  onChange={(e) => handlePositionFieldInput(e, 'positionSymbol')} label="Symbol" variant="standard" />
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
                  <MenuItem value={'Break Even'}>Break Even</MenuItem>
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
