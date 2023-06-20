import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState,useRef } from 'react';


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

 

  return (
    <>
      <Helmet>
        <title> Daily Stats </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Daily Stats
          </Typography>
        

        </Stack>




       
        <DailyStatsCard/>
          <DailyStatsCard/>
          <DailyStatsCard/>
          <DailyStatsCard/>
          <DailyStatsCard/>
          <DailyStatsCard/>
   
          <DailyStatsCard/>
          <DailyStatsCard/>
          <DailyStatsCard/>
   
        

       

      </Container>




    </>
  );
}
