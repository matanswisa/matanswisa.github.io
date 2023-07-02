import * as React from 'react';
import { styled } from '@mui/material/styles';


import {

    Box,
    Grid,
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
  

import Iconify from '../iconify/Iconify';

import './DailyStatsCard.css';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Text = ["Total Trades : " , "Winners : ", "Profit Factor :","Winrate : ", "Losers : ", "Commissions :"];

const numbers = [" " , " ", "","", "", ""];

export default function DailyStatsCard(props) {
  return (
    <Box sx={{ flexGrow: 2  , p: 3, border: '2px ridge ', boxShadow:'5px 10px 30px #888888'}}>
        
      <Grid container spacing={1}>
        <Grid item xs={8}>


        

        <Grid container rowSpacing={3} columnSpacing={{ xs: 2, sm: 2, md: 1 }}>
            <Grid item xs={5}>
                <h2 className="date">{props.entryDate}</h2>
            </Grid>
           
            <Grid item xs={5}>
                <h2 className="net">Net P&L ${props.netPnL}</h2>
                
            </Grid>

            </Grid>
            </Grid>
  

            <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 10, sm: 10, md: 12 }}>
  {Array.from(Array(6)).map((_, index) => (
    <Grid item xs={2} sm={4} md={4} key={index}>
      <div style={{ display: 'flex', alignItems: 'center', borderRight: index !== 5 ? '1px solid black' : 'none', paddingRight: '10px' }}>
        {Text[index]} <h3 style={{ marginLeft: '45px' }}>{numbers[index]}</h3>
      </div>
    </Grid>
  ))}
</Grid>

      </Grid>
      <Grid item xs={2}>
            <Button variant="contained">Show Trades</Button>

                
            </Grid>

    </Box>
  );
}