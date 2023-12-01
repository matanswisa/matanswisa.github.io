import { Helmet } from 'react-helmet-async';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useToast from '../hooks/alert';
import { ToastContainer, } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
// @mui
import {
  Card,
  Stack,
  Button,
  Container,
  Typography,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Slide from '@mui/material/Slide';
// components
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
// mock
import AddTrade from '../components/trades/addTrade/addTradeFormModal';
import ImportTrade from '../components/trades/importTrade/importTrade'
import { selectCurrentAccount, selectUser, selectUserAccounts, setTradesList } from '../redux-toolkit/userSlice';
import { selectMessages } from '../redux-toolkit/messagesSlice';
import { getMsg } from '../utils/messeageUtils';
import { msgType } from '../utils/messagesEnum.js';
import { msgNumber } from '../utils/msgNumbers.js';
import { selectDarkMode } from '../redux-toolkit/darkModeSlice';
import { selectTrade, setTrade } from '../redux-toolkit/tradeSlice';
import { selectlanguage, selectidx } from '../redux-toolkit/languagesSlice';
import TradesTable from '../components/Table/tradeTable';
import { selectIsEditMode, selectTradeToEdit, setEditMode } from '../redux-toolkit/editTradeFormSlice';
import api from '../api/api';
import axiosInstance from '../utils/axiosService';

const sumPnL = (trades) => {
  let sum = 0;
  if (trades !== null && trades.length > 0) {
    trades?.forEach((trade) => {
      if (trade && trade?.netPnL !== null) {
        sum += trade.netPnL
      }
    });
  }
  return sum.toFixed(2);
}



// export let globalAlert;


export default function Reports() {

  const currentAccount = useSelector(selectCurrentAccount);


  //------------------------------------------------   States ----------------------------------------------------- //
  const [trades, setTrades] = useState(currentAccount.trades)
  const languageidx = useSelector(selectidx);
  const darkMode = useSelector(selectDarkMode);
  const isHebrew = useSelector(selectlanguage);
  const messages = useSelector(selectMessages);
  const currentTrade = useSelector(selectTrade);
  const tradeToEdit = useSelector(selectTradeToEdit);
  const isEditFormEnable = useSelector(selectIsEditMode);


  const [openCommend, setCommendOpen] = React.useState(false);
  const [selectedComment, setSelectedComment] = useState('');
  const userAccounts = useSelector(selectUserAccounts);
  const [basicModal, setBasicModal] = useState(false);
  const [openmodal, setIsOpenmodal] = useState(false);
  const [openmodalImportTrades, setIsOpenmodalImportTrades] = useState(false);
  const user = useSelector(selectUser);
  //search states
  const [selectedDate, setSelectedDate] = useState(null); // New state for the selected date


  //Image modal States
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageData, setImageData] = useState('');


  const handleCloseCommend = () => {
    setCommendOpen(false);
  };

  //------------------------------------------------handle Upload image ----------------------------------------------------- //

  // useEffect(()=>{
  //   setTrades(currentAccount.trades)
  // },[currentAccount.trades])

  //------------------------------------------------handle alert ----------------------------------------------------- //
  const showToast = useToast();
  const notifyToast = (Msg, Type) => {

    showToast(Msg, Type);
  }


  useEffect(() => {
    const setTradesWithImages = async () => {
      const response = await axiosInstance.post('/api/fetchTrades', { userId: user._id, accountId: currentAccount._id })
      dispatch(setTradesList(response.data.trades))
    }

    setTradesWithImages().then(() => {
    })
  }, [])

  const dispatch = useDispatch();


  const handleOpenModal = (tradeId) => {
    if (userAccounts.length == 0) { //before open modal check if have any account and alert to user when no account
      notifyToast(getMsg(messages, msgType.warnings, msgNumber[6], languageidx).msgText, getMsg(messages, msgType.warnings, msgNumber[6], languageidx).msgType);
      //  notifyToast("before add trades you need create account", 'warning');
    }
    else {
      setIsOpenmodal(true);
    }
  };


  const handleOpenModalImportTrades = (tradeId) => {

    if (userAccounts.length == 0) { //before open modal check if have any account and alert to user when no account
      notifyToast(getMsg(messages, msgType.warnings, msgNumber[7], languageidx).msgText, getMsg(messages, msgType.warnings, msgNumber[7], languageidx).msgType);
      // notifyToast("before import trades you need create account", 'warning');
    }
    else {
      setIsOpenmodalImportTrades(true);
    }

  };


  const handleClearDate = () => {
    setSelectedDate(null);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };


  const editTradeBoolean = isEditFormEnable && Object.keys(tradeToEdit).length > 0;

  const setOpenModalInEditMode = (editBoolean) => {
    dispatch(setEditMode(editBoolean));
  }

  const EditTradeForm = () => {
    return (
      <AddTrade
        key={tradeToEdit._id}
        openModal={isEditFormEnable}
        handleOpenModal={setOpenModalInEditMode}
        tradeInfo={tradeToEdit}
        notifyToast={notifyToast}
        isEditMode={true}
      />);
  }



  return (
    <>

      {isHebrew === false ?
        <Helmet>
          <title>All Trades</title>
        </Helmet>
        : <Helmet>
          <title>כול הטריידים</title>
        </Helmet>

      }
      <Container style={{ maxWidth: 'none' }}>

        <div style={{ marginRight: "10px" }}>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="E, MMM d, yyyy"
            placeholderText={isHebrew === false ? "Select a date" : "בחר תאריך"}
          />
          {isHebrew === false ?
            <Button
              variant="contained"
              onClick={handleClearDate}
              style={{ fontSize: "12px", minWidth: "80px", backgroundColor: darkMode ? '#1ba6dc' : "", color: darkMode ? 'white' : "", }}

            >
              Clear
            </Button> : <Button
              variant="contained"
              onClick={handleClearDate}
              style={{ fontSize: "12px", minWidth: "80px", backgroundColor: darkMode ? '#1ba6dc' : "", color: darkMode ? 'white' : "", }}
            >
              נקה
            </Button>}
        </div>
        <ToastContainer />
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={6}>
          <Typography variant="h4">
            {isHebrew === false ?
              "Trades" : "טריידים"}
          </Typography>
          <div>
            <Button style={{ backgroundColor: darkMode ? '#1ba6dc' : "", color: darkMode ? 'white' : "", }} onClick={handleOpenModalImportTrades} variant="contained" startIcon={<Iconify icon="eva:corner-up-left-outline" />} sx={{ marginRight: 2 }}>
              {isHebrew === false ?
                "Import Trades" : "ייבוא טרידיים"}
            </Button>
            {openmodalImportTrades && <ImportTrade openModal={openmodalImportTrades} handleOpenModal={setIsOpenmodalImportTrades} notifyToast={notifyToast} />}

            <Button style={{ backgroundColor: darkMode ? '#1ba6dc' : "", color: darkMode ? 'white' : "", }} onClick={() => { handleOpenModal() }} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              {isHebrew === false ? "Add New Trade" : "הוסף טרייד חדש"}
            </Button>
          </div>
          {openmodal && <AddTrade openModal={openmodal} handleOpenModal={setIsOpenmodal} notifyToast={notifyToast} />}
          {editTradeBoolean ? <EditTradeForm /> : null}
        </Stack>
        {/* <Card> */}
        <TradesTable trades={trades} selectedDate={selectedDate} />
        {/* </Card> */}

        <Dialog open={openCommend} onClose={handleCloseCommend}>
          <DialogTitle> {isHebrew === false ? "Comment" : "הערות"}</DialogTitle>
          <DialogContent>{selectedComment}</DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCommend} color="primary">{isHebrew === false ? "Close" : "סגירה"}</Button>
          </DialogActions>
        </Dialog>
        <Typography variant="h4" >
          {isHebrew === false ? "Total PnL" : "רווח/הפסד כולל"} : {sumPnL(currentAccount.trades) < 0 ? <span style={totalPlRedColor}>{sumPnL(currentAccount.trades)}$</span> : <span style={totalPlColor}>{sumPnL(currentAccount.trades)}$</span>}
        </Typography>

      </Container >

    </>
  );
}

const totalPlRedColor = {

  color: '#d16c71', // Replace with the desired text color

};


const totalPlColor = {

  color: '#54a38d', // Replace with the desired text color

};


const buttonStyle = {
  // marginRight: '1px',
  border: 'none',
  backgroundColor: '#FFFFFF', // Replace with the desired background color
  color: '#000', // Replace with the desired text color
  padding: '10px 20px', // Adjust the padding as per your needs
};