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
import userSlice, { selectCurrentAccount , selectUser} from '../../../redux-toolkit/userSlice';
import { useSelector } from 'react-redux'
import {
 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  
} from '@mui/material';

import { configAuth } from '../../../api/configAuth';

const ProfitFactor = (trade) => {
  

  if (trade.totalLoss === 0 || trade.totalWin === 0) return 0;

  return (trade.totalWin / trade.totalLoss < 0 ? trade.totalWin / trade.totalLoss * -1 : trade.totalWin / trade.totalLoss).toFixed(2);
}



const columns = [
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


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function getFormattedDate(dateString) {
  const date = new Date(dateString);
  const options = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  };
  const formattedDate = date.toLocaleDateString('en-US', options);
  const [weekday, month, day, year] = formattedDate.split(' ');
  const abbreviatedWeekday = weekday.slice(0, 3); // Take the first three characters of the weekday
  const abbreviatedMonth = month.slice(0, 3); // Take the first three characters of the month

  return `${abbreviatedWeekday}, ${abbreviatedMonth} ${day} ${year}`;
}
  
const style = {
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




export default function Diveder(props) {
  const date = props.trade._id;
  console.log(date);
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

  const handleCellClick = (params) => {
    if (params.field === 'comments') {
      setSelectedComment(params.value);
      setCommendOpen(true);
    }
  };

  const handleCloseCommend = () => {
    setCommendOpen(false);
  };
  const rows = trades.map((trade) => {
    // Calculate the duration in hours, minutes, and seconds format
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
              {getFormattedDate(props.trade._id)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography gutterBottom variant="h4" component="div" sx={{ color: isNegative ? Colors.red : Colors.green }}>
              Net P&L ${totalPnL }
            </Typography>
          </Grid>
        </Grid>
        <Typography color="text.primary" variant="body1">
          {props.trade.numberOfTrades} Trades
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center'   }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Item>
            <Typography color="text.primary" variant="body1">
              Winners&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>{props.trade.win}</b>
            </Typography>
          </Item>
          <Item>
            <Typography color="text.primary" variant="body1">
              Losers&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>{props.trade.loss}</b>
            </Typography>
          </Item>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: '250px', marginRight: '240px' }}>
          <Item>
            <Typography color="text.primary" variant="body1">
              Win rate&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>{winRate} %</b>
            </Typography>
          </Item>
          <Item>
            <Typography color="text.primary" variant="body1">
              Gross P&L&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>${ props.trade.Commission < 0 ? totalPnL - props.trade.Commission : totalPnL}</b>
            </Typography>
          </Item>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Item>
            <Typography color="text.primary" variant="body1">
              Commission&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>${props.trade.Commission}</b>
            </Typography>
          </Item>
          <Item>
            <Typography color="text.primary" variant="body1">
              Profit Factor&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>{ProfitFactor(props.trade)}</b>
            </Typography>
          </Item>
        </Box>
      </Box>

      <Divider variant="middle" style={{ background: 'grey' }} spacing={25} />
      <Box sx={{ mt: 3, ml: 1, mb: 1 }}>
        <Button onClick={handleOpen}>Show trades</Button>
        <Modal
  open={open}
  onClose={handleClose}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box sx={style}>
  <Typography gutterBottom variant="h4" component="div">
              {getFormattedDate(props.trade._id)}
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
        <DialogTitle>Comment</DialogTitle>
        <DialogContent>{selectedComment}</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCommend} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  </Box>
</Modal>
      </Box>
    </Box>
  );
}
