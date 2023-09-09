import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import {Colors} from '../../color-utils/Colors'
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import api from '../../../api/api'
import Paper from '@mui/material/Paper';
import Modal from '@mui/material/Modal';
import  { selectCurrentAccount } from '../../../redux-toolkit/userSlice';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions, 
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { brokers } from '../../brokersNames/brokers.js'
import { configAuth } from '../../../api/configAuth';
import {selectDarkMode} from '../../../redux-toolkit/darkModeSlice';
import { selectlanguage } from '../../../redux-toolkit/languagesSlice';


const ProfitFactor = (trade) => {
  if (trade.totalLoss === 0 || trade.totalWin === 0) return 0;

  return (trade.totalWin / trade.totalLoss < 0 ? trade.totalWin / trade.totalLoss * -1 : trade.totalWin / trade.totalLoss).toFixed(2);
}


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function getFormattedDate(dateString,isHebrew) {
  const date = new Date(dateString);
  const options = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  };
  if (!isHebrew) {
    const formattedDate = date.toLocaleDateString('en-US', options);
    const [weekday, month, day, year] = formattedDate.split(' ');
    const abbreviatedWeekday = weekday.slice(0, 3);
    const abbreviatedMonth = month.slice(0, 3);
    return `${abbreviatedWeekday}, ${abbreviatedMonth} ${day} ${year}`;
  } else {
    return date.toLocaleDateString('he-IL', options);
  }
}
  
let style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1200,
  height :560,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


