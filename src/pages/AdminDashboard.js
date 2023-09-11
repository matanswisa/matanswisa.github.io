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
import { selectlanguage,selectidx } from '../redux-toolkit/languagesSlice';
import { selectUser } from '../redux-toolkit/userSlice';

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


//Related to dialog error - has to be outside of the component
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const UsersList = ({ users, onDelete, onUpdate }) => {
    const darkMode = useSelector(selectDarkMode);
    const isHebrew = useSelector(selectlanguage);
    const convertDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1; // Months are zero-indexed, so we add 1.
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    };


    const [opendialog, setDialogOpen] = useState(false);

    const handleClickDialogOpen = () => {
        setDialogOpen(true);
    };


    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    return (


        <TableContainer component={Paper} sx={{ mt: 3 }}>
            {isHebrew === false ?
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography style={{ color: darkMode ? '#fff' : '#000', }} variant="subtitle1" fontWeight="bold">
                                    Username
                                </Typography>

                            </TableCell>
                            <TableCell>
                                <Typography style={{ color: darkMode ? '#fff' : '#000', }} variant="subtitle1" fontWeight="bold">
                                    Email
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography style={{ color: darkMode ? '#fff' : '#000', }} variant="subtitle1" fontWeight="bold">
                                    License

                                </Typography></TableCell>
                            <TableCell>
                                <Typography style={{ color: darkMode ? '#fff' : '#000', }} variant="subtitle1" fontWeight="bold">
                                    Actions
                                </Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>

                                <TableCell>


                                    {user.username}


                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{convertDate(user.license)}</TableCell>
                                <TableCell>
                                    <IconButton aria-label="Delete">
                                        <DeleteIcon onClick={handleClickDialogOpen} />
                                    </IconButton>


                                    <IconButton onClick={() => onUpdate(user._id)} aria-label="Edit">
                                        <EditIcon />
                                    </IconButton>
                                    <Dialog
                                        open={opendialog}
                                        TransitionComponent={Transition}

                                        onClose={handleDialogClose}
                                        aria-describedby="alert-dialog-slide-description"
                                    >
                                        <DialogTitle>{isHebrew === false ? "Confirm Deletion" : "אישור מחיקה"}</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText id="alert-dialog-slide-description">
                                                {isHebrew === false ? "  Are you sure you want to delete this user?" : "האם אתה בטוח שברצונך למחוק משתמש זה?"}

                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={handleDialogClose}>  {isHebrew === false ? "Cancel" : "ביטול"}   </Button>
                                            <Button onClick={() => {
                                                onDelete(user._id);

                                                handleDialogClose(); // Close the dialog first
                                            }} color="primary">
                                                {isHebrew === false ? "Confirm" : "אישור"}
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table> :

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography style={{ color: darkMode ? '#fff' : '#000', }} variant="subtitle1" fontWeight="bold">
                                    פעולות  </Typography>

                            </TableCell>
                            <TableCell>
                                <Typography style={{ color: darkMode ? '#fff' : '#000', }} variant="subtitle1" fontWeight="bold">
                                    רישיון

                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography style={{ color: darkMode ? '#fff' : '#000', }} variant="subtitle1" fontWeight="bold">
                                    אימייל

                                </Typography></TableCell>
                            <TableCell>
                                <Typography style={{ color: darkMode ? '#fff' : '#000', }} variant="subtitle1" fontWeight="bold">
                                    שם משתמש
                                </Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>




                                <TableCell>
                                    <IconButton aria-label="Delete">
                                        <DeleteIcon onClick={handleClickDialogOpen} />
                                    </IconButton>


                                    <IconButton onClick={() => onUpdate(user._id)} aria-label="Edit">
                                        <EditIcon />
                                    </IconButton>
                                    <Dialog
                                        open={opendialog}
                                        TransitionComponent={Transition}

                                        onClose={handleDialogClose}
                                        aria-describedby="alert-dialog-slide-description"
                                    >
                                        <DialogTitle>{isHebrew === false ? "Confirm Deletion" : "אישור מחיקה"}</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText id="alert-dialog-slide-description">
                                                {isHebrew === false ? "  Are you sure you want to delete this user?" : "האם אתה בטוח שברצונך למחוק משתמש זה?"}

                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={handleDialogClose}>  {isHebrew === false ? "Cancel" : "ביטול"}   </Button>
                                            <Button onClick={() => {
                                                onDelete(user._id);

                                                handleDialogClose(); // Close the dialog first
                                            }} color="primary">
                                                {isHebrew === false ? "Confirm" : "אישור"}
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                </TableCell>
                                <TableCell>{convertDate(user.license)}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    {user.username}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>}


        </TableContainer>
    );
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
            // Assuming the correct endpoint is '/api/auth/deleteUser'
            await api.delete('/api/auth/deleteUser', {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`,
                },
                data: { id }, // Make sure this is the correct format for the API
            });
            fetchUsers();
            notifyToast(getMsg(messages, msgType.success, msgNumber[12],languageidx).msgText, getMsg(messages, msgType.success, msgNumber[12],languageidx).msgType);
            // notifyToast("Delete user Successfully ", 'success');

            // Optionally, you can fetch the updated list of users after deletion

        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };





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
            notifyToast(getMsg(messages, msgType.warnings, msgNumber[12],languageidx).msgText, getMsg(messages, msgType.warnings, msgNumber[12],languageidx).msgType);
            // notifyToast("Invalid email format", "warning");
            return false;
        }

        if (username.length < 8) {
            notifyToast(getMsg(messages, msgType.warnings, msgNumber[11],languageidx).msgText, getMsg(messages, msgType.warnings, msgNumber[11],languageidx).msgType);
            // notifyToast("user name less than 8 characters", "warning");
            return false;
        }

        if (!checkLicenseTime(licenseTime)) {
            notifyToast(getMsg(messages, msgType.warnings, msgNumber[10],languageidx).msgText, getMsg(messages, msgType.warnings, msgNumber[10],languageidx).msgType);
            // notifyToast("Invalid date! Please choose a future date.", "warning");
            return false;
        }


        return true;
    }






    const handleUpdateUser = async () => {

        await api.put('/api/auth/updateUser', {
            data: { userId, username, email, licenseTime },
        }, {
            headers: {
                Authorization: `Bearer ${user.accessToken}`,
            }
        });
        fetchUsers();
        handleClose();
        notifyToast(getMsg(messages, msgType.success, msgNumber[13],languageidx).msgText, getMsg(messages, msgType.success, msgNumber[13],languageidx).msgType);
    }





    function fetchUsers(user) {
        api
            .get('/api/auth/users', {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`,
                }
            }).then((res) => {

                setUsers([...res.data]);

            })
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
                <UsersList users={users} onDelete={handleDeleteUser} onUpdate={handleopenEditUser} />
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
        </Container >
    );
};

export default UsersManagementPage;
