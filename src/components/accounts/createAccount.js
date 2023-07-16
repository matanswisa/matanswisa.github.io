import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import api from '../../api/api';
import { Select, MenuItem, ListItemIcon } from '@mui/material';
import { red, blue, green, yellow, orange, purple, pink, cyan } from '@mui/material/colors';
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

export default function BasicModal(props) {
    const handleOpen = () => props.handleOpenModal(true);
    const handleClose = () => props.handleOpenModal(false);
    const [accountName, setAccountName] = useState('');
    const [selectedColor, setSelectedColor] = useState(red[500]);


    const handleCreateAccount = async () => {
        const data = {

            AccountName: accountName,
            Label:selectedColor,
            IsSelected: "true",
        
          }
        await api
        .post('/api/createAccount', data).then((res) => {
        console.log("ok");
     
       //  notifyToast("Trade added successfully", "success");

        }).catch((err) => {
            console.log(err);
        //  notifyToast("Couldn't add trade", "error");
        })

    }


    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '60%',
        minWidth: '400px', // Adjust the size as needed
        height: '30vh', // Increase the height to 80% of the viewport height
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end', // Align buttons to the right
      };
    
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
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          sx={{ textAlign: 'left', marginTop: 0 }}
        >
          Create Account
        </Typography>


        </Grid>
      

      <Grid sx={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>

             
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
      <MenuItem  value={red[500]}>
       
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
          <Button variant="outlined" size="medium">
            Cancel
          </Button>
          <Button onClick={handleCreateAccount} variant="contained" size="medium">
            Create
          </Button>
        </Box>
            </Box>
          </Modal>
        </div>
      );
}