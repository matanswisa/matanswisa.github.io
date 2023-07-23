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
import { Divider, IconButton, Menu, MenuItem, Stack ,Container} from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import ChildModal from './createAccount'


import { useState, useRef, useEffect } from 'react';


import useToast from '../../hooks/alert';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../api/api';
import { ToastContainer, } from 'react-toastify';



export default function BasicModal() {

    //const toggleShow = () => setBasicModal(!basicModal);
    const [accounts, setAccounts] = useState([]);
    const [anchorEl, setAnchorEl] = React.useState(null);

    console.log(accounts);
    useEffect(() => {
        fetchAccounts();

    }, []);



    const fetchAccounts = async () => {
        try {
            const response = await api.get('/api/accounts');
            setAccounts(response.data);


        } catch (error) {
            console.error(error);
        }
    };



    const handleCloseMenu = async (accountId) => {


        await api.delete('/api/deleteAccount', { data: { accountId } });
        notifyToast(`Delete Account - ${accountId}`, 'warning');



        setAnchorEl(null);
    }




    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };


    const [openmodal, setIsOpenmodal] = useState(false);
    const handleOpenCreateAccountModal = (tradeId) => {
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
                    <Button onClick={handleOpenCreateAccountModal} variant="contained">
                        Create Account
                    </Button>
                </div>

                <Divider sx={{ my: 3, backgroundColor: 'grey' }} />
                <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell >
                                        <Typography color="black" variant="subtitle1" fontWeight="bold">
                                            Name
                                        </Typography>
                                    </TableCell>
                              
                                    <TableCell >
                                        <Typography color="black" variant="subtitle1" fontWeight="bold">
                                            Label
                                        </Typography>
                                    </TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {accounts.map((account) => (
                                    <TableRow key={account._id}>
                                        <TableCell style={{ fontSize: '17px', color: 'black' }}>{account.AccountName}</TableCell>
                                        <TableCell style={{ backgroundColor: account.Label, width: '1%' , }}></TableCell>
                                        <TableCell > 
                                            <IconButton
                                                onClick={handleClick}
                                                aria-controls="edit-menu"
                                                aria-haspopup="true"
                                                aria-label="Edit"
                                            >
                                                <MoreVert />
                                            </IconButton>
                                            <Menu
                                                id="edit-menu"
                                                anchorEl={anchorEl}
                                                open={Boolean(anchorEl)}
                                                onClose={handleCloseMenu}
                                                MenuListProps={{
                                                    'aria-labelledby': 'edit-menu',
                                                }}
                                            >
                                                <MenuItem onClick={handleCloseMenu}>Edit</MenuItem>

                                                <MenuItem onClick={() => handleCloseMenu(account._id)}>Delete</MenuItem>

                                            </Menu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>

                <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ mt: 2 }}>


                    {openmodal && <ChildModal openModal={openmodal} handleOpenModal={setIsOpenmodal} />}
                    {(openmodal) === true ? <ChildModal
                        openModal={openmodal}

                        handleOpenModal={setIsOpenmodal}
                        notifyToast={notifyToast}
                    /> : null}
                </Stack>
           
                </Container>
    );
}

