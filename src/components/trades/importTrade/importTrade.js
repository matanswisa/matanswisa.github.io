import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Iconify from '../../iconify/Iconify';

import MenuItem from '@mui/material/MenuItem';

import Select from '@mui/material/Select';
import { useEffect, useState, useRef } from 'react';
import api from '../../../api/api'
import Papa from 'papaparse';

import { configAuth } from '../../../api/configAuth';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentAccount, selectUser, setTradesList } from '../../../redux-toolkit/userSlice';
import StepperModal from '../ExplanationOfImportTrades/StepperModal';
import {

  IconButton


} from '@mui/material';


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
  display: 'flex',
  flexDirection: 'column', // Make sure the content is in a column
};


export default function BasicModal(props) {
  const [showStepper, setShowStepper] = useState(false);

  const handleIconButtonClick = () => {
    // Set showAnotherComponent to true to display AnotherComponent
    setShowStepper(true);
  };



  const dispatch = useDispatch();
  const handleOpen = () => props.handleOpenModal(true);
  const handleClose = () => props.handleOpenModal(false);
  const { notifyToast } = props;

  const [broker, setBroker] = React.useState(1);

  const handleChange = (event) => {
    setBroker(event.target.value);
  };



  const user = useSelector(selectUser);
  const currentAccount = useSelector(selectCurrentAccount)

  // /////////////////////import trades///////////////////
  const [selectedFile, setSelectedFile] = useState(null);

  const [csvData, setCsvData] = useState(null);
  const fileInputRefTrade = useRef(null);

  const isCSVFile = (file) => {
    return file.type === 'text/csv' || file.name.endsWith('.csv');
  };

  const isValidColumnNames = (data) => {
    // Add your updated validation logic for column names here
    const requiredColumns = [
      'Position ID', 'Timestamp', 'Trade Date', 'Net Pos', 'Net Price', 'Bought',
      'Avg. Buy', 'Sold', 'Avg. Sell', 'Account', 'Contract', 'Product', 'Product Description',
      '_priceFormat', '_priceFormatType', '_tickSize', 'Pair ID', 'Buy Fill ID', 'Sell Fill ID',
      'Paired Qty', 'Buy Price', 'Sell Price', 'P/L', 'Currency', 'Bought Timestamp', 'Sold Timestamp'
    ];
    return requiredColumns.every((col) => data[0].hasOwnProperty(col));
  };

  const handleMergeRows = (data) => {
    // Group the rows by the 'Position ID' field
    const groupedRows = data.reduce((acc, row) => {
      const id = row['Position ID'];
      if (!acc[id]) {
        acc[id] = { ...row }; // Make a copy of the row to avoid mutation
        acc[id]['P/L'] = parseFloat(row['P/L'] || 0); // Initialize the sum of P/L
      } else {
        acc[id]['P/L'] += parseFloat(row['P/L'] || 0); // Add the P/L to the existing sum
        acc[id]['Sold Timestamp'] = row['Sold Timestamp']; // Update the 'Sold Timestamp' with the current row's value
      }
      return acc;
    }, {});
    // Convert the object back to an array
    const mergedRows = Object.values(groupedRows);

    return mergedRows;
  };


  const handleFileChangeTrade = async (event) => {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', user._id);
        formData.append('accountId', currentAccount._id);

        const token = localStorage.getItem('token');
        const headersForImportTrades = {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }

        const response = await api.post('/api/importTrades', formData, headersForImportTrades);

        dispatch(setTradesList(response.data));
        // Handle success or show a success message to the user
      } catch (error) {
        console.error('Error uploading file:', error);
        // Handle error or show an error message to the user
      }
    }
  };

  const handleImportTrade = () => {
    // Trigger the file input selection when the button is clicked
    fileInputRefTrade.current.click();
  };

  useEffect(() => {

  }, [csvData]);

  return (
    <div>

      <Modal
        open={handleOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h5" component="h2">
            import Trades          </Typography>




          <Select sx={{ mt: 3 }}
            name="broker"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={broker}
            label="broker"
            onChange={handleChange}
            inputProps={{
              name: 'age',
              id: 'uncontrolled-native',
            }}

          >
            <MenuItem value={1}>Tradovate</MenuItem>
            {/* <MenuItem value={2}>Ninja Trader</MenuItem>
            <MenuItem value={3}>Interactiv</MenuItem> */}
          </Select>
          <Button sx={{ mt: 5 }}
            size="medium"
            variant="contained"
            component="span"
            startIcon={<Iconify icon={'eva:file-add-outline'} />}
            onClick={handleImportTrade}
          >
            Import
          </Button>
          <input
            type="file"
            ref={fileInputRefTrade}
            style={{ display: 'none' }}
            onChange={handleFileChangeTrade}
          />
          <IconButton size="large" color="inherit" onClick={handleIconButtonClick}>
            <Iconify icon={'eva:question-mark-circle-outline'} />
          </IconButton>
          {showStepper && <StepperModal handleOpenModal={setShowStepper} />}
        </Box>
      </Modal>
    </div>
  );
}