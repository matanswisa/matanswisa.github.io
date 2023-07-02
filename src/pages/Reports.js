import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTrades, getTradesList, setTrades as setTradesRedux } from '../redux-toolkit/tradesSlice';
import useToast from '../hooks/alert';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import Colors from '../components/color-utils/Colors'
import AddTrade from '../components/addTrade/addTradeFormModal';
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
  { id: 'comments', label: 'comments', alignRight: false }
];




const sumPnL = (trades) => {
  let sum = 0;
  trades.forEach((trade) => {
    sum += trade.netPnL
  });
  return sum;
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



  const showToast = useToast();

  const notifyToast = (Msg,Type) => {
    console.log(Msg,Type);
    showToast(Msg, Type);

}


  const trades = useSelector(getTrades)

  const [basicModal, setBasicModal] = useState(false);
  const toggleShow = () => setBasicModal(!basicModal);

  const [openmodal, setIsOpenmodal] = useState(false);
  const dispatch = useDispatch();

  const setTradesList = (trades) => {
    console.log(trades);
    dispatch(setTradesRedux(trades));
  }

  const handleOpenModal = () => {
    setIsOpenmodal(true);
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


  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

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

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  const deleteTrade = async (tradeId) => {
    console.log('Delete trade - ', tradeId);
    await api.delete('/api/deleteTrade', { data: { tradeId } });
    const trades = await fetchTrades();
    setTradesList(trades.data);
  }
  return (
    <>
      <Helmet>
        <title> Reports </title>
      </Helmet>
      <Container>

        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Reports
          </Typography>
          <Button  onClick={handleOpenModal} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            Add New Trade
          </Button>
          {openmodal && <AddTrade openModal={openmodal} handleOpenModal={setIsOpenmodal} showToast= {notifyToast} />}
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
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
                      <TableRow hover key={trade._id} tabIndex={-1} role="checkbox" selected={trade}>

                        <TableCell>
                          { }
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>

                            {new Date(trade.entryDate).toString().substring(0, 24)}

                          </Stack>
                        </TableCell>
                        <TableCell align="center">{trade.symbol}</TableCell>

                        <TableCell align="center">
                          <Label color={(trade.status === 'Loss' && 'error') || 'success'}>{sentenceCase(trade.status)}</Label>
                        </TableCell>



                        <TableCell align="center">{trade.netROI}%</TableCell>

                        <TableCell align="center">{trade.longShort}</TableCell>

                        <TableCell align="center">{trade.contracts}</TableCell>


                        <TableCell align="center">{trade.entryPrice}$</TableCell>
                        <TableCell align="center">{trade.stopPrice}$</TableCell>


                        <TableCell align="center">{trade.exitPrice}$</TableCell>

                        <TableCell align="center">{trade.duration}Min</TableCell>



                        <TableCell align="center">{trade.commission}$</TableCell>

                        <TableCell align="center">{trade.status === "Loss" ? trade.netPnL * -1 : trade.netPnL}$</TableCell>


                        <TableCell align="center"><IconButton size="large" color="inherit" >
                          <Iconify icon={'eva:image-outline'} />
                        </IconButton>{trade.image}</TableCell>   {/* COLNAME: image, VALUES: image of trade */}

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                        <TableCell align="center">{trade.comments}</TableCell>
                        <Popover
                          open={Boolean(open)}
                          anchorEl={open}
                          onClose={handleCloseMenu}
                          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                          PaperProps={{
                            sx: {
                              p: 1,
                              width: 140,
                              '& .MuiMenuItem-root': {
                                px: 1,
                                typography: 'body2',
                                borderRadius: 0.75,
                              },
                            },
                          }}
                        >

                          <MenuItem>

                            <MDBModal show={basicModal} setShow={setBasicModal} tabIndex='-1'>
                              <MDBModalDialog>
                                <MDBModalContent>
                                  <MDBModalHeader>
                                    <MDBModalTitle>Remove Trade</MDBModalTitle>
                                    <MDBBtn className='btn-close' color='none' onClick={toggleShow}> </MDBBtn>
                                  </MDBModalHeader>
                                  <MDBModalBody>You sure you want to remove this Trade?</MDBModalBody>

                                  <MDBModalFooter>
                                    <MDBBtn color='secondary' onClick={toggleShow}>
                                      Close
                                    </MDBBtn>
                                    <MDBBtn onClick={() => deleteTrade(trade._id)}>Remove</MDBBtn>
                                  </MDBModalFooter>
                                </MDBModalContent>
                              </MDBModalDialog>
                            </MDBModal>

                            <Iconify onClick={handleOpenModal} icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                            Edit
                            {openmodal && <AddTrade openModal={openmodal} handleOpenModal={setIsOpenmodal} tradeInfo={trade} isEditMode />}

                          </MenuItem >

                          <MenuItem sx={{ color: 'error.main' }}>
                            <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} onClick={() => toggleShow()} />
                            <button style={buttonStyle} onClick={() => toggleShow()}>
                              Delete
                            </button>
                          </MenuItem>
                        </Popover >
                      </TableRow >


                    );
                  })}
                  {
                    emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )
                  }
                </TableBody >

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
              </Table >
            </TableContainer >
          </Scrollbar >

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={USERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card >
      </Container >

      <h1 style={totalPlColor}>Total P&L </h1>
      <h2 style={totalPlColor}>{sumPnL(trades)}$</h2>
     
     
    </>
  );
}



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