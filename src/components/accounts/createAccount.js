import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import api from '../../api/api';
import { useEffect } from 'react';
import { Select, MenuItem, ListItemIcon, Alert } from '@mui/material';
import { red, blue, green, yellow, orange, purple, pink, cyan,brown ,lightGreen,lime,blueGrey} from '@mui/material/colors';
import { Grid } from 'rsuite';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '4px solid #000',
  boxShadow: 4,
  p: 4,
};

export default function BasicModal(props) {
  const [accounts, setAccounts] = useState([]);
  const handleOpen = () => props.handleOpenModal(true);
  const handleClose = () => props.handleOpenModal(false);
  const [accountName, setAccountName] = useState('');
  const [selectedColor, setSelectedColor] = useState(red[500]);
  const { notifyToast } = props;
  const { edit } = props;
  const { accountInfo } = props;
  useEffect(() => {
    if (accountInfo && typeof accountInfo === 'object') {
      setAccountName(accountInfo.AccountName || "");
      setSelectedColor(accountInfo.Label || "");
    }
  }, [accountInfo])



  const checkAccountExists = (accountList, accountName) => {


    const selectedAccount = accountList.find(account => account.AccountName === accountName);

    return selectedAccount !== undefined;
  };






  const handleCreateAccount = async () => {

    if (validateForm()) {
      const data = {

        AccountName: accountName,
        Label: selectedColor,
        IsSelected: "true",

      }

      console.log(data);



      await api
        .post('/api/createAccount', data).then((res) => {


          notifyToast("Account added successfully", "success");
          props.handleOpenModal(false);
          props.fetchAccounts();
          return false;

        }).catch((err) => {

          notifyToast("Couldn't add Account", "error");
          return false;
        })

    }
  }



  
  const handleEditAccount = async () => {
    if (validateForm()) {
      const data = {
        _id: accountInfo._id, // Include the _id property for updating the correct account
        AccountName: accountName,
        Label: selectedColor,
        IsSelected: "true",
      };
  
      console.log(data);
  
      await api
        .put(`/api/editAccount/${accountInfo._id}`, data) // Use api.put and pass the account id in the URL
        .then((res) => {
          notifyToast("Account updated successfully", "success");
          props.handleOpenModal(false);
          props.fetchAccounts();
        })
        .catch((err) => {
          notifyToast("Couldn't update account", "error");
        });
    }
  };
  





  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '30%',
    minWidth: '400px', // Adjust the size as needed
    height: '20vh', // Increase the height to 80% of the viewport height
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end', // Align buttons to the right

  };




  const validateForm = () => {
    if (accountName === '')
      notifyToast("Account type is missing", "warning");


    else if (checkAccountExists(accounts, accountName)) {
      notifyToast("Account already exist", "warning");
      return false;
    }

    else
      return true;

  }
  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={handleOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} >
          <Grid>
            {edit === true ? <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ textAlign: 'left', marginTop: 0 }}
            >
              Update Account
            </Typography> : <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ textAlign: 'left', marginTop: 0 }}
            >
              Create Account
            </Typography>}



          </Grid>

          <Grid sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <TextField
              required
              id="outlined-required"
              label="Account Name"
              sx={{ mr: 2 }}
              defaultValue={accountName}
              onChange={(e) => setAccountName(e.target.value)}
            />



            <Select size="small" value={selectedColor}
              onChange={(event) => setSelectedColor(event.target.value)}>
              <MenuItem value={red[500]}>

              </MenuItem>
              <MenuItem value={red[500]}>
                <ListItemIcon>
                  <div style={{ backgroundColor: red[500], width: '24px', height: '24px' }}></div>
                </ListItemIcon>

              </MenuItem>
              <MenuItem value={blue[500]}>
                <ListItemIcon>
                  <div style={{ backgroundColor: blue[500], width: '24px', height: '24px' }}></div>
                </ListItemIcon>

              </MenuItem>
              <MenuItem value={green[500]}>
                <ListItemIcon>
                  <div style={{ backgroundColor: green[500], width: '24px', height: '24px' }}></div>
                </ListItemIcon>
              </MenuItem>
              <MenuItem value={brown[500]}>
                <ListItemIcon>
                  <div style={{ backgroundColor: brown[500], width: '24px', height: '24px' }}></div>
                </ListItemIcon>
              </MenuItem>

              <MenuItem value={yellow[500]}>
                <ListItemIcon>
                  <div style={{ backgroundColor: yellow[500], width: '24px', height: '24px' }}></div>
                </ListItemIcon>

              </MenuItem>
              <MenuItem value={orange[500]}>
                <ListItemIcon>
                  <div style={{ backgroundColor: orange[500], width: '24px', height: '24px' }}></div>
                </ListItemIcon>

              </MenuItem>
              <MenuItem value={purple[500]}>
                <ListItemIcon>
                  <div style={{ backgroundColor: purple[500], width: '24px', height: '24px' }}></div>
                </ListItemIcon>

              </MenuItem>
              <MenuItem value={pink[500]}>
                <ListItemIcon>
                  <div style={{ backgroundColor: pink[500], width: '24px', height: '24px' }}></div>
                </ListItemIcon>

              </MenuItem>
              <MenuItem value={cyan[500]}>
                <ListItemIcon>
                  <div style={{ backgroundColor: cyan[500], width: '24px', height: '24px' }}></div>
                </ListItemIcon>

              </MenuItem>
              <MenuItem value={lightGreen[500]}>
                <ListItemIcon>
                  <div style={{ backgroundColor: lightGreen[500], width: '24px', height: '24px' }}></div>
                </ListItemIcon>

              </MenuItem>
              <MenuItem value={lime[500]}>
                <ListItemIcon>
                  <div style={{ backgroundColor: lime[500], width: '24px', height: '24px' }}></div>
                </ListItemIcon>

              </MenuItem>
              <MenuItem value={blueGrey[500]}>
                <ListItemIcon>
                  <div style={{ backgroundColor: blueGrey[500], width: '24px', height: '24px' }}></div>
                </ListItemIcon>

              </MenuItem>
            </Select>
          </Grid>


 

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '8px',
              position: 'absolute',
              bottom: '16px',
              right: '16px',
            }}
          >
            <Button variant="outlined" size="medium" onClick={handleClose}>
              Cancel
            </Button>
            
            <Button onClick={edit === true ? handleEditAccount : handleCreateAccount} variant="contained" size="medium">
            {edit === true ? "Update" : "Create"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}