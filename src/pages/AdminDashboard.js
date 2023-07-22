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
                    
                            
                            <IconButton  aria-label="Delete">
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
    



    // Function to handle user update
    const handleUpdateUser = (userId) => {
        // Implement the logic to update the user based on the userId
        console.log(`Updating user with ID ${userId}`);
    };

    // Function to handle user registration (only for admin users)
    const handleRegisterUser = (email) => {
        // Implement the logic to register a new user with the given email
        console.log(`Registering new user with email ${email}`);
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

            <UsersList users={users} onDelete={handleDeleteUser} onUpdate={handleUpdateUser} />
            {/* Display UserRegistration component only for admin users */}
            {/* Replace 'isAdmin' with your logic to check if the user is an admin */}
            {/* {isAdmin && <UserRegistration onRegister={handleRegisterUser} />} */}

        </Container>
    );
};

export default UsersManagementPage;
