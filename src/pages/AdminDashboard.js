import React from 'react';
import {
    Button,
    Container,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Slide

} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'; // Import DeleteIcon
import EditIcon from '@mui/icons-material/Edit'; // Import EditIcon
import UsersManage from '../components/users/createUser';
import Iconify from '../components/iconify';
import { useEffect, useState } from 'react';
import useToast from '../hooks/alert'
import { ToastContainer, } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api/api';
import AccountCircle from '@mui/icons-material/AccountCircle';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import DialogContentText from '@mui/material/DialogContentText';

import { Grid } from 'rsuite';


import { useDispatch, useSelector } from 'react-redux';
import { selectMessages } from '../redux-toolkit/messagesSlice';

import { getMsg } from '../utils/messeageUtils';
import { msgType } from '../utils/messagesEnum.js';
import { msgNumber } from '../utils/msgNumbers.js';

import { selectDarkMode } from '../redux-toolkit/darkModeSlice';
import { selectlanguage, selectidx } from '../redux-toolkit/languagesSlice';
import { selectUser } from '../redux-toolkit/userSlice';
import axiosInstance from '../utils/axiosService';
import { UsersList } from '../components/UsersList/UsersList.jsx';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

// Main component for Users Management Page
const UsersManagementPage = () => {

    const isHebrew = useSelector(selectlanguage);
    const languageidx = useSelector(selectidx);
    const darkMode = useSelector(selectDarkMode);

    const messages = useSelector(selectMessages);

    const [openmodal, setIsOpenmodal] = useState(false);
    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState(null);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [licenseTime, setLicenseTime] = useState(1);

    const [open, setOpen] = React.useState(false);
    const [openDeletedialog, setOpenDeletedialog] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const user = useSelector(selectUser);



    useEffect(() => {
        fetchUsers(user);
    }, [openmodal])


    const handleOpenModal = (tradeId) => {
        setIsOpenmodal(true);
    };


    const showToast = useToast();

    const notifyToast = (Msg, Type) => {

        showToast(Msg, Type);
    }

    const handleDeleteUser = async (id) => {
        try {
            console.log(id)
            // Assuming the correct endpoint is '/api/auth/deleteUser'
            await axiosInstance.delete('/api/auth/deleteUser', { data: { userId: id } });

            await fetchUsers();
            notifyToast(getMsg(messages, msgType.success, msgNumber[12], languageidx).msgText, getMsg(messages, msgType.success, msgNumber[12], languageidx).msgType);
            // notifyToast("Delete user Successfully ", 'success');

            // Optionally, you can fetch the updated list of users after deletion

        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };



    // this function create a msg of 2 types : "Trial" and "Regular"  , after create the msg struct , send email with this info of user properties to user created. 
    const handleSendMailAfterEdit = async () => {

        let welcomeMessage;
        let Editmsg = false;

        welcomeMessage = `Welcome to TradeExalt!
        Your account membership has renewd, with the same login credentials.
       
        License Expiration Date: ${licenseTime}
        
        For security purposes, we recommend changing your password after your first login. To get started, simply visit www.TradeExalt.co.il and sign in using your credentials.  As a user of our TradeExalt app, 

        it's essential that you carefully read and understand our Terms of Service and Privacy Policy. By accepting these terms and conditions, you also agree to be bound by the terms of the TradeExalt website.
    
        Please take the time to review the complete Terms of Service and Privacy Policy provided with this email. 
        
        !Happy trading 
        
        ,Best regards 
        TradeExalt Team`;


        const data = {
            to: email,
            subject: 'Welcome to TradeExalt!',
            text: welcomeMessage,
            isTrial: Editmsg,

        }

        await axiosInstance.post('/api/sendEmail', data).then((res) => {
            notifyToast(getMsg(messages, msgType.success, msgNumber[7], languageidx).msgText, getMsg(messages, msgType.success, msgNumber[7], languageidx).msgType);
            //   notifyToast("mail Send successfully", "success");
        }).catch((err) => {
            notifyToast(getMsg(messages, msgType.errors, msgNumber[8], languageidx).msgText, getMsg(messages, msgType.errors, msgNumber[8], languageidx).msgType);
            // notifyToast("Mail not send", "error");
            return false;
        })

    }




    const handleopenEditUser = (userId) => {
        setUserId(userId);
        getUserById(userId);
        handleOpen();
    };


    const getUserById = (userId) => {

        const user = users.find((user) => user._id === userId);

        setUsername(user.username);
        setEmail(user.email);
        setLicenseTime(user.license.split('T')[0]);
    }



    const checkLicenseTime = (licenseTime) => {
        // Get the current date
        const currentDate = new Date();
        // Convert the input date to a Date object
        const inputDate = new Date(licenseTime);
        // Compare the input date with the current date
        if (inputDate <= currentDate) {
            // If the input date is in the past or is the same as the current date, return false
            return false;
        } else {
            // Otherwise, the input date is in the future, return true
            return true;
        }
    };

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email !== '' && !emailRegex.test(email)) {
            notifyToast(getMsg(messages, msgType.warnings, msgNumber[12], languageidx).msgText, getMsg(messages, msgType.warnings, msgNumber[12], languageidx).msgType);
            // notifyToast("Invalid email format", "warning");
            return false;
        }

        if (username.length < 8) {
            notifyToast(getMsg(messages, msgType.warnings, msgNumber[11], languageidx).msgText, getMsg(messages, msgType.warnings, msgNumber[11], languageidx).msgType);
            // notifyToast("user name less than 8 characters", "warning");
            return false;
        }

        if (!checkLicenseTime(licenseTime)) {
            notifyToast(getMsg(messages, msgType.warnings, msgNumber[10], languageidx).msgText, getMsg(messages, msgType.warnings, msgNumber[10], languageidx).msgType);
            // notifyToast("Invalid date! Please choose a future date.", "warning");
            return false;
        }


        return true;
    }


    const handleUpdateUser = async () => {

        let res = checkLicenseTime(licenseTime);

        if (!res) {

            notifyToast(getMsg(messages, msgType.errors, msgNumber[9], languageidx).msgText, getMsg(messages, msgType.errors, msgNumber[13], languageidx).msgType);
            return; // Don't proceed with the update
        } else {
            try {
                await axiosInstance.put('/api/auth/updateUser', {
                    data: { userId, username, email, licenseTime },
                });
                fetchUsers();
                handleSendMailAfterEdit();
                handleClose();
                notifyToast(getMsg(messages, msgType.success, msgNumber[13], languageidx).msgText, getMsg(messages, msgType.success, msgNumber[13], languageidx).msgType);
            } catch (error) {

                if (error.response && error.response.status === 400) {
                    notifyToast(getMsg(messages, msgType.errors, msgNumber[10], languageidx).msgText, getMsg(messages, msgType.errors, msgNumber[10], languageidx).msgType);
                }
                //    if (error.response && error.response.status === 400) {
                //     const errorMessage = error.response.data; // This should contain the error message
                //     console.log("Backend Error Message:", errorMessage);
                //     // You can use this errorMessage as needed in your frontend
                // }
            }

        }
    }



    function fetchUsers() {
        axiosInstance
            .get('/api/auth/users').then((res) => {

                setUsers([...res.data]);

            })
    }

    const containerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    };

    const handleDeleteUserDialogOpen = (userId) => {
        setUserId(userId)
        setOpenDeletedialog(true);

    }


    const handleDeleteUserDialogClose = () => {
        setOpenDeletedialog(false);
    };

    return (

        <Container maxWidth="lg">
            <ToastContainer />

            <div style={containerStyle}>

                <Typography style={{ color: darkMode ? '#fff' : '#000', }} id="modal-modal-title" variant="h6" component="h2">
                    {isHebrew === false ? " Users Management" : "ניהול משתמשים"}
                </Typography>
                <Button onClick={handleOpenModal} startIcon={<Iconify icon="eva:plus-fill" />} variant='contained' style={{ backgroundColor: darkMode ? '#1ba6dc' : "", color: darkMode ? 'white' : "", }}>  {isHebrew === false ? "Create User" : "יצירת משתמש"}
                </Button>
            </div >



            {openmodal && <UsersManage openModal={openmodal} fetchUsers={fetchUsers} handleOpenModal={setIsOpenmodal} notifyToast={notifyToast} />}
            {
                (openmodal) === true ? <UsersManage
                    openModal={openmodal}
                    handleOpenModal={setIsOpenmodal}
                    notifyToast={notifyToast}
                /> : null
            }

            <Divider sx={{ my: 3, backgroundColor: 'grey' }} />
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                <UsersList users={users} onDelete={handleDeleteUserDialogOpen} onUpdate={handleopenEditUser} />
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" style={{ marginBottom: '20px' }}>
                        {isHebrew === false ? "Update User" : "עדכון משתמש"}

                    </Typography>
                    <div>

                        <TextField
                            label={isHebrew === false ? "Username" : "שם משתמש"}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircle />
                                    </InputAdornment>
                                ),
                            }}
                            // Update the state when the input changes
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <TextField
                            label={isHebrew === false ? "Email" : "אימייל"}
                            style={{ marginLeft: '15px' }}
                            // Update the state when the input changes
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <TextField
                            id="standard-basic"
                            label={isHebrew === false ? "licenseTime" : "תוקף רישיון"}

                            variant="standard"
                            type="date"
                            // Update the state when the input changes
                            value={licenseTime}
                            onChange={(e) => setLicenseTime(e.target.value)}
                        />


                        <Grid container justify="flex-end" style={{ marginRight: '15px' }}>

                            <Button onClick={handleUpdateUser} variant="contained" >
                                {isHebrew === false ? "Update" : "עדכן"}

                            </Button>
                        </Grid>

                    </div>
                </Box>
            </Modal>

            <Modal
                open={openDeletedialog}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Dialog
                    open={openDeletedialog}
                    TransitionComponent={Transition}
                    onClose={handleDeleteUserDialogClose}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle>{isHebrew === false ? "Confirm Deletion" : "אישור מחיקה"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            {isHebrew === false ? "  Are you sure you want to delete this user?" : "האם אתה בטוח שברצונך למחוק משתמש זה?"}

                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDeleteUserDialogClose}>  {isHebrew === false ? "Cancel" : "ביטול"}   </Button>
                        <Button onClick={() => {
                            handleDeleteUser(userId);
                            handleDeleteUserDialogClose(); // Close the dialog first
                        }} color="primary">
                            {isHebrew === false ? "Confirm" : "אישור"}
                        </Button>
                    </DialogActions>
                </Dialog>

            </Modal>
        </Container >
    );
};

export default UsersManagementPage;
