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
    Slide,
    DialogContentText,
} from '@mui/material';
import { UserListHead } from '../../sections/@dashboard/user';
import { getMsg } from '../../utils/messeageUtils';
import { useDispatch, useSelector } from 'react-redux';
import { selectidx, selectlanguage } from '../../redux-toolkit/languagesSlice';
import { selectDarkMode } from '../../redux-toolkit/darkModeSlice';
import { selectMessages } from '../../redux-toolkit/messagesSlice';
import { selectTrade, setTrade } from '../../redux-toolkit/tradeSlice';
import { selectCurrentAccount, selectUser, selectUserAccounts, setTradesList } from '../../redux-toolkit/userSlice';
import { msgType } from '../../utils/messagesEnum';
import { msgNumber } from '../../utils/msgNumbers';
import { useToast } from 'react-toastify';
import React, { useState } from 'react';
import { filter } from 'lodash';
import api from '../../api/api';
import Iconify from '../iconify';
import AddFarshel from '../trades/importTrade/AddFarshel';
import Label from '../label';
import { sentenceCase } from 'change-case';
import { brokers } from '../brokersNames/brokers';
import TradeTableRow from './TradeTableRow/TradeTableRow';




export default function TradesTable(props) {
    //props
    // const { trades } = props;


    //selectors
    const languageidx = useSelector(selectidx);
    const darkMode = useSelector(selectDarkMode);
    const isHebrew = useSelector(selectlanguage);
    const messages = useSelector(selectMessages);
    const currentTrade = useSelector(selectTrade);
    const userAccounts = useSelector(selectUserAccounts);
    const currentAccount = useSelector(selectCurrentAccount);

    const trades = currentAccount?.trades;
    //states
    const [orderByCols, setOrderByCols] = useState('entryDate'); // Default sorting column
    const [orderCols, setOrderCols] = useState('asc'); // Default sorting order
    const [openCommend, setCommendOpen] = useState(false);
    const [selectedComment, setSelectedComment] = useState('');
    const user = useSelector(selectUser);
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


    //dispatch
    const dispatch = useDispatch();

    //helpers:

    const fileInputRef = React.useRef(null);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

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

    //edit modal States
    // const [editTradeId, setEditTradeId] = useState(null);
    const [editMode, setEditMode] = useState(false);

    //Image modal States
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [imageData, setImageData] = useState('');
    const [imageId, setimageId] = useState('');


    const handleOpenModal = (tradeId) => {

        if (userAccounts.length == 0) { //before open modal check if have any account and alert to user when no account
            notifyToast(getMsg(messages, msgType.warnings, msgNumber[6], languageidx).msgText, getMsg(messages, msgType.warnings, msgNumber[6], languageidx).msgType);
            notifyToast("before add trades you need create account", 'warning');
        }
        else {
            setIsOpenmodal(true);
        }


    };

    const handleOpenFarshelModal = (trade) => {
        setIsOpenFarshelmodal(true);
    };


    //cause to error for some reason ----------------------------------------------------------------
    // const showToast = useToast();

    const notifyToast = (Msg, Type) => {

        // showToast(Msg, Type);
    }


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
        // if (currentAccount?.Broker == brokers.Tradovate) {
        if (isHebrew === false) {
            // Define table columns for Tradovate broker
            TABLE_HEAD = [
                { id: 'entryDate', label: 'Open Date', alignRight: false },
                { id: 'symbol', label: 'Symbol', alignRight: false },
                { id: 'status', label: 'Status', alignRight: false },
                { id: 'netROI', label: 'Net ROI', alignRight: false },
                { id: 'longShort', label: 'Long / Short', alignRight: false },
                { id: currentAccount?.Broker == brokers.Binance ? "Quantity " : 'Contracts', label: currentAccount?.Broker == brokers.Binance ? "Quantity " : 'Contracts', alignRight: false },
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



    return (
        <>
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
                                    <TradeTableRow trade={trade} handleOpenFarshelModal={handleOpenFarshelModal}/>
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
        </>
    );
}