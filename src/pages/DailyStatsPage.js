import Divider from '../components/Divider/Diveder';

import { Helmet } from 'react-helmet-async';
import { filter, includes, lowerCase } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTrades } from '../redux-toolkit/tradesSlice';

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



export default function DailyStatsPage() {
  const [trades, setTrades] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [searchOption, setSearchOption] = useState('name');
  const [filteredTrades, setFilteredTrades] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

useEffect(() => {
  const filteredData = filter(trades, (trade) => {
    const tradeValue = trade[searchOption]?.toString().toLowerCase() ?? '';

    if (searchOption === 'date' && selectedDate) {
      const tradeDate = new Date(tradeValue); // Assuming the trade date is stored as a string
      const selectedDateWithoutTime = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      );
      return tradeDate.getTime() === selectedDateWithoutTime.getTime();
    }

    return includes(tradeValue, searchValue.toLowerCase());
  });

  setFilteredTrades(filteredData);
}, [searchValue, searchOption, trades, selectedDate]);


  useEffect(() => {
    api.get('/api/DailyStatsInfo')
      .then((res) => {
        setTrades(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const filteredData = filter(trades, (trade) => {
      const tradeValue = trade[searchOption]?.toString().toLowerCase() ?? '';

      if (searchOption === 'date' && selectedDate) {
        const tradeDate = new Date(tradeValue); // Assuming the trade date is stored as a string
        return tradeDate.toDateString() === selectedDate.toDateString();
      }

      return includes(tradeValue, searchValue.toLowerCase());
    });

    setFilteredTrades(filteredData);
  }, [searchValue, searchOption, trades, selectedDate]);

  return (
    <>
      <Helmet>
        <title>Daily Stats</title>
      </Helmet>
      <FormControl variant="outlined" style={{ minWidth: 120 }}>
        <InputLabel>Search By</InputLabel>
        <Select
          value={searchOption}
          onChange={(e) => setSearchOption(e.target.value)}
          label="Search By"
        >
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="numberOfTrades">Number of Trades</MenuItem>
          <MenuItem value="date">Date</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Search"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <DatePicker
        selected={selectedDate}
        onChange={date => setSelectedDate(date)}
        placeholderText="Select Date"
      />
      <Container>
        <div style={{ maxHeight: '850px', maxWidth: '1400px', overflowY: 'scroll' }}>
          <Typography variant="h4" gutterBottom>
            Daily Stats
          </Typography>
          {filteredTrades.map((trade) => (
            <Divider trade={trade} key={trade.id}  />
           
          ))}
        </div>
      </Container>
    </>
  );
}