import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {
    Divider, IconButton, Stack, Container,
    DialogTitle,
    DialogContent,
    DialogActions,
    Slide,
    Dialog
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import DialogContentText from '@mui/material/DialogContentText';
import ChildModal from './createAccount'
import DeleteIcon from '@mui/icons-material/Delete'; // Import DeleteIcon
import EditIcon from '@mui/icons-material/Edit'; // Import EditIcon
import { useState, useRef, useEffect } from 'react';
import Iconify from '../../components/iconify/Iconify';
import useToast from '../../hooks/alert';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentAccount, selectUser, selectUserAccounts, setCurrentAccount, updateAccountList } from '../../redux-toolkit/userSlice';
import MultipleSelectPlaceholder from './selectAccount';
import { selectMessages } from '../../redux-toolkit/messagesSlice';
import { getMsg } from '../../utils/messeageUtils';
import { msgType } from '../../utils/messagesEnum.js';
import { msgNumber } from '../../utils/msgNumbers.js';

import { selectlanguage, selectidx } from '../../redux-toolkit/languagesSlice';
import { selectDarkMode } from '../../redux-toolkit/darkModeSlice';
import axiosInstance from '../../utils/axiosService';
//Related to dialog error - has to be outside of the component
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});



//--------------------------------------------This modal show AccountManagment Page -------------------------------------------//

