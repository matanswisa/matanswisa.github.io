import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useRef, useEffect } from 'react';
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

import Diveder from '../components/Divider/Diveder';
// components

import Iconify from '../components/iconify';
import api from '../api/api';











export default function DailyStatsPage() {

  const [trades, setTrades] = useState([]);
  useEffect(() => {
    api.get("/api/DailyStatsInfo").then(
      (res)=>{setTrades(res.data)   
     
      
     
        }
    ).catch()
  },[])
  
  
  


  
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
              return <Diveder trade={trade} />
            })}


            Daily Stats
          </Typography>


        </Stack>

      </Container>
    </>
  );
}
