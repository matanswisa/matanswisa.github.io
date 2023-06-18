import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState } from 'react';
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
} from '@mui/material';


// components
 import AddTrade from '../components/addTrade/BasicModal';


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
          <Button   variant="contained" startIcon={<Iconify icon="eva:plus-fill"  />}>
            Add New Trade
          </Button>
        </Stack>

   

      </Container>

   

 
    </>
  );
}
