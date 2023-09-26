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
import { selectlanguage } from '../../../redux-toolkit/languagesSlice';
import { selectDarkMode } from '../../../redux-toolkit/darkModeSlice';



//Related to dialog error - has to be outside of the component
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export default function TradeTableRow(props) {

    const { trade, } = props;

    const [openmodalfarshel, setIsOpenFarshelmodal] = useState(false);
    //selectors
    const isHebrew = useSelector(selectlanguage);
    const darkMode = useSelector(selectDarkMode);



    const handleOpenFarshelModal = (trade) => {
        setIsOpenFarshelmodal(true);
    };

    const dispatch = useDispatch();

    return (
        <TableRow
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
                {openmodalfarshel && <AddFarshel trade={trade} openModal={openmodalfarshel} handleOpenModal={setIsOpenFarshelmodal} />}
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

                <TableCell onClick={handleCellClick("comments", trade?.comments)} align="center">{trade?.comments?.length !== 0 ? trade?.comments?.length > 20 ? `${trade?.comments?.substring(0, 20)}...` : trade?.comments : "N/A"}</TableCell>
                : <TableCell component="th" scope="row" padding="none">
                    <Stack direction="row" alignItems="center" spacing={2}>
                        {formatDate(trade.entryDate)}
                    </Stack>
                </TableCell>}
        </TableRow>
    );
}