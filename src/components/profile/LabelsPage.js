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
import { Divider, IconButton, Menu, MenuItem, Stack } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import ChildModal from  '../accounts/createAccount'


import { useState, useRef, useEffect } from 'react';


import useToast from '../../hooks/alert';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../api/api';
import { ToastContainer, } from 'react-toastify';



export default function BasicModal(props) {
  const handleOpen = () => props.handleOpenModal(true);
  const handleClose = () => props.handleOpenModal(false);
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


  return (
    <div>
        <ToastContainer />
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={props.openModal}
        onClose={handleClose}
        
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"

      >
        <Box sx={modalStyle}>
          <Typography color="black" id="modal-modal-title" variant="h6" component="h2">
            Accounts Management
          </Typography>
          <Divider sx={{ my: 3, backgroundColor: 'grey' }} />
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography color="black" variant="subtitle1" fontWeight="bold">
                      Name
                    </Typography>
                  </TableCell>
                  <TableCell>
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
      <TableCell style={{  fontSize: '17px', color: 'black' }}>{account.AccountName}</TableCell>
      <TableCell style={{ backgroundColor: account.Label ,width: '1%' }}></TableCell>
      <TableCell>
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
          <Button variant="outlined" size="medium" onClick={() => handleClose(true)}>
            Close
          </Button>
            <Button  onClick={handleOpenCreateAccountModal}  variant="contained">
              Create Account
            </Button>
            {openmodal && <ChildModal openModal={openmodal} handleOpenModal={setIsOpenmodal}  />}
          {(openmodal ) === true ? <ChildModal 
            openModal={openmodal}
         
            handleOpenModal={setIsOpenmodal}
            notifyToast={notifyToast}
          /> : null}
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1200,
  height: 530,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