//------------------------------------------------this component is each child from list in "DailyStatsPage" -----------------------------------------------------//
export default function Diveder(props) {


  //------------------------------------------------  States ----------------------------------------------------- //
  const isHebrew = useSelector(selectlanguage);
  const darkMode = useSelector(selectDarkMode);
  const date = props.trade._id;
  const [trades, setTrades] = useState([]);
  const totalPnL = props.trade.totalPnL;
  const isNegative = totalPnL < 0;
  const winRate = ((props.trade.win / (props.trade.win + props.trade.loss)) * 100).toFixed(2);
  const [open, setOpen] = React.useState(false);
  const [openCommend, setCommendOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [selectedComment, setSelectedComment] = useState('');
  const currentAccount = useSelector(selectCurrentAccount);
  let columns;


 //------------------------- Handle table Cols Struct for each broker  ------------------------------------------- //


 //default cols.
 if(isHebrew === false){

    columns = [
     { field: 'id', headerName: 'ID', width: 30 },
     { field: 'symbol', headerName: 'Symbol', width: 100, editable: false,},
     { field: 'status', headerName: 'Status', width: 100, editable: false,},
     { field: 'netROI', headerName: 'Net ROI', width: 100, editable: false,},
     { field: 'longShort', headerName: 'Long / Short', width: 100, editable: false,},
     { field: 'contracts', headerName: 'Contracts', width: 100, editable: false,},
     { field: 'duration', headerName: 'Duration', width: 170, editable: false,},
     { field: 'commission', headerName: 'Commission', width: 100, editable: false,},
     { field: 'netPnL', headerName: 'Net P&L', width: 100, editable: false,},
     { field: 'comments', headerName: 'comments', width: 100, editable: false,},
   ];
 }
 else{
  columns = [
    { field: 'id', headerName: 'מזהה', width: 30 },
    { field: 'symbol', headerName: 'סמל', width: 100, editable: false },
    { field: 'status', headerName: 'סטטוס', width: 100, editable: false },
    { field: 'netROI', headerName: 'רוי נטו', width: 100, editable: false },
    { field: 'longShort', headerName: 'ארוך / קצר', width: 100, editable: false },
    { field: 'contracts', headerName: 'חוזים', width: 100, editable: false },
    { field: 'duration', headerName: 'משך', width: 170, editable: false },
    { field: 'commission', headerName: 'עמלה', width: 100, editable: false },
    { field: 'netPnL', headerName: 'רווח / הפסד נטו', width: 100, editable: false },
    { field: 'comments', headerName: 'הערות', width: 100, editable: false },
  ];
  

 }
  
  
if (currentAccount !== null) {
// Check if the current account's broker is Tradovate and Define table columns for Tradovate broker
  if (currentAccount?.Broker == brokers.Tradovate) {
    style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 1200,
      height :560,
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
    };


    if(isHebrew === false){

      columns = [
        { field: 'id', headerName: 'ID', width: 20 },
        { field: 'symbol', headerName: 'Symbol', width: 100, editable: false,},
        { field: 'status', headerName: 'Status', width: 100, editable: false,},
        { field: 'netROI', headerName: 'Net ROI', width: 100, editable: false,},
        { field: 'longShort', headerName: 'Long / Short', width: 100, editable: false,},
        { field: 'contracts', headerName: 'Contracts', width: 100, editable: false,},
        { field: 'duration', headerName: 'Duration', width: 150, editable: false,},
        { field: 'commission', headerName: 'Commission', width: 100, editable: false,},
        { field: 'netPnL', headerName: 'Net P&L', width: 100, editable: false,},
        { field: 'comments', headerName: 'comments', width: 100, editable: false,},
      ];
    }
    else{
      columns = [
        { field: 'id', headerName: 'מזהה', width: 20 },
        { field: 'symbol', headerName: 'סמל', width: 100, editable: false },
        { field: 'status', headerName: 'סטטוס', width: 100, editable: false },
        { field: 'netROI', headerName: 'רוי נטו', width: 100, editable: false },
        { field: 'longShort', headerName: 'לונג / שורט', width: 100, editable: false },
        { field: 'contracts', headerName: 'חוזים', width: 100, editable: false },
        { field: 'duration', headerName: 'זמן עסקה', width: 150, editable: false },
        { field: 'commission', headerName: 'עמלה', width: 100, editable: false },
        { field: 'netPnL', headerName: 'רווח / הפסד נטו', width: 100, editable: false },
        { field: 'comments', headerName: 'הערות', width: 100, editable: false },
      ];
      
    }


  }

// Check if the current account's broker is Binance  and table columns for Binance broker
  else if (currentAccount?.Broker == brokers.Binance) {
    style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 880,
      height :560,
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
    };

    if(isHebrew === false){

    columns = [
      { field: 'id', headerName: 'ID', width: 30 },
      { field: 'symbol', headerName: 'Symbol', width: 100, editable: false,},
      { field: 'status', headerName: 'Status', width: 100, editable: false,},
      { field: 'longShort', headerName: 'Long / Short', width: 100, editable: false,},
      { field: 'quantity', headerName: 'Quantity', width: 100, editable: false,},
      { field: 'commission', headerName: 'Commission', width: 100, editable: false,},
      { field: 'netPnL', headerName: 'Net P&L', width: 100, editable: false,},
      { field: 'comments', headerName: 'comments', width: 100, editable: false,},
    ];
   }
   else{
    columns = [
      { field: 'id', headerName: 'מזהה', width: 20 },
      { field: 'symbol', headerName: 'סמל', width: 100, editable: false },
      { field: 'status', headerName: 'סטטוס', width: 100, editable: false },
      { field: 'longShort', headerName: 'לונג / שורט', width: 100, editable: false },
      { field: 'contracts', headerName: 'כמות', width: 100, editable: false },
      { field: 'commission', headerName: 'עמלה', width: 100, editable: false },
      { field: 'netPnL', headerName: 'רווח / הפסד נטו', width: 100, editable: false },
      { field: 'comments', headerName: 'הערות', width: 100, editable: false },
    ];   
  }
  }
}


  const handleCellClick = (params) => {
    if (params.field === 'comments') {
      setSelectedComment(params.value);
      setCommendOpen(true);
    }
  };

  const handleCloseCommend = () => {
    setCommendOpen(false);
  };


