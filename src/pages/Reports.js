import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useToast from '../hooks/alert';
import { ToastContainer, } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DialogContentText from '@mui/material/DialogContentText';
import Slide from '@mui/material/Slide';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead } from '../sections/@dashboard/user';
// mock
import api from '../api/api';
import AddTrade from '../components/trades/addTrade/addTradeFormModal';
import ImportTrade from '../components/trades/importTrade/importTrade'
import AddFarshel from '../components/trades/importTrade/AddFarshel'
import ImageModal from '../components/ImageModal/ImageModal';
import { Grid } from 'rsuite';
import { selectCurrentAccount, selectUser, setTradesList, selectUserAccounts } from '../redux-toolkit/userSlice';
import { selectMessages } from '../redux-toolkit/messagesSlice';
import { getMsg } from '../utils/messeageUtils';
import { msgType } from '../utils/messagesEnum.js';
import { msgNumber } from '../utils/msgNumbers.js';
import { configAuth } from '../api/configAuth';
import { brokers } from "../components/brokersNames/brokers.js";
import { handleUploadTradeImage } from '../utils/uploadImage';
import { selectDarkMode } from '../redux-toolkit/darkModeSlice';
import { selectTrade, setTrade } from '../redux-toolkit/tradeSlice';
import { selectlanguage, selectidx } from '../redux-toolkit/languagesSlice';

