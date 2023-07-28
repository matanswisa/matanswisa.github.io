import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Iconify from '../iconify/Iconify';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useEffect, useState,useRef } from 'react';

import Papa from 'papaparse';



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


        


    const handleOpen = () => props.handleOpenModal(true);
    const handleClose = () => props.handleOpenModal(false);
    const { notifyToast } = props;

    const [broker, setBroker] = React.useState(1);

    const handleChange = (event) => {
        setBroker(event.target.value);
    };




  
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


  const handleFileChangeTrade = (event) => {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      if (!isCSVFile(file)) {
        notifyToast("Invalid file format. Please select a CSV file.", "error");
        return;
      }

      // Use FileReader to read the file contents
      const reader = new FileReader();
      reader.onload = () => {
        // Parse the CSV data using papaparse
        const result = Papa.parse(reader.result, {
          header: true,
          dynamicTyping: true,
        });

        if (!isValidColumnNames(result.data)) {
          notifyToast("Please ensure the CSV file has corrent ,when import trade from tradeovate file name need to be : Position History ", "error");
          return;
        }

        // Store the parsed data in the state variable
        setCsvData(result.data);
        handleSaveTrade(result.data);
        //call api to add new trades.
      };

      reader.readAsText(file);
    }
    console.log(csvData);
  };

  const handleImportTrade = () => {
    // Trigger the file input selection when the button is clicked
    fileInputRefTrade.current.click();
  };

  useEffect(() => {
    console.log(csvData);
  }, [csvData]);






  
  const handleSaveTrade = async (csvData) => {

    const data = {
      entryDate: csvData[0]["Bought Timestamp"] || "",
      symbol: csvData[0]["Product"]|| "",
      status: csvData[0]["P/L"] < 0  ?  "Loss" : "Win" || "",
      netROI:"",
      stopPrice :"",
      longShort: csvData[0]["Buy Price"] < csvData[0]["Sell Price"] ? "Long" : "Short" || "",
      contracts: csvData[0]["Bought"] || "",
      entryPrice: csvData[0]["Buy Price"] || "",
      exitPrice :  csvData[0]["Sell Price"] || "",
      duration: "",
      commission:"",
      comments: "",
      netPnL:  csvData[0]["P/L"] || "",
      tradeId:  "",
    }


    const boughtTimestamp = new Date(csvData[0]["Bought Timestamp"]);
    const soldTimestamp = new Date(csvData[0]["Sold Timestamp"]);
    const timeDifferenceInMinutes = (soldTimestamp - boughtTimestamp) / (1000 * 60);
    data.duration = timeDifferenceInMinutes || "";


   console.log(data);


  //   if (validateForm()) {

  //     if (validateForm()) {
  //       if (!editMode) {
  //         await api
  //           .post('/api/addTrade', data).then((res) => {
  //             if (selectedFile !== null) {
  //               handleUpload(res.data.tradeId);
  //             }
  //             props.updateTradeLists()
  //             notifyToast("Trade added successfully", "success");
  //             handleClose();

  //           }).catch((err) => {
  //             notifyToast("Couldn't add trade", "error");
  //           })
  //       }
  //       else if (editMode === true) {

  //         const netPnL = prevStatusState !== data.status && data.status === "Win" && data.netPnL < 0
  //           ? -data.netPnL
  //           : data.netPnL;

  //         data.netPnL = netPnL;
  //         await api.post('/api/editTrade', data)
  //           .then((response) => {
  //             notifyToast("Trade Edit succssfully", "success")
  //             handleUpload(tradeInfo?._id);
  //             props.updateTradeLists()

  //           })
  //           .catch((error) => {
  //             notifyToast("Trade can't be updated", "error")
  //           });

  //       }

  //     } else {
  //       console.log('Please fill in all the fields');
  //     }
  //   };
  // }

  // const validateForm = () => {

  //   const currentDate = new Date().toISOString().slice(0, 10); // Get today's date in the format "YYYY-MM-DD"

  //   if (positionDate > currentDate) {
  //     const errorMessage = "the selected date is above today's date.";

  //     notifyToast(errorMessage, "warning");

  //     return false;

  //   }

  //   if (positionType === '' || positionStatus === '' ||
  //     contractsCounts <= 0 || Number.isNaN(netPnL) || positionSymbol === "" || selectedFile === "" || !positionDate) {

  //     if (positionType === '') notifyToast("Position type is missing", "warning");
  //     else if (positionStatus === '') notifyToast("Position status is missing", "warning");
  //     else if (!netPnL) notifyToast("Net PnL is missing", "warning");
  //     else if (!contractsCounts) notifyToast("Number of contracts field is missing", "warning");
  //     else if (positionSymbol === "") notifyToast("Position symbol is missing", "warning");
  //     else if (!positionDate) notifyToast("Date field is missing", "warning");

  //     console.log(positionDate > currentDate);


  //     return false;
  //   }
  //   return true;
  };



////////////////////////////////////////////////////////////

    






    return (
        <div>

            <Modal
                open={handleOpen}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography    id="modal-modal-title" variant="h5" component="h2">
                        import Trades          </Typography>




                    <Select  sx={{ mt: 3 }}
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
                        <MenuItem value={2}>Ninja Trader</MenuItem>
                        <MenuItem value={3}>Interactiv</MenuItem>
                    </Select>
                    <Button  sx={{ mt: 5 }}
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
                </Box>
            </Modal>
        </div>
    );
}