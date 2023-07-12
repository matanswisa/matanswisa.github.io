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
    const winRate = (props.trade.win / (props.trade.win + props.trade.loss) * 100).toFixed(2); // Calculate win rate percentage
    console.log(props.trade);
    return (

      <Box sx={{ width: '1400px', maxWidth: 1200, bgcolor: 'background.paper' }}>
        <Box sx={{ my: 8, mx: 2 }}>
       
          <Grid container rowSpacing={3} alignItems="center">
                  <Grid item xs>
                  <Typography gutterBottom variant="h4" component="div">
  {getFormattedDate(props.trade._id)} 
</Typography>
                  
                  </Grid>
               
     
                  <Grid item>
                    <Typography
                      gutterBottom
                      variant="h4"
                      component="div"
                      sx={{ color: isNegative ? Colors.red : Colors.green }}
                    >
                      Net P&L ${props.trade.Commission <0 ? totalPnL + props.trade.Commission : totalPnL}
                      
                    </Typography>
                  </Grid>
          </Grid>
          <Typography color="text.primary" variant="body1">
            {props.trade.numberOfTrades} Trades
          </Typography>
        </Box>
   
        
        <Grid container rowSpacing={3} columnSpacing={{ xs: 3, sm: 2, md: 5 }}>
               <Grid item xs={6}>
                 <Item><Typography color="text.primary" variant="body1"> Winners&nbsp;&nbsp;&nbsp;&nbsp; {props.trade.win}</Typography> </Item>
              </Grid>

                      
               <Grid item xs={6}>
                  <Item> <Typography color="text.primary" variant="body1"> Win rate &nbsp;&nbsp;&nbsp;&nbsp;{winRate} % </Typography>   </Item>
               </Grid>
        </Grid>

      
        <Grid container rowSpacing={12} columnSpacing={{ xs: 13, sm: 5, md: 5 }}>
      
            <Grid item xs={6}>
                        <Item>  <Typography color="text.primary" variant="body1"> Losers  &nbsp;&nbsp;&nbsp;&nbsp;{props.trade.loss} </Typography></Item>
            </Grid>


             <Grid item xs={6}>

                        <Item> <Typography color="text.primary" variant="body1" >Gross P&L&nbsp;&nbsp;&nbsp;&nbsp;  ${totalPnL} </Typography></Item>
              </Grid>
            
        </Grid>


  
        
    
        <Divider variant="middle"  style={{ background: 'grey' }}   spacing={25}/>
        <Box sx={{ mt: 3, ml: 1, mb: 1 }}>
          <Button>Edit note</Button>
        </Box>
      </Box>
      
    );
  }