export default function BasicModal() {

    //------------------------------------------------   States ----------------------------------------------------- //
    const isHebrew = useSelector(selectlanguage);
    const languageidx = useSelector(selectidx);

    const darkMode = useSelector(selectDarkMode);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [editMode, setEditMode] = React.useState(false);
    const [accountInfoInEdit, setAccountInfoInEdit] = React.useState('');
    const user = useSelector(selectUser);
    const currentAccount = useSelector(selectCurrentAccount);
    const dispatch = useDispatch();
    const accounts = useSelector(selectUserAccounts);
    const messages = useSelector(selectMessages);
    const [opendialog, setDialogOpen] = useState(false);
    const [accountIdToDelete, setAccountIdToDelete] = useState('');
    const [openmodal, setIsOpenmodal] = useState(false);


    const getAccountInfoById = (accountList, accountid) => {
        const selectedAccount = accountList.find(account => account._id === accountid);
        setAccountInfoInEdit(selectedAccount);
    };

    //--------------- handle Delete account after user press "confirm" button when want delete account----------------- //

    const handleCloseMenu = async (accountId) => {
        try {
            // Prepare the request body data to be sent with the DELETE request
            const requestData = {
                accountId: accountId,
                userId: user._id,
            };

            // Send the DELETE request with the data in the request body and authorization header
            const response = await axiosInstance.delete('/api/deleteAccount', {
                data: requestData,
            });
            const accounts = response.data;

            dispatch(updateAccountList(accounts));

            if (currentAccount) {
                const account = accounts.find(account => account._id == currentAccount._id);

                if (!account && accounts.length > 0) {
                    dispatch(setCurrentAccount(accounts[0]));
                } else {
                    dispatch(setCurrentAccount(null));
                }
            } else if (accounts.length > 0) {
                dispatch(setCurrentAccount(accounts[0]));
            }


            // Notify and fetch accounts
            notifyToast(getMsg(messages, msgType.success, msgNumber[1], languageidx).msgText, getMsg(messages, msgType.success, msgNumber[1], languageidx).msgType);
            setAnchorEl(null);
        } catch (error) {
            // Handle errors if any
            console.error(error);
        }
    };

    //------------------------------------------------   handle dialog states ----------------------------------------------------- //
    const handleClickDialogOpen = (accountId) => {
        setAccountIdToDelete(accountId);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    //------------------------------------------------   handle modals states ----------------------------------------------------- //
    const handleEditCloseMenu = async (accountId) => {
        getAccountInfoById(accounts, accountId);
        setEditMode(true);
        setIsOpenmodal(true);
    }
    const handleOpenCreateAccountModal = (tradeId) => {
        setEditMode(false);
        setIsOpenmodal(true);
    };

    //------------------------------------------------   handle alert -------------------------------------------------------------- //

    const showToast = useToast();
    const notifyToast = (Msg, Type) => {

        showToast(Msg, Type);
    }

    //------------------------------------------------   style of account page -------------------------------------------------------------- //
    const containerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    };


    return (
        <Container maxWidth="lg">
            <ToastContainer />


            <div style={containerStyle}>
                <Typography style={{ color: darkMode ? '#fff' : '#000', }} id="modal-modal-title" variant="h6" component="h2">
                    {isHebrew === false ? " Accounts Management" : "ניהול חשבונות"}

                </Typography>
                <Button startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenCreateAccountModal} variant="contained" style={{ backgroundColor: darkMode ? '#1ba6dc' : "", color: darkMode ? 'white' : "", }}>
                    {isHebrew === false ? "Create Account" : "יצירת חשבון"}

                </Button>
            </div>

            <Divider sx={{ my: 3, backgroundColor: 'grey' }} />
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>

                {isHebrew === false ?
                    <TableContainer >
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell >
                                        <Typography style={{ color: darkMode ? '#fff' : '#000', }} variant="subtitle1" fontWeight="bold">
                                            Account name

                                        </Typography>
                                    </TableCell>
                                    <TableCell >   </TableCell>
                                    <TableCell >   </TableCell>
                                    <TableCell >   </TableCell>
                                    <TableCell >   </TableCell>
                                    <TableCell >   </TableCell>
                                    <TableCell >   </TableCell>
                                    <TableCell >
                                        <Typography style={{ color: darkMode ? '#fff' : '#000', }} variant="subtitle1" fontWeight="bold">
                                            Label

                                        </Typography>
                                    </TableCell>
                                    <TableCell >   </TableCell>
                                    <TableCell >   </TableCell>
                                    <TableCell >   </TableCell>
                                    <TableCell >   </TableCell>
                                    <TableCell >   </TableCell>
                                    <TableCell >   </TableCell>
                                    <TableCell >   <Typography style={{ color: darkMode ? '#fff' : '#000', }} variant="subtitle1" fontWeight="bold">
                                        Actions

                                    </Typography></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {accounts.map((account) => (
                                    <TableRow key={account._id}>
                                        <TableCell style={{}}>{account.AccountName}</TableCell>
                                        <TableCell >   </TableCell>
                                        <TableCell >   </TableCell>
                                        <TableCell >   </TableCell>
                                        <TableCell >   </TableCell>
                                        <TableCell >   </TableCell>
                                        <TableCell >   </TableCell>
                                        <TableCell style={{ backgroundColor: account.Label, width: '1%', }}></TableCell>
                                        <TableCell >   </TableCell>
                                        <TableCell ></TableCell>
                                        <TableCell >   </TableCell>
                                        <TableCell >   </TableCell>
                                        <TableCell >   </TableCell>
                                        <TableCell >   </TableCell>
                                        <TableCell >


                                            <IconButton aria-label="Delete">
                                                <DeleteIcon onClick={() => handleClickDialogOpen(account._id)} />
                                            </IconButton>


                                            <Dialog
                                                open={opendialog}
                                                TransitionComponent={Transition}

                                                onClose={handleDialogClose}
                                                aria-describedby="alert-dialog-slide-description"
                                            >
                                                <DialogTitle>    {isHebrew === false ? "Confirm Deletion" : "אישור מחיקה"}</DialogTitle>
                                                <DialogContent>
                                                    <DialogContentText id="alert-dialog-slide-description">
                                                        {isHebrew === false ? " When deleting the account, all the trades under that account will be deleted. Are you sure?" : "בעת מחיקת חשבון זה כול העסקאות תחת אותו חשבון ימחקו לצמיתות האם אתה בטוח שברצונך לבצע פעולה זאת?"}


                                                    </DialogContentText>
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button onClick={handleDialogClose}>   {isHebrew === false ? "Cancel" : "ביטול"}</Button>
                                                    <Button onClick={() => {
                                                        handleCloseMenu(accountIdToDelete);

                                                        handleDialogClose(); // Close the dialog first
                                                    }} color="primary">
                                                        {isHebrew === false ? "Confirm" : "אישור"}

                                                    </Button>
                                                </DialogActions>
                                            </Dialog>
                                            <IconButton onClick={() => handleEditCloseMenu(account._id)} aria-label="Edit">
                                                <EditIcon />
                                            </IconButton>

                                        </TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer> :
                    //hebrew struct :
                    <TableContainer >
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell >
                                        <Typography style={{ color: darkMode ? '#fff' : '#000', }} variant="subtitle1" fontWeight="bold">
                                            פעולות
                                        </Typography>
                                    </TableCell>
                                    <TableCell >   </TableCell>
                                    <TableCell >   </TableCell>
                                    <TableCell >   </TableCell>
                                    <TableCell >   </TableCell>
                                    <TableCell >   </TableCell>
                                    <TableCell >   </TableCell>
                                    <TableCell >
                                        <Typography style={{ color: darkMode ? '#fff' : '#000', }} variant="subtitle1" fontWeight="bold">
                                            סימן

                                        </Typography>
                                    </TableCell>
                                    <TableCell >   </TableCell>
                                    <TableCell >   </TableCell>
                                    <TableCell >   </TableCell>
                                    <TableCell >   </TableCell>
                                    <TableCell >   </TableCell>
                                    <TableCell >   </TableCell>
                                    <TableCell >   <Typography style={{ color: darkMode ? '#fff' : '#000', }} variant="subtitle1" fontWeight="bold">
                                        שם חשבון

                                    </Typography></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {accounts.map((account) => (
                                    <TableRow key={account._id}>
                                        <TableCell >

                                            <IconButton aria-label="Delete">
                                                <DeleteIcon onClick={() => handleClickDialogOpen(account._id)} />
                                            </IconButton>


                                            <Dialog
                                                open={opendialog}
                                                TransitionComponent={Transition}

                                                onClose={handleDialogClose}
                                                aria-describedby="alert-dialog-slide-description"
                                            >
                                                <DialogTitle>    {isHebrew === false ? "Confirm Deletion" : "אישור מחיקה"}</DialogTitle>
                                                <DialogContent>
                                                    <DialogContentText id="alert-dialog-slide-description">
                                                        {isHebrew === false ? " When deleting the account, all the trades under that account will be deleted. Are you sure?" : "בעת מחיקת חשבון זה כול העסקאות תחת אותו חשבון ימחקו לצמיתות האם אתה בטוח שברצונך לבצע פעולה זאת?"}


                                                    </DialogContentText>
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button onClick={handleDialogClose}>   {isHebrew === false ? "Cancel" : "ביטול"}</Button>
                                                    <Button onClick={() => {
                                                        handleCloseMenu(accountIdToDelete);

                                                        handleDialogClose(); // Close the dialog first
                                                    }} color="primary">
                                                        {isHebrew === false ? "Confirm" : "אישור"}

                                                    </Button>
                                                </DialogActions>
                                            </Dialog>
                                            <IconButton onClick={() => handleEditCloseMenu(account._id)} aria-label="Edit">
                                                <EditIcon />
                                            </IconButton>

                                        </TableCell>
                                        <TableCell >   </TableCell>
                                        <TableCell >   </TableCell>
                                        <TableCell >   </TableCell>
                                        <TableCell >   </TableCell>
                                        <TableCell >   </TableCell>
                                        <TableCell >   </TableCell>
                                        <TableCell style={{ backgroundColor: account.Label, width: '1%', }}></TableCell>
                                        <TableCell >   </TableCell>
                                        <TableCell ></TableCell>
                                        <TableCell >   </TableCell>
                                        <TableCell >   </TableCell>
                                        <TableCell >   </TableCell>
                                        <TableCell >   </TableCell>
                                        <TableCell style={{}}>{account.AccountName}</TableCell>


                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>}
            </div>

            <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ mt: 2 }}>

                {/* open create account modal when editmode = false    ***OR***    open edit account modal when edit  = true */}
                {openmodal && editMode === false && <ChildModal edit={editMode} notifyToast={notifyToast} openModal={openmodal} handleOpenModal={setIsOpenmodal} />}
                {(openmodal) === true && editMode === true ? <ChildModal
                    openModal={openmodal}
                    handleOpenModal={setIsOpenmodal}
                    notifyToast={notifyToast}
                    edit={editMode}
                    accountInfo={accountInfoInEdit}


                /> : null}


            </Stack>

        </Container>
    );
}

