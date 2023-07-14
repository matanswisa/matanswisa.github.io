import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import React, { useRef } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { getTrades, getTradesList, setTrades as setTradesRedux } from '../redux-toolkit/tradesSlice';
import useToast from '../hooks/alert';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState, useReducer } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';




import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from 'mdb-react-ui-kit';


// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';
import api from '../api/api';
import { Colors } from '../components/color-utils/Colors'
import AddTrade from '../components/addTrade/addTradeFormModal';
import ImageModal from '../components/ImageModal/ImageModal';
// ----------------------------------------------------------------------


const TABLE_HEAD = [
  { id: 'entryDate', label: 'Open Date', alignRight: false },
  { id: 'symbol', label: 'Symbol', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'netROI', label: 'Net ROI', alignRight: false },
  { id: 'longShort', label: 'Long / Short', alignRight: false },
  { id: 'contracts', label: 'Contracts', alignRight: false },
  { id: 'entryPrice', label: 'Entry Price', alignRight: false },
  { id: 'stopPrice', label: 'Stop Price', alignRight: false },
  { id: 'exitPrice', label: 'Exit Price', alignRight: false },
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

export default function UserPage() {





  //Upload image related code:
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    if (editTradeId?._id) {
      setSelectedFile(event.target.files[0]);
      console.log("imageId", editTradeId._id);
      handleUpload(editTradeId._id);
      fetchLeastTrades();
    }
  };

  const handleUpload = (tradeId) => {
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
        console.log(data);
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
    console.log(selectedFile);

    if (selectedFile) {
      notifyToast("Image successfully uploaded", "success");
    }
  }, [selectedFile])





  ////





  const showToast = useToast();
  const notifyToast = (Msg, Type) => {

    showToast(Msg, Type);
  }


  const trades = useSelector(getTrades)

  const [basicModal, setBasicModal] = useState(false);
  const toggleShow = () => setBasicModal(!basicModal);

  const [openmodal, setIsOpenmodal] = useState(false);
  const dispatch = useDispatch();

  const setTradesList = (trades) => {

    dispatch(setTradesRedux(trades));
  }

  const handleOpenModal = (tradeId) => {
    setIsOpenmodal(true);
  };


  const fetchLeastTrades = () => {
    fetchTrades().then((res) => {
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



  const deleteTrade = async (tradeId) => {
    await api.delete('/api/deleteTrade', { data: { tradeId } });
    const tempTrades = await fetchTrades();
    setTradesList(tempTrades.data);
    notifyToast(`Delete trade - ${tradeId}`, 'warning');
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

        <ToastContainer />
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Trades
          </Typography>
          <Button onClick={handleOpenModal} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            Add New Trade
          </Button>
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
            <TableContainer sx={{ minWidth: 800, maxWidth: 2000 }}>
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
                  {trades.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((trade, indx) => {
                    return (
                      <TableRow
                        onMouseEnter={() => { setEditTradeId(trade) }}
                        hover
                        key={trade._id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={trade}
                      >
                        <TableCell >
                          { }
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            {new Date(trade.entryDate).toString().substring(0, 24)}
                          </Stack>
                        </TableCell>
                        <TableCell align="center">{trade.symbol}</TableCell>
                        <TableCell align="center">
                          <Label color={(trade.status === 'Loss' && 'error') || (trade.stauts === 'Break Even' && 'warning') || (trade.status === 'Win' ? 'success' : 'warning')}>
                            {sentenceCase(trade.status)}
                          </Label>
                        </TableCell>
                        <TableCell align="center">{trade.netROI ? trade.netROI + "%" : "N/A"}</TableCell>
                        <TableCell align="center">{trade.longShort}</TableCell>
                        <TableCell align="center">{trade.contracts}</TableCell>
                        <TableCell align="center">
                          {trade.entryPrice ? trade.entryPrice + "$" : "N/A"}
                        </TableCell>
                        <TableCell align="center">
                          {trade.stopPrice ? trade.stopPrice + "$" : "N/A"}
                        </TableCell>
                        <TableCell align="center">
                          {trade.exitPrice ? trade.exitPrice + "$" : "N/A"}
                        </TableCell>
                        <TableCell align="center">
                          {trade.duration ? trade.duration + "Min" : "N/A"}
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
                          ) : <Iconify icon={'eva:plus-square-outline'} onClick={handleButtonClick} />}
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
                            deleteTrade(editTradeId._id);
                          }}>
                            Delete
                          </button>
                        </TableCell>
                        <TableCell align="center">{trade.comments.length > 20 ? `${trade.comments.substring(0, 20)}...` : trade.comments}</TableCell>

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
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={USERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
        {imageModalOpen && <ImageModal open={imageModalOpen} handleClose={handleCloseDialog} imageData={imageData} tradeComments={editTradeId.comments} />}


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