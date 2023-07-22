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

} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'; // Import DeleteIcon
import EditIcon from '@mui/icons-material/Edit'; // Import EditIcon
import UsersManage from '../components/createUser/createUser';
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

import { Grid } from 'rsuite';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};




// Component to display existing users
const UsersList = ({ users, onDelete, onUpdate }) => (

    <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {users.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>

                        <TableCell>


                            <IconButton aria-label="Delete">
                                <DeleteIcon onClick={() => onDelete(user._id)} />
                            </IconButton>

                            <IconButton onClick={() => onUpdate(user._id)} aria-label="Edit">
                                <EditIcon />
                            </IconButton>

                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
);

// Main component for Users Management Page
const UsersManagementPage = () => {

    const [openmodal, setIsOpenmodal] = useState(false);
    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState(null);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [licenseTime, setLicenseTime] = useState(1);

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);



    useEffect(() => {
        fetchUsers();
    }, [])


    const handleOpenModal = (tradeId) => {
        setIsOpenmodal(true);
    };


    const showToast = useToast();

    const notifyToast = (Msg, Type) => {

        showToast(Msg, Type);
    }



    const handleDeleteUser = async (id) => {

        const token = localStorage.getItem("token");
        try {
            console.log(id);
            // Assuming the correct endpoint is '/api/auth/deleteUser'
            await api.delete('/api/auth/deleteUser', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: { id }, // Make sure this is the correct format for the API
            });

            notifyToast(`Delete account - ${id}`, 'warning');

            // Optionally, you can fetch the updated list of users after deletion

        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };





    const handleopenEditUser = (userId) => {
        setUserId(userId);
        handleOpen();
    };



    const handleUpdateUser = async () => {

        console.log(userId);
        console.log(username);
        console.log(email);  
        console.log(licenseTime);
        
        const token = localStorage.getItem("token");
        try {
            await api.put('/api/auth/updateUser', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: { userId }, 
            });

            notifyToast(`update account - ${userId}`, 'warning');

        } catch (error) {
            console.error('Failed to update user:', error);
        }

    };


    const fetchUsers = () => {
        const token = localStorage.getItem("token");
        api
            .get('/api/auth/users', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((res) => {
                setUsers(prev => res.data);
            })
    }

    return (

        <Container maxWidth="lg">
            <ToastContainer />
            <Typography variant="h4" align="center" mt={4}>
                Users Management
            </Typography>

            <Button onClick={handleOpenModal} startIcon={<Iconify icon="eva:plus-fill" />} variant='contained'>Create User</Button>
            {openmodal && <UsersManage openModal={openmodal} handleFetchUsers={fetchUsers} handleOpenModal={setIsOpenmodal} notifyToast={notifyToast} />}
            {(openmodal) === true ? <UsersManage
                openModal={openmodal}
                handleOpenModal={setIsOpenmodal}
                notifyToast={notifyToast}
            /> : null}

            <UsersList users={users} onDelete={handleDeleteUser} onUpdate={handleopenEditUser} />
            {/* Display UserRegistration component only for admin users */}
            {/* Replace 'isAdmin' with your logic to check if the user is an admin */}
            {/* {isAdmin && <UserRegistration onRegister={handleRegisterUser} />} */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" style={{ marginBottom: '20px' }}>
                        Update User
                    </Typography>
                    <div>

                        <TextField
                            label="Username"
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
                            label="Email"
                            style={{ marginLeft: '15px' }}
                            // Update the state when the input changes
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <TextField
                            id="standard-basic"
                            
                            label="licenseTime"
                            variant="standard"
                            type="date"
                            // Update the state when the input changes
                            value={licenseTime}
                            onChange={(e) => setLicenseTime(e.target.value)}
                        />


                        <Grid container justify="flex-end" style={{ marginRight: '15px' }}>

                            <Button onClick={handleUpdateUser} variant="contained" >
                                Update
                            </Button>
                        </Grid>

                    </div>
                </Box>
            </Modal>
        </Container>
    );
};

export default UsersManagementPage;
