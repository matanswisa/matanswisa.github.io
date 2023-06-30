import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useRef } from 'react';
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
  DataGrid
} from '@mui/material';

import DailyStatsCard from '../components/DailyStatsCard/DailyStatsCard'

// components

import Iconify from '../components/iconify';




export default function DailyStatsPage() {

  const trades = useSelector(getTrades)

  console.log("tradesList using redux", trades);
  return (
    <>
      <Helmet>
        <title> Daily Stats </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            <h1>List of trades</h1>
            {trades !== undefined && trades.map((trade) => {
              return <h3>{trade.symbol} {trade.status} {trade.netPnL}</h3>
            })}
            Daily Stats
          </Typography>
        </Stack>
        <DailyStatsCard />
      </Container>
    </>
  );
}