const sumPnL = (trades) => {
  let sum = 0;
  trades.forEach((trade) => {
    if (trade && trade?.netPnL !== null) {
      sum += trade.netPnL
    }
  });
  return sum.toFixed(2);
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
// export let globalAlert;


//Related to dialog error - has to be outside of the component
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function UserPage() {

  //---------------------------------------------------------handle currentAccount selected ----------------------------------------------------- //
  const currentAccount = useSelector(selectCurrentAccount);
  //------------------------------------------------handle trade by current account selected ----------------------------------------------------- //
  let trades;
  if (currentAccount?.trades) {
    trades = currentAccount?.trades;
  }
  else {
    trades = [];
  }
  //------------------------------------------------   States ----------------------------------------------------- //
  const languageidx = useSelector(selectidx);
  const darkMode = useSelector(selectDarkMode);
  const isHebrew = useSelector(selectlanguage);
  const messages = useSelector(selectMessages);
  const currentTrade = useSelector(selectTrade);



  const [orderByCols, setOrderByCols] = useState('entryDate'); // Default sorting column
  const [orderCols, setOrderCols] = useState('asc'); // Default sorting order
 



  const [openCommend, setCommendOpen] = React.useState(false);
  const [selectedComment, setSelectedComment] = useState('');
  const user = useSelector(selectUser);
  const userAccounts = useSelector(selectUserAccounts);
  const totalTrades = Object.keys(trades).length;
  const [basicModal, setBasicModal] = useState(false);
  const toggleShow = () => setBasicModal(!basicModal);
  const [openmodal, setIsOpenmodal] = useState(false);
  const [openmodalfarshel, setIsOpenFarshelmodal] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [openmodalImportTrades, setIsOpenmodalImportTrades] = useState(false);
  const [open, setOpen] = useState(null);
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');

  //search states
  const [filterName, setFilterName] = useState('');
  const [selectedDate, setSelectedDate] = useState(null); // New state for the selected date
  const [order, setOrder] = useState('asc');

  //table config states:
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const filteredUsers = applySortFilter(trades, getComparator(order, orderBy), filterName);
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - trades.length) : 0;
  const isNotFound = !filteredUsers.length && !!filterName;
  const [opendialog, setDialogOpen] = useState(false);

  //edit modal States
  // const [editTradeId, setEditTradeId] = useState(null);
  const [editMode, setEditMode] = useState(false);

  //Image modal States
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageData, setImageData] = useState('');
  const [imageId, setimageId] = useState('');

  let TABLE_HEAD;
  //------------------------- Handle table Cols Struct for each broker  ------------------------------------------- //
  // default struct
  if (isHebrew === false) {
    TABLE_HEAD = [
      { id: 'entryDate', label: 'Open Date', alignRight: false },
      { id: 'symbol', label: 'Symbol', alignRight: false },
      { id: 'status', label: 'Status', alignRight: false },
      { id: 'netROI', label: 'Net ROI', alignRight: false },
      { id: 'longShort', label: 'Long / Short', alignRight: false },
      { id: 'contracts', label: 'Contracts', alignRight: false },
      { id: 'duration', label: 'Duration', alignRight: false },
      { id: 'commission', label: 'Commission', alignRight: false },
      { id: 'netPnL', label: 'Net P&L', alignRight: false },
      { id: 'image', label: 'Image', alignRight: false },
      { id: 'edit', label: 'Edit', alignRight: false },
      { id: 'delete', label: 'Delete', alignRight: false },
      { id: 'comments', label: 'comments', alignRight: false }
    ];;

  }
  else {
    TABLE_HEAD = [
      { id: 'הערות', label: 'הערות', alignRight: false },
      { id: 'מחק', label: 'מחק', alignRight: false },
      { id: 'עריכה', label: 'עריכה', alignRight: false },
      { id: 'תמונה', label: 'תמונה', alignRight: false },
      { id: 'רווח/הפסד נקי', label: 'רווח/הפסד נקי', alignRight: false },
      { id: 'עמלה', label: 'עמלה', alignRight: false },
      { id: 'זמן עסקה', label: 'זמן עסקה', alignRight: false },
      { id: 'חוזים', label: 'חוזים', alignRight: false },
      { id: 'לונג / שורט', label: 'לונג / שורט', alignRight: false },
      { id: 'רוי נקי', label: 'רוי נקי', alignRight: false },
      { id: 'סטטוס', label: 'סטטוס', alignRight: false },
      { id: 'סימן', label: 'סימן', alignRight: false },
      { id: 'תאריך כניסה', label: 'תאריך כניסה', alignRight: false },
    ];

  }

  if (currentAccount !== null) {
    // Check if the current account's broker is Tradovate
    if (currentAccount?.Broker == brokers.Tradovate) {

      if (isHebrew === false) {
        // Define table columns for Tradovate broker
        TABLE_HEAD = [
          { id: 'entryDate', label: 'Open Date', alignRight: false },
          { id: 'symbol', label: 'Symbol', alignRight: false },
          { id: 'status', label: 'Status', alignRight: false },
          { id: 'netROI', label: 'Net ROI', alignRight: false },
          { id: 'longShort', label: 'Long / Short', alignRight: false },
          { id: 'contracts', label: 'Contracts', alignRight: false },
          { id: 'duration', label: 'Duration', alignRight: false },
          { id: 'commission', label: 'Commission', alignRight: false },
          { id: 'netPnL', label: 'Net P&L', alignRight: false },
          { id: 'image', label: 'Image', alignRight: false },
          { id: 'edit', label: 'Edit', alignRight: false },
          { id: 'delete', label: 'Delete', alignRight: false },
          { id: 'comments', label: 'comments', alignRight: false }
        ];
        // Check if the current account's broker is Binance
      }
      else {
        TABLE_HEAD = [
          { id: 'הערות', label: 'הערות', alignRight: false },
          { id: 'מחק', label: 'מחיקה', alignRight: false },
          { id: 'עריכה', label: 'עריכה', alignRight: false },
          { id: 'תמונה', label: 'תמונה', alignRight: false },
          { id: 'רווח/הפסד נקי', label: 'רווח/הפסד נקי', alignRight: false },
          { id: 'עמלה', label: 'עמלה', alignRight: false },
          { id: 'זמן עסקה', label: 'זמן עסקה', alignRight: false },
          { id: 'חוזים', label: 'חוזים', alignRight: false },
          { id: 'לונג / שורט', label: 'לונג / שורט', alignRight: false },
          { id: 'רוי נקי', label: 'רוי נקי', alignRight: false },
          { id: 'סטטוס', label: 'סטטוס', alignRight: false },
          { id: 'סימן', label: 'סימן', alignRight: false },
          { id: 'תאריך כניסה', label: 'תאריך כניסה', alignRight: false },
        ];

      }
    }
    else if (currentAccount?.Broker == brokers.Binance) {

      if (isHebrew === false) {
        // Define table columns for Binance broker
        TABLE_HEAD = [
          { id: 'entryDate', label: 'Open Date', alignRight: false },
          { id: 'symbol', label: 'Symbol', alignRight: false },
          { id: 'status', label: 'Status', alignRight: false },
          { id: 'longShort', label: 'Long / Short', alignRight: false },
          { id: 'Quantity', label: 'Quantity', alignRight: false },
          { id: 'commission', label: 'Commission', alignRight: false },
          { id: 'netPnL', label: 'Net P&L', alignRight: false },
          { id: 'image', label: 'Image', alignRight: false },
          { id: 'edit', label: 'Edit', alignRight: false },
          { id: 'delete', label: 'Delete', alignRight: false },
          { id: 'comments', label: 'comments', alignRight: false }
        ];

      }
      else {
        TABLE_HEAD = [
          { id: 'comments', label: 'הערות', alignRight: false },
          { id: 'delete', label: 'מחיקה', alignRight: false },
          { id: 'edit', label: 'עריכה', alignRight: false },
          { id: 'image', label: 'תמונה', alignRight: false },
          { id: 'commission', label: 'עמלה', alignRight: false },
          { id: 'netPnL', label: 'רווח נטו', alignRight: false },
          { id: 'Quantity', label: 'כמות', alignRight: false },
          { id: 'longShort', label: 'לונג/שורט', alignRight: false },
          { id: 'status', label: 'סטטוס', alignRight: false },
          { id: 'symbol', label: 'סמל', alignRight: false },
          { id: 'entryDate', label: 'תאריך פתיחה', alignRight: false },
        ];
      }
    }
  }



  
  const handleRequestSortCols = (property) => {
    if (orderByCols === property) {
      // If the same column is clicked again, toggle the order
      setOrderCols((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      // If a different column is clicked, set it as the new sorting column in ascending order
      setOrderByCols(property);
      setOrderCols('asc');
    }
  };
  
  
  

  

  function handleCellClick(parameter, info) {
    return function () {
      if (parameter === 'comments') {

        setSelectedComment(info);
        setCommendOpen(true);
      }
    };
  }

  const handleCloseCommend = () => {
    setCommendOpen(false);
  };

  //------------------------------------------------handle Upload image ----------------------------------------------------- //
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    if (event.target.files.length > 0)
      setSelectedFile(event.target.files[0]);
  };

  const handleUpload = (tradeId) => {
    console.log("Inside upload new image but adding trade!", tradeId)

    if (!selectedFile && !tradeId) {
      notifyToast(getMsg(messages, msgType.errors, msgNumber[9], languageidx).msgText, getMsg(messages, msgType.errors, msgNumber[9], languageidx).msgType);

      // notifyToast("Couldn't upload the image", "error"); return; }
    }
    // Create a new FormData object
    const formData = new FormData();
    // Append the selected file to the FormData object
    formData.append('file', selectedFile);
    formData.append('tradeId', tradeId);
    formData.append('userId', user._id)
    formData.append('accountId', currentAccount._id)
    // Make a POST request to the server with the file data
    api.post('http://localhost:8000/api/uploadTradeImage', formData, { headers: { Authorization: "Berear " + user.accessToken, 'Content-Type': 'multipart/form-data' } })
      .then(response => response.json())
      .then(data => {
        notifyToast(getMsg(messages, msgType.success, msgNumber[6], languageidx).msgText, getMsg(messages, msgType.success, msgNumber[6], languageidx).msgType);
        // notifyToast("Trade image uploaded successfully", "success");
        dispatch(setTradesList(data));
      })
      .catch(error => {
        notifyToast(getMsg(messages, msgType.errors, msgNumber[10], languageidx).msgText, getMsg(messages, msgType.errors, msgNumber[10], languageidx).msgType);
        // Handle any errors that occurred during the upload
        // notifyToast("Error uploading trade image", "error");
        console.error(error);
      });
  };

  const fileInputRef = React.useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };



  //------------------------------------------------handle alert ----------------------------------------------------- //
  const showToast = useToast();
  const notifyToast = (Msg, Type) => {

    showToast(Msg, Type);
  }



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

  const handleOpenFarshelModal = (trade) => {
    setSelectedTrade(trade);
    setIsOpenFarshelmodal(true);
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

  //------------------------------------------------handle Serach by date ----------------------------------------------------- //
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", options);
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClearDate = () => {
    setSelectedDate(null);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = trades.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  //------------------------- handle table pages view ------------------------------------------- //
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };


  //------------------------------------- handle dialogs  ------------------------------------------- //
  const handleClickDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const deleteTrade = async (tradeId) => {
    const res = await api.post('/api/deleteTrade', { tradeId: tradeId, userId: user._id, accountId: currentAccount._id }, { headers: { Authorization: 'Bearer ' + user.accessToken } });
    dispatch(setTradesList(res.data))
    notifyToast(getMsg(messages, msgType.success, msgNumber[14], languageidx).msgText, getMsg(messages, msgType.success, msgNumber[14], languageidx).msgType);
    // notifyToast("Delete trade Successfully", 'success');
    toggleShow();
  }



  // Function to handle opening the dialog and setting the image data
  const handleOpenDialog = (imageData) => {
    setImageModalOpen(true);
    setImageData(imageData);
  };

  // Function to handle closing the dialog
  const handleCloseDialog = () => {
    setImageModalOpen(false);
    setImageData('');
  };


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
      <Container>

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
          <Typography variant="h4" gutterBottom>
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
          {(openmodal && editMode && currentTrade !== null) === true ? <AddTrade
            key={currentTrade._id}
            openModal={openmodal}
            handleOpenModal={setIsOpenmodal}
            tradeInfo={currentTrade}
            notifyToast={notifyToast}
            isEditMode={true}
            prevState={currentTrade.status}
          /> : null}
        </Stack>
        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, maxWidth: 2000, }}>
              <Table>
                <UserListHead
                  order={orderCols}
                  orderBy={orderByCols}
                  headLabel={TABLE_HEAD}
                  rowCount={trades.length}
                  onRequestSort={handleRequestSortCols}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {trades
                    .filter((trade) => {
                      // Check if there's a selected date and if it matches the trade's entry date
                      return (
                        !selectedDate || // If no selected date, show all trades
                        new Date(trade.entryDate).toLocaleDateString('en-GB') ===
                        selectedDate.toLocaleDateString('en-GB')
                      );
                    })
                    .sort((a, b) => {
                      // Compare the rows based on the selected sorting column and order
                      const aValue = a[orderByCols] || ''; // Use an empty string if aValue is undefined
                      const bValue = b[orderByCols] || '';
                  
                      if (orderCols === 'asc') {
                        return aValue.localeCompare(bValue);
                      } else {
                        return bValue.localeCompare(aValue);
                      }
                    })
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((trade, indx) => {

                      return (
                        <TableRow
                          onMouseEnter={() => { dispatch(setTrade(trade)) }}
                          hover
                          key={trade._id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={trade}
                        >

                          <TableCell>
                            <IconButton size="large" color="inherit" onClick={() => handleOpenFarshelModal(trade)}>
                              <Iconify icon={'eva:info-outline'} />
                            </IconButton>
                            {openmodalfarshel && selectedTrade === trade && <AddFarshel trade={trade} openModal={openmodalfarshel} handleOpenModal={setIsOpenFarshelmodal} />}
                          </TableCell>


                          {isHebrew === false ?
                            <TableCell component="th" scope="row" padding="none">
                              <Stack direction="row" alignItems="center" spacing={2}>
                                {formatDate(trade.entryDate)}
                              </Stack>
                            </TableCell> :
                             <TableCell onClick={handleCellClick("comments", trade?.comments)} align="center">{trade?.comments.length !== 0 ? trade?.comments?.length > 20 ? `${trade?.comments?.substring(0, 20)}...` : trade?.comments : "לא זמין" }</TableCell>}

                          {isHebrew === false ?
                            <TableCell align="center">{trade.symbol}</TableCell> :
                            <TableCell align="right">
                              <button style={{ backgroundColor: darkMode ? '#121212' : "", color: darkMode ? 'white' : "", }} onClick={() => {
                                handleClickDialogOpen();
                              }}>
                                מחק
                              </button>
                              <Dialog
                                open={opendialog}
                                TransitionComponent={Transition}

                                onClose={handleDialogClose}
                                aria-describedby="alert-dialog-slide-description"
                              >
                                <DialogTitle>{"Confirm Deletion"}</DialogTitle>
                                <DialogContent>
                                  <DialogContentText id="alert-dialog-slide-description">
                                    האם אתה בטוח ברצונך למחוק את הטרייד ?
                                  </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                  <Button onClick={handleDialogClose}>ביטול</Button>
                                  <Button onClick={() => {
                                    currentTrade &&
                                      deleteTrade(currentTrade._id); // Now proceed with the deletion
                                    handleDialogClose(); // Close the dialog first
                                  }} color="primary">
                                    אישור
                                  </Button>
                                </DialogActions>
                              </Dialog>
                            </TableCell>}

                          {isHebrew === false ?
                            <TableCell align="center">
                              <Label color={(trade.status === 'Loss' && 'error') || (trade.stauts === 'Break Even' && 'warning') || (trade.status === 'Win' ? 'success' : 'warning')}>
                                {sentenceCase(trade.status)}
                              </Label>
                            </TableCell> :
                            <TableCell align="right">
                              <button style={{ backgroundColor: darkMode ? '#121212' : "", color: darkMode ? 'white' : "", }}
                                onClick={() => {
                                  setEditMode(true);
                                  setIsOpenmodal(true);
                                  dispatch(setTrade(trade));
                                }}
                              >
                                ערוך
                              </button>
                            </TableCell>}



                          {currentAccount.Broker == 1 ?
                            <TableCell align="center">{trade.netROI ? trade.netROI + "%" : "0.00" + "%"}</TableCell>
                            : ''}

                          {isHebrew === false ?
                            <TableCell align="center">{trade.longShort}</TableCell> :
                            <TableCell align="center">{trade.netPnL}$</TableCell>}

                          {isHebrew === false ?
                            <TableCell align="center">{trade.contracts}</TableCell> :
                            <TableCell align="center">
                              {trade.commission ? trade.commission + "$" : "N/A"}
                            </TableCell>}

                          {currentAccount.Broker == 1 ?
                            <TableCell align="center">
                              {trade.duration !== undefined && trade.duration > 0 ? (
                                <React.Fragment>
                                  {trade.duration >= 60 && `${Math.floor(trade.duration / 60)} Hr `}
                                  {Math.floor(trade.duration % 60) > 0 && `${Math.floor(trade.duration % 60)} Min `}
                                  {Math.floor((trade.duration % 1) * 60) > 0 && `${Math.floor((trade.duration % 1) * 60)} Sec`}
                                </React.Fragment>
                              ) : (
                                "N/A"
                              )}
                            </TableCell>
                            : ""}

                          {isHebrew === false ?
                            <TableCell align="center">
                              {trade.commission ? trade.commission + "$" : "N/A"}
                            </TableCell> :
                            <TableCell align="center">{trade.contracts}</TableCell>}

                          {isHebrew === false ?
                            <TableCell align="center">{trade.netPnL}$</TableCell> :
                            <TableCell align="center">{trade.longShort}</TableCell>}


                          {isHebrew === false ?
                            <TableCell align="center">
                              <input ref={fileInputRef} name="file" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                              {trade.image ? (
                                <IconButton size="large" color="inherit" onClick={() => { setImageData(trade.image); setImageModalOpen(true); setimageId(trade._id); }}>
                                  <Iconify icon={'eva:image-outline'} />
                                </IconButton>
                              ) : <Iconify style={{ cursor: "pointer" }} icon={'eva:plus-square-outline'} onClick={handleButtonClick} />}
                            </TableCell> :
                            currentAccount.Broker == 1 ?
                              <TableCell align="center">{trade.netROI ? trade.netROI + "%" : "0.00" + "%"}</TableCell>
                              : ''}




                          {isHebrew === false ?
                            <TableCell align="right">
                              <button style={{ backgroundColor: darkMode ? '#121212' : "", color: darkMode ? 'white' : "", }}
                                onClick={() => {
                                  setEditMode(true);
                                  setIsOpenmodal(true);
                                  dispatch(setTrade(trade));
                                }}
                              >
                                Edit
                              </button>
                            </TableCell> :
                            <TableCell align="center">
                              <Label color={(trade.status === 'Loss' && 'error') || (trade.stauts === 'Break Even' && 'warning') || (trade.status === 'Win' ? 'success' : 'warning')}>
                                {sentenceCase(trade.status)}
                              </Label>
                            </TableCell>}

                          {isHebrew === false ?
                            <TableCell align="right">
                              <button style={{ backgroundColor: darkMode ? '#121212' : "", color: darkMode ? 'white' : "", }} onClick={() => {
                                handleClickDialogOpen();
                              }}>
                                Delete
                              </button>
                              <Dialog
                                open={opendialog}
                                TransitionComponent={Transition}

                                onClose={handleDialogClose}
                                aria-describedby="alert-dialog-slide-description"
                              >
                                <DialogTitle>{"Confirm Deletion"}</DialogTitle>
                                <DialogContent>
                                  <DialogContentText id="alert-dialog-slide-description">
                                    Are you sure you want to delete this trade?
                                  </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                  <Button onClick={handleDialogClose}>Cancel</Button>
                                  <Button onClick={() => {
                                    currentTrade &&
                                      deleteTrade(currentTrade._id); // Now proceed with the deletion
                                    handleDialogClose(); // Close the dialog first
                                  }} color="primary">
                                    Confirm
                                  </Button>
                                </DialogActions>
                              </Dialog>
                            </TableCell> :
                            <TableCell align="center">{trade.symbol}</TableCell>}

                          {isHebrew === false ?
                            
                            <TableCell onClick={handleCellClick("comments", trade?.comments)} align="center">{trade?.comments.length !== 0 ? trade?.comments?.length > 20 ? `${trade?.comments?.substring(0, 20)}...` : trade?.comments : "N/A" }</TableCell>
                            : <TableCell component="th" scope="row" padding="none">
                              <Stack direction="row" alignItems="center" spacing={2}>
                                {formatDate(trade.entryDate)}
                              </Stack>
                            </TableCell>}
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>
                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            component="div"
            count={totalTrades}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
        {imageModalOpen && <ImageModal open={imageModalOpen} handleClose={handleCloseDialog} imageData={imageData} tradeComments={currentTrade.comments} />}
        <Dialog open={openCommend} onClose={handleCloseCommend}>
          <DialogTitle> {isHebrew === false ? "Comment" : "הערות"}</DialogTitle>
          <DialogContent>{selectedComment}</DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCommend} color="primary">{isHebrew === false ? "Close" : "סגירה"}</Button>
          </DialogActions>
        </Dialog>

      </Container >

      <Typography variant="h4" >
        {isHebrew === false ? "Total PnL" : "רווח/הפסד כולל"} : {sumPnL(trades) < 0 ? <span style={totalPlRedColor}>{sumPnL(trades)}$</span> : <span style={totalPlColor}>{sumPnL(trades)}$</span>}
      </Typography>
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