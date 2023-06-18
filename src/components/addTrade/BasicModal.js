import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useEffect } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';

import Grid from '@mui/material/Grid';

// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  IconButton,
  TableContainer,
  TablePagination,
  TextField,
} from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 550,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 34,
  p: 4,
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function BasicModal(props) {
  const handleOpen = () => props.handleOpenModal(true);
  const handleClose = () => props.handleOpenModal(false);


  // Add other form fields here
  // For example: openDate: '', symbol: '', ...




  const [positionType, setPositionType] = React.useState(''); // Short or Long
  const [positionStatus, setPositionStatus] = React.useState(''); // win or lose

  useEffect(() => {
    handleOpen();
  }, []);

  const handleSaveTrade = () => {
    // Make form saving a new trade in the dataBase by http request {

  }


  return (
    <Modal
      open={props.openModal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={28}>
            <Grid item xs={6} md={7}>
              <Item>
                {' '}
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Add New Trade
                </Typography>
              </Item>
            </Grid>

            <Grid item xs={6} md={4}>
              <Item>
                <Button variant="contained" onClick={handleSaveTrade}>Save</Button>
              </Item>
            </Grid>
          </Grid>
        </Box>

        <br />

        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
          <Grid item xs={6}>
            <Item>
              <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch' } }} noValidateautoComplete="off">
                <TextField id="standard-basic" required="true" label="Open Date" variant="standard" type="date" />
              </Box>{' '}
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-standard-label">Type</InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={positionType}
                  onChange={(event) => setPositionType(event.target.value)}
                  label="Type"
                  required="true"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Short</MenuItem>
                  <MenuItem value={20}>Long</MenuItem>
                </Select>
              </FormControl>
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item>
              <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch' } }} noValidateautoComplete="off">
                <TextField id="standard-basic" required="true" label="Symbol" variant="standard" />
              </Box>
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item>
              {' '}
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-standard-label">Status</InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={positionStatus}
                  onChange={(event) => setPositionStatus(event.target.value)}
                  label="Status"
                  required="true"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Win</MenuItem>
                  <MenuItem value={20}>Loss</MenuItem>
                </Select>
              </FormControl>
            </Item>
          </Grid>
        </Grid>

        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
          <Grid item xs={6}>
            <Item>
              {' '}
              <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch' } }} noValidateautoComplete="off">
                <TextField className="standard-basic" label="Duration" variant="standard" />
              </Box>
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item>
              {' '}
              <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch' } }} noValidateautoComplete="off">
                <TextField
                  className="outlined-number"
                  required="true"
                  type="number"
                  label="Commission"
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            </Item>
          </Grid>

          <Grid item xs={6}>
            <Item>
              {' '}
              <TextField
                className="outlined-number"
                required="true"
                label="Entry Price"
                type="number"
                InputLabelProps={{ shrink: true }}
              />
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item>
              <TextField
                className="outlined-number"
                required="true"
                label="Exit Price"
                type="number"
                InputLabelProps={{ shrink: true }}
              />
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item>
              <TextField
                className="outlined-number"
                required="true"
                label="Contracts"
                type="number"
                InputLabelProps={{ shrink: true }}
              />
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item>
              {' '}
              <TextField
                className="outlined-number"
                required="true"
                label="Net P&L"
                type="number"
                InputLabelProps={{ shrink: true }}
              />
            </Item>
          </Grid>

          <Grid item xs={6}>
            <Item>
              <TextField
                className="outlined-number"
                label="Net ROI"
                type="number"
                required="true"
                InputLabelProps={{ shrink: true }}
              />
            </Item>
          </Grid>
        </Grid>
        <br />
      </Box>
    </Modal>
  );
}
