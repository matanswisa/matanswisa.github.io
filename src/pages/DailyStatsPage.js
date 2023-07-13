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

import Iconify from '../components/iconify';
import api from '../api/api';

export default function DailyStatsPage() {
  const [trades, setTrades] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [searchOption, setSearchOption] = useState('name');
  const [filteredTrades, setFilteredTrades] = useState([]);

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

      return includes(tradeValue, searchValue.toLowerCase());
    });

    setFilteredTrades(filteredData);
  }, [searchValue, searchOption, trades]);

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
      <Container>
        <div style={{ maxHeight: '700px', overflowY: 'scroll' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={8}>
            <Typography variant="h4" gutterBottom>
              Daily Stats
            </Typography>

          </Stack>

          {filteredTrades.map((trade) => (
            <Divider trade={trade} key={trade.id} />
          ))}
        </div>
      </Container>
    </>
  );
}
