import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Colors from '../color-utils/Colors'



import './DailyStatsCard.css';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


const numbers = ["Total Trades : 2 " , "Winners : 2", "Profit Factor : 1RR","Winrate : 100.00%", "Losers : 0", "Commissions :13$"];

export default function DailyStatsCard() {
  return (
    <Box sx={{ flexGrow: 1  , p: 3, border: '2px ridge ', boxShadow:'5px 10px 30px #888888'}}>
      <Grid container spacing={2}>
        <Grid item xs={8}>


        

        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
            <Grid item xs={4}>
                <h2 className="date">Wed, Jul 14 2022</h2>
            </Grid>
           
            <Grid item xs={4}>
                <h2 className="net">Net P&L $1259.46</h2>
            </Grid>
            </Grid>
            </Grid>

        
       
        <Grid container spacing={{ xs: 2, md: 4 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {Array.from(Array(12)).map((_, index) => (
          <Grid  item xs={3} sm={4} md={4} key={index}>
             {numbers[index] } 
          </Grid>
        ))}

        
      </Grid>

      </Grid>
    </Box>
  );
}