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
import api from '../../api/api';
import { ToastContainer, } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentAccount, selectUser, selectUserAccounts, setCurrentAccount, updateAccountList } from '../../redux-toolkit/userSlice';
import MultipleSelectPlaceholder from './selectAccount';


//Related to dialog error - has to be outside of the component
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function BasicModal() {

    //const toggleShow = () => setBasicModal(!basicModal);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [editMode, setEditMode] = React.useState(false);
    const [accountInfoInEdit, setAccountInfoInEdit] = React.useState('');
    const user = useSelector(selectUser);
    const currentAccount = useSelector(selectCurrentAccount);
    const dispatch = useDispatch();
    const accounts = useSelector(selectUserAccounts);


    const getAccountInfoById = (accountList, accountid) => {
        const selectedAccount = accountList.find(account => account._id === accountid);
        setAccountInfoInEdit(selectedAccount);
    };



    const handleCloseMenu = async (accountId) => {
        const token = localStorage.getItem("token");
        console.log("token", token);
        try {
            // Prepare the request body data to be sent with the DELETE request
            const requestData = {
                accountId: accountId,
                userId: user._id,
            };

            // Send the DELETE request with the data in the request body and authorization header
            const response = await api.delete('/api/deleteAccount', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: requestData,
            });
            const accounts = response.data;

            dispatch(updateAccountList(accounts));

            const account = accounts.find(account => account._id == currentAccount._id);
            console.log('accounts', accounts, 'account', account);
            if (!account && accounts.length > 0) {
                dispatch(setCurrentAccount(accounts[0]));
            } else {
                dispatch(setCurrentAccount(null));
            }

            // Notify and fetch accounts
            notifyToast(`Delete Account - ${accountId}`, 'warning');
            setAnchorEl(null);
        } catch (error) {
            // Handle errors if any
            console.error(error);
        }
    };




    const handleEditCloseMenu = async (accountId) => {
        getAccountInfoById(accounts, accountId);
        setEditMode(true);
        setIsOpenmodal(true);

    }


    const [opendialog, setDialogOpen] = useState(false);
    const [accountIdToDelete, setAccountIdToDelete] = useState('');


    
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


    const [openmodal, setIsOpenmodal] = useState(false);
    const handleOpenCreateAccountModal = (tradeId) => {
        setEditMode(false);
        setIsOpenmodal(true);
    };


    const showToast = useToast();
    const notifyToast = (Msg, Type) => {

        showToast(Msg, Type);
    }

    const containerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    };



    return (


        <Container maxWidth="lg">
            <ToastContainer />


            <div style={containerStyle}>
                <Typography color="black" id="modal-modal-title" variant="h6" component="h2">
                    Accounts Management
                </Typography>
                <Button startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenCreateAccountModal} variant="contained">
                    Create Account
                </Button>
            </div>

            <Divider sx={{ my: 3, backgroundColor: 'grey' }} />
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                <TableContainer >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell >
                                    <Typography color="black" variant="subtitle1" fontWeight="bold">
                                        Name
                                    </Typography>
                                </TableCell>
                                <TableCell >   </TableCell>
                                <TableCell >   </TableCell>
                                <TableCell >   </TableCell>
                                <TableCell >   </TableCell>
                                <TableCell >   </TableCell>
                                <TableCell >   </TableCell>
                                <TableCell >
                                    <Typography color="black" variant="subtitle1" fontWeight="bold">
                                        Label
                                    </Typography>
                                </TableCell>
                                <TableCell >   </TableCell>
                                <TableCell >   </TableCell>
                                <TableCell >   </TableCell>
                                <TableCell >   </TableCell>
                                <TableCell >   </TableCell>
                                <TableCell >   </TableCell>
                                <TableCell >   <Typography color="black" variant="subtitle1" fontWeight="bold">
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
                                            <DialogTitle>{"Confirm Deletion"}</DialogTitle>
                                            <DialogContent>
                                                <DialogContentText id="alert-dialog-slide-description">
                                                    When deleting the account, all the trades under that account will be deleted. Are you sure?
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={handleDialogClose}>Cancel</Button>
                                                <Button onClick={() => {
                                                    handleCloseMenu(accountIdToDelete);

                                                    handleDialogClose(); // Close the dialog first
                                                }} color="primary">
                                                    Confirm
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
                </TableContainer>
            </div>

            <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ mt: 2 }}>


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

