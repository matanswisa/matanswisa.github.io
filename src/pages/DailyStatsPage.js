import Divider from '../components/trades/DailystatsView/Divider'

import { Helmet } from 'react-helmet-async';
import { filter, includes, lowerCase } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  DataGrid,
  TextField,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';


// components
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Iconify from '../components/iconify';
import api from '../api/api';
import userSlice, { selectCurrentAccount , selectUser} from '../redux-toolkit/userSlice';
import { configAuth } from '../api/configAuth';

export default function DailyStatsPage() {
  const [trades, setTrades] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null); // New state for the selected date
  const currentAccount = useSelector(selectCurrentAccount);
 



  useEffect(() => {
    api.post('/api/DailyStatsInfo',{trades:currentAccount.trades},configAuth)
      .then((res) => {
        setTrades(res.data);
      
      })
      .catch((error) => {
        console.log(error);
      });
  }, [currentAccount.trades]);



  

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleClearDate = () => {
    setSelectedDate(null);
  };

  return (
    <>
      <Helmet>
        <title>Daily Stats</title>
      </Helmet>
      <FormControl variant="outlined" style={{ minWidth: 120 }}>
      <div style={{ display: "flex", alignItems: "center" }}>
      <div style={{ marginRight: "10px" }}>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="E, MMM d, yyyy"
          placeholderText="Select a date"
        />
      </div>
      <Button
        variant="contained"
        onClick={handleClearDate}
        style={{ fontSize: "12px", minWidth: "80px" }}
      >
        Clear
      </Button>
    </div>
    
      </FormControl>
   
    
      <Container>
        <div style={{ maxHeight: '850px', maxWidth: '1400px', overflowY: 'scroll' }}>
          <Typography variant="h4" gutterBottom>
            Daily Stats
          </Typography>
          {trades
            .filter((trade) => {
              // Filter trades based on the selected date
              if (!selectedDate) {
                return true; // Show all trades if no date is selected
              }
              const tradeDate = new Date(trade._id);
              return tradeDate.toDateString() === selectedDate.toDateString();
            })
            .map((trade) => (
              <Divider trade={trade} key={trade.id} />
            ))}
        </div>
      </Container>
    </>
  );
}