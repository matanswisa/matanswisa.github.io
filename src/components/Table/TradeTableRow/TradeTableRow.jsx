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
import { useDispatch, useSelector } from 'react-redux';
import Iconify from '../../iconify';
import AddFarshel from '../../trades/importTrade/AddFarshel';
import React, { useState } from 'react';
import { selectidx, selectlanguage } from '../../../redux-toolkit/languagesSlice';
import { selectDarkMode } from '../../../redux-toolkit/darkModeSlice';
import { selectCurrentAccount, selectUser, selectUserAccounts, setTradesList } from '../../../redux-toolkit/userSlice';
import { selectMessages } from '../../../redux-toolkit/messagesSlice';
import { selectTrade, setTrade } from '../../../redux-toolkit/tradeSlice';
import api from '../../../api/api';
import { msgType } from '../../../utils/messagesEnum';
import { msgNumber } from '../../../utils/msgNumbers';
import { getMsg } from '../../../utils/messeageUtils';
import { Label } from '@mui/icons-material';
import { sentenceCase } from 'sentence-case';
import { useToast } from 'react-toastify';
import ImageModal from '../../../components/ImageModal/ImageModal';

// import AddTrade from '../components/trades/addTrade/addTradeFormModal';
import AddTrade from "../../../components/trades/addTrade/addTradeFormModal";
import { setEditMode, setTradeForEdit } from '../../../redux-toolkit/editTradeFormSlice';

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

//Related to dialog error - has to be outside of the component
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export default function TradeTableRow(props) {

    const { trade } = props;
    console.log(trade.image);
    const [openmodalfarshel, setIsOpenFarshelmodal] = useState(false);

    //selectors
    const languageidx = useSelector(selectidx);
    const darkMode = useSelector(selectDarkMode);
    const isHebrew = useSelector(selectlanguage);
    const currentTrade = useSelector(selectTrade);
    const currentAccount = useSelector(selectCurrentAccount);

    const trades = currentAccount?.trades;
    //states
    const [openCommend, setCommendOpen] = useState(false);
    const [selectedComment, setSelectedComment] = useState('');
    const user = useSelector(selectUser);
    const [basicModal, setBasicModal] = useState(false);
    const toggleShow = () => setBasicModal(!basicModal);
    const [imageModalOpen, setImageModalOpen] = useState(false);

    //table config states:
    const [opendialog, setDialogOpen] = useState(false);
    const [accountIdToDelete, setAccountIdToDelete] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);



    const handleFileChange = (event) => {
        if (event.target.files.length > 0)
            setSelectedFile(event.target.files[0]);
    };


    const handleOpenFarshelModal = (trade) => {
        setIsOpenFarshelmodal(true);
    };
    const fileInputRef = React.useRef(null);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleClickDialogOpen = (accountId) => {
        setAccountIdToDelete(accountId);
        setDialogOpen(true);
    };


    const dispatch = useDispatch();

    const handleCellClick = (params) => {
        if (params.field === 'comments') {
            setSelectedComment(params.value);
            setCommendOpen(true);
        }
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleEditTradeEvent = () => {
        dispatch(setEditMode(true));
        dispatch(setTradeForEdit(trade));
    }

    const deleteTrade = async () => {
        const res = await api.post('/api/deleteTrade', { tradeId: trade._id, userId: user._id, accountId: currentAccount._id }, { headers: { Authorization: 'Bearer ' + user.accessToken } });
        dispatch(setTradesList(res.data))
        // notifyToast(getMsg(messages, msgType.success, msgNumber[14], languageidx).msgText, getMsg(messages, msgType.success, msgNumber[14], languageidx).msgType);
        // notifyToast("Delete trade Successfully", 'success');
        toggleShow();
    }

    const openImageModal = () => {
        setImageModalOpen(true);
        console.log("openning modal");
    }

    return (
        <TableRow
            hover
            key={trade._id}
            tabIndex={-1}
            role="checkbox"
            selected={trade}
        >

            <TableCell>
                {   //Display info button only for trades with tradeHistory.
                    (trade?.tradeHistory?.length) &&
                    <>
                        <IconButton size="large" color="inherit" onClick={() => handleOpenFarshelModal(trade)}>
                            <Iconify icon={'eva:info-outline'} />
                        </IconButton>
                        <>
                            {openmodalfarshel && <AddFarshel trade={trade} openModal={openmodalfarshel} handleOpenModal={setIsOpenFarshelmodal} />}
                        </>
                    </>
                }
            </TableCell>


            {isHebrew === false ?
                <TableCell component="th" scope="row" padding="none">
                    <Stack direction="row" alignItems="center" spacing={2}>
                        {formatDate(trade.entryDate)}
                    </Stack>
                </TableCell> :
                <TableCell onClick={handleCellClick("comments", trade?.comments)} align="center">{trade?.comments?.length !== 0 ? trade?.comments?.length > 20 ? `${trade?.comments?.substring(0, 20)}...` : trade?.comments : "לא זמין"}</TableCell>}

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
                                deleteTrade(); // Now proceed with the deletion
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
                            handleEditTradeEvent();
                        }}
                    >
                        ערוך
                    </button>
                </TableCell>}


            <TableCell align="center">
                {trade.entryPrice}
            </TableCell>

            <TableCell align="center">
                {trade.stopPrice}
            </TableCell>

            <TableCell align="center">
                {trade.exitPrice}
            </TableCell>


            <TableCell align="center">{trade.netROI ? trade.netROI + "%" : "0.00" + "%"}</TableCell>


            {isHebrew === false ?
                <TableCell align="center">{trade.longShort}</TableCell> :
                <TableCell align="center">{trade.netPnL}$</TableCell>}

            {isHebrew === false ?
                <TableCell align="center">{trade.contracts}</TableCell> :
                <TableCell align="center">
                    {trade.commission ? trade.commission + "$" : "לא זמין"}
                </TableCell>}


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
                        <IconButton size="large" color="inherit" onClick={openImageModal} >
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
                            handleEditTradeEvent();
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
                                deleteTrade(); // Now proceed with the deletion
                                handleDialogClose(); // Close the dialog first
                            }} color="primary">
                                Confirm
                            </Button>
                        </DialogActions>
                    </Dialog>
                </TableCell> :
                <TableCell align="center">{trade.symbol}</TableCell>}
            {imageModalOpen && <ImageModal open={imageModalOpen} handleClose={() => { setImageModalOpen(false) }} imageData={trade.image} tradeComments={trade.comments} />}

            {isHebrew === false ?

                <TableCell onClick={handleCellClick("comments", trade?.comments)} align="center">{trade?.comments?.length !== 0 ? trade?.comments?.length > 20 ? `${trade?.comments?.substring(0, 20)}...` : trade?.comments : "N/A"}</TableCell>
                : <TableCell component="th" scope="row" padding="none">
                    <Stack direction="row" alignItems="center" spacing={2}>
                        {formatDate(trade.entryDate)}
                    </Stack>
                </TableCell>}
        </TableRow>
    );
}