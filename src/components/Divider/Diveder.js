import * as React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';


import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import {Colors} from '../color-utils/Colors'

import { styled } from '@mui/material/styles';

import Paper from '@mui/material/Paper';



const ProfitFactor = (trade) => {
  

  if (trade.totalLoss == 0 || trade.totalWin == 0) return 0;

  return (trade.totalWin / trade.totalLoss < 0 ? trade.totalWin / trade.totalLoss * -1 : trade.totalWin / trade.totalLoss).toFixed(2);
}


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
  

export default function Diveder(props) {
  const totalPnL = props.trade.totalPnL;
  const isNegative = totalPnL < 0;
  const winRate = ((props.trade.win / (props.trade.win + props.trade.loss)) * 100).toFixed(2);

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

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Item>
            <Typography color="text.primary" variant="body1">
              Winners&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>{props.trade.win}</b>
            </Typography>
          </Item>
          <Item>
            <Typography color="text.primary" variant="body1">
              Losers&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>{props.trade.loss}</b>
            </Typography>
          </Item>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: '60px', marginRight: '60px' }}>
          <Item>
            <Typography color="text.primary" variant="body1">
              Win rate&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>{winRate} %</b>
            </Typography>
          </Item>
          <Item>
            <Typography color="text.primary" variant="body1">
              Gross P&L&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>${ props.trade.Commission < 0 ? totalPnL - props.trade.Commission : totalPnL}</b>
            </Typography>
          </Item>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Item>
            <Typography color="text.primary" variant="body1">
              Commission&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>${props.trade.Commission}</b>
            </Typography>
          </Item>
          <Item>
            <Typography color="text.primary" variant="body1">
              Profit Factor&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>{ProfitFactor(props.trade)}</b>
            </Typography>
          </Item>
        </Box>
      </Box>

      <Divider variant="middle" style={{ background: 'grey' }} spacing={25} />
      <Box sx={{ mt: 3, ml: 1, mb: 1 }}>
        <Button>Edit note</Button>
      </Box>
    </Box>
  );
}