//------------------------- Handle Calculating the data before presenting it in a table ------------------------------------------- //
  const rows = trades.map((trade) => {

    // Before displaying the total trade time in the table calc this time to : hours, minutes, and seconds format
    const durationInMinutes = trade.duration || 0;
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = Math.floor(durationInMinutes % 60);
    const seconds = Math.floor((durationInMinutes % 1) * 60);
  
    // Format the duration as a string
    let formattedDuration = '';
    if (hours > 0) {
      formattedDuration += `${hours} Hr `;
    }
    if (minutes > 0) {
      formattedDuration += `${minutes} Min `;
    }
    if (seconds > 0) {
      formattedDuration += `${seconds} Sec`;
    }
  
    // If all values are zero, display "N/A"
    if (!formattedDuration.trim()) {
      formattedDuration = "N/A";
    }
  
    if (currentAccount?.Broker === brokers.Tradovate) {
    return {
      id: trade._id,
      symbol: trade.symbol,
      status: trade.status,
      netROI: trade.netROI + "%",
      longShort: trade.longShort,
      contracts: trade.contracts,
      duration: formattedDuration, // Use the formatted duration instead of the raw value
      commission: trade.commission ? "$" + trade.commission : "N/A",
      netPnL: "$" + trade.netPnL,
      comments: trade.comments,
    };
  } 

  else if (currentAccount?.Broker === brokers.Binance) {
  return {
      id: trade._id,
      symbol: trade.symbol,
      status: trade.status,
    
      longShort: trade.longShort,
      quantity: trade.contracts,
    
      commission: trade.commission ? "$" + trade.commission : "N/A",
      netPnL: "$" + trade.netPnL,
      comments: trade.comments,
    };
  }
  });
  
  useEffect(() => {
    api.post('/api/ShowInfoBySpecificDate',{trades:currentAccount.trades, date:date},configAuth)
      .then((res) => {
        setTrades(res.data);
      
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    
    <Box sx={{ width: '1400px', maxWidth: 1200, bgcolor: 'background.paper' }}>
      
      <Box sx={{ my: 8, mx: 2 }}>
        <Grid container rowSpacing={3} alignItems="center">
          <Grid item xs={6}>
            <Typography gutterBottom variant="h4" component="div">
              {getFormattedDate(props.trade._id,isHebrew)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography gutterBottom variant="h4" component="div" sx={{ color: isNegative ? Colors.red : Colors.green }}>
            {isHebrew === false ?  " Net P&L" : "רווח/הפסד כולל"}  ${totalPnL }
            </Typography>
          </Grid>
        </Grid>
        <Typography color="text.primary" variant="body1">
          {props.trade.numberOfTrades} {isHebrew === false ?  "Trades" : "עסקאות"}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center'   }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Item style={{  backgroundColor: darkMode ? '#121212' : "", color: darkMode ? 'white' : "",  }}>
            <Typography color="text.primary" variant="body1">
            {isHebrew === false ?  "Winners" : "מנצחות"} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>{props.trade.win}</b>
            </Typography>
          </Item>
          <Item style={{  backgroundColor: darkMode ? '#121212' : "", color: darkMode ? 'white' : "",  }}>
            <Typography color="text.primary" variant="body1">
            {isHebrew === false ?  "Losers" : "מפסידות"}   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>{props.trade.loss}</b>
            </Typography>
          </Item>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: '250px', marginRight: '240px' }}>
          <Item style={{  backgroundColor: darkMode ? '#121212' : "", color: darkMode ? 'white' : "",  }}>
            <Typography color="text.primary" variant="body1">
            {isHebrew === false ?  " Win rate " : "%שיעור זכייה"}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>{winRate} {isHebrew === false ? "%" : ""}</b>
            </Typography>
          </Item>
          <Item style={{  backgroundColor: darkMode ? '#121212' : "", color: darkMode ? 'white' : "",  }}>
            <Typography color="text.primary" variant="body1">
            {isHebrew === false ?  " Gross P&L" : " רווח והפסד ברוטו"}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>{ props.trade.Commission < 0 ? totalPnL - props.trade.Commission : totalPnL}$</b>
            </Typography>
          </Item>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Item style={{  backgroundColor: darkMode ? '#121212' : "", color: darkMode ? 'white' : "",  }}>
            <Typography color="text.primary" variant="body1">
            {isHebrew === false ?  "Commission" : "עמלה"} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>${props.trade.Commission}</b>
            </Typography>
          </Item>
          <Item style={{  backgroundColor: darkMode ? '#121212' : "", color: darkMode ? 'white' : "",  }}>
            <Typography color="text.primary" variant="body1">
            {isHebrew === false ?  "Profit Factor" : "גורם רווח"} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>{ProfitFactor(props.trade)}</b>
            </Typography>
          </Item>
        </Box>
      </Box>

      <Box sx={{ mt: 3, ml: 1, mb: 1 }}>
        <Button style={{  backgroundColor: darkMode ? '#121212' : "", color: darkMode ? 'white' : "",  }} onClick={handleOpen}>  {isHebrew === false ?  "Show Trades" : "הצגת עסקאות"}</Button>
      <Divider variant="middle" style={{ background: 'grey' }} spacing={25} />
        <Modal
  open={open}
  onClose={handleClose}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box sx={style}>
  <Typography gutterBottom variant="h4" component="div">
              {getFormattedDate(props.trade._id,isHebrew)}
            </Typography>
  <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
          onCellClick={handleCellClick}
       
      />
          <Dialog open={openCommend} onClose={handleCloseCommend}>
        <DialogTitle>      {isHebrew === false ?  "Comment" : "הערה"}</DialogTitle>
        <DialogContent>{selectedComment}</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCommend} color="primary"> {isHebrew === false ?  "Close" : "סגירה"}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  </Box>
</Modal>
      </Box>
    </Box>
  );
}
