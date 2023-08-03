import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useToast from '../hooks/alert';
import { ToastContainer, } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState} from 'react';
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
import AddFarshel from '../components/addTrade/AddFarshel'
import DialogContentText from '@mui/material/DialogContentText';
import Slide from '@mui/material/Slide';


// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';
import api from '../api/api';
import AddTrade from '../components/addTrade/addTradeFormModal';
import ImportTrade from '../components/addTrade/importTrade'
import ImageModal from '../components/ImageModal/ImageModal';
import { Grid } from 'rsuite';
// ----------------------------------------------------------------------
import { selectCurrentAccount } from '../redux-toolkit/userSlice';


const TABLE_HEAD = [
  { id: 'entryDate', label: 'Open Date', alignRight: false },
  { id: 'symbol', label: 'Symbol', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'netROI', label: 'Net ROI', alignRight: false },
  { id: 'longShort', label: 'Long / Short', alignRight: false },
  { id: 'contracts', label: 'Contracts', alignRight: false },
  // { id: 'entryPrice', label: 'Entry Price', alignRight: false },
  // { id: 'exitPrice', label: 'Exit Price', alignRight: false },
  // { id: 'stopPrice', label: 'Stop Price', alignRight: false },
  { id: 'duration', label: 'Duration', alignRight: false },
  { id: 'commission', label: 'Commission', alignRight: false },
  { id: 'netPnL', label: 'Net P&L', alignRight: false },
  { id: 'image', label: 'Image', alignRight: false },
  { id: 'edit', label: 'Edit', alignRight: false },
  { id: 'delete', label: 'Delete', alignRight: false },
  { id: 'comments', label: 'comments', alignRight: false }
];

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

const fetchTrades = async () => {
  const result = await api.get('/api/fetchTrades');
  return result;
}
// export let globalAlert;


//Related to dialog error - has to be outside of the component
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});



export default function UserPage() {
  const [openCommend, setCommendOpen] = React.useState(false);
  const [selectedComment, setSelectedComment] = useState('');

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


  //Upload image related code:
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    if (event.target.files.length > 0)
      setSelectedFile(event.target.files[0]);
  };

  const handleUpload = (tradeId) => {
    if (!selectedFile) { notifyToast("Couldn't upload the image", "error"); return; }
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
        notifyToast("Trade image uploaded successfully", "success");
        setTradesList(data);
      })
      .catch(error => {
        // Handle any errors that occurred during the upload
        notifyToast("Error uploading trade image", "error");
        console.error(error);
      });
  };

  const fileInputRef = React.useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    if (editTradeId?._id && selectedFile !== null) {
      handleUpload(editTradeId._id);
    }
  }, [selectedFile])



  const showToast = useToast();
  const notifyToast = (Msg, Type) => {

    showToast(Msg, Type);
  }


  const currentAccount = useSelector(selectCurrentAccount);
  let trades;

  

  if(currentAccount?.trades){

    trades = currentAccount?.trades;
  }
  else{
    trades = [];
  }
  


  const totalTrades = Object.keys(trades).length;

  const [basicModal, setBasicModal] = useState(false);
  const toggleShow = () => setBasicModal(!basicModal);

  const [openmodal, setIsOpenmodal] = useState(false);
  const [openmodalfarshel, setIsOpenFarshelmodal] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [openmodalImportTrades, setIsOpenmodalImportTrades] = useState(false);
  const dispatch = useDispatch();

  const setTradesList = (trades) => {

    // dispatch(setTradesRedux(trades));
  }

  const handleOpenModal = (tradeId) => {
    setIsOpenmodal(true);
  };

  const handleOpenFarshelModal = (trade) => {
    setSelectedTrade(trade);
    setIsOpenFarshelmodal(true);
  };


  const handleOpenModalImportTrades = (tradeId) => {
    setIsOpenmodalImportTrades(true);
  };


  const fetchLeastTrades = () => {
    return fetchTrades().then((res) => {
      if (res.data)
        setTradesList(res.data);
    }).catch((err) => {
      console.error(err);
    })
  }

  useEffect(() => {


    fetchTrades().then((res) => {
      if (res.data)
        setTradesList(res.data);
    }).catch((err) => {
      console.error(err);
    })
  }, [])





  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedDate, setSelectedDate] = useState(null); // New state for the selected date



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

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClearDate = () => {
    setSelectedDate(null);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;
  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);
  const isNotFound = !filteredUsers.length && !!filterName;

  const [opendialog, setDialogOpen] = useState(false);

  const handleClickDialogOpen = () => {
    setDialogOpen(true);
  };




  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const deleteTrade = async (tradeId) => {
    await api.delete('/api/deleteTrade', { data: { tradeId } });
    const tempTrades = await fetchTrades();
    setTradesList(tempTrades.data);
    notifyToast("Delete trade Successfully", 'warning');
    toggleShow();
  }

  const [editTradeId, setEditTradeId] = useState(null);
  const [editMode, setEditMode] = useState(false);


  //Image modal related code 
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageData, setImageData] = useState('');
  const [imageId, setimageId] = useState('');

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

      <Helmet>
        <title>All Trades</title>
      </Helmet>
      <Container>

        <div style={{ marginRight: "10px" }}>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="E, MMM d, yyyy"
            placeholderText="Select a date"
          />

          <Button
            variant="contained"
            onClick={handleClearDate}
            style={{ fontSize: "12px", minWidth: "80px" }}
          >
            Clear
          </Button>
        </div>

        <ToastContainer />

        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={6}>
          <Typography variant="h4" gutterBottom>
            Trades
          </Typography>

          <div>
            <Button onClick={handleOpenModalImportTrades} variant="contained" startIcon={<Iconify icon="eva:corner-up-left-outline" />} sx={{ marginRight: 2 }}>
              Import Trades
            </Button>
            {openmodalImportTrades && <ImportTrade openModal={openmodalImportTrades} handleOpenModal={setIsOpenmodalImportTrades} notifyToast={notifyToast} updateTradeLists={fetchLeastTrades} />}

            <Button onClick={handleOpenModal} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              Add New Trade
            </Button>
          </div>

          {openmodal && <AddTrade openModal={openmodal} handleOpenModal={setIsOpenmodal} notifyToast={notifyToast} updateTradeLists={fetchLeastTrades} />}
          {(openmodal && editMode && editTradeId !== null) === true ? <AddTrade
            updateTradeLists={fetchLeastTrades}
            key={editTradeId._id}
            openModal={openmodal}
            handleOpenModal={setIsOpenmodal}
            handleEditTradeLeavePanel={setEditTradeId}
            tradeInfo={editTradeId}
            notifyToast={notifyToast}
            isEditMode={true}
            prevState={editTradeId.status}
          /> : null}

        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, maxWidth: 2000, height: 'calc(100vh - 200px)' }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  onRequestSort={handleRequestSort}
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
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((trade, indx) => {

                      return (
                        <TableRow
                          onMouseEnter={() => { setEditTradeId(trade) }}
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




                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              {formatDate(trade.entryDate)}
                            </Stack>
                          </TableCell>
                          <TableCell align="center">{trade.symbol}</TableCell>
                          <TableCell align="center">
                            <Label color={(trade.status === 'Loss' && 'error') || (trade.stauts === 'Break Even' && 'warning') || (trade.status === 'Win' ? 'success' : 'warning')}>
                              {sentenceCase(trade.status)}
                            </Label>
                          </TableCell>
                          <TableCell align="center">{trade.netROI ? trade.netROI + "%" : "0.00" + "%"}</TableCell>
                          <TableCell align="center">{trade.longShort}</TableCell>
                          <TableCell align="center">{trade.contracts}</TableCell>

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


                          <TableCell align="center">
                            {trade.commission ? trade.commission + "$" : "N/A"}
                          </TableCell>
                          <TableCell align="center">{trade.netPnL}$</TableCell>
                          <TableCell align="center">
                            <input ref={fileInputRef} name="file" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                            {trade.image ? (
                              <IconButton size="large" color="inherit" onClick={() => { setImageData(trade.image); setImageModalOpen(true); setimageId(trade._id); }}>
                                <Iconify icon={'eva:image-outline'} />
                              </IconButton>
                            ) : <Iconify style={{ cursor: "pointer" }} icon={'eva:plus-square-outline'} onClick={handleButtonClick} />}
                          </TableCell>
                          <TableCell align="right">
                            <button
                              onClick={() => {
                                setEditMode(true);
                                setIsOpenmodal(true);
                                setEditTradeId(trade);
                              }}
                            >
                              Edit
                            </button>
                          </TableCell>
                          <TableCell align="right">
                            <button onClick={() => {
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
                                  deleteTrade(editTradeId._id); // Now proceed with the deletion
                                  handleDialogClose(); // Close the dialog first
                                }} color="primary">
                                  Confirm
                                </Button>
                              </DialogActions>
                            </Dialog>
                          </TableCell>

                          <TableCell onClick={handleCellClick("comments", trade.comments)} align="center">{trade.comments.length > 20 ? `${trade.comments.substring(0, 20)}...` : trade.comments}</TableCell>

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
        {imageModalOpen && <ImageModal open={imageModalOpen} handleClose={handleCloseDialog} imageData={imageData} tradeComments={editTradeId.comments} />}
        <Dialog open={openCommend} onClose={handleCloseCommend}>
          <DialogTitle>Comment</DialogTitle>
          <DialogContent>{selectedComment}</DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCommend} color="primary">Close</Button>
          </DialogActions>
        </Dialog>

      </Container >

      <Typography variant="h4" >
        Total PnL : {sumPnL(trades) < 0 ? <span style={totalPlRedColor}>{sumPnL(trades)}$</span> : <span style={totalPlColor}>{sumPnL(trades)}$</span>}
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