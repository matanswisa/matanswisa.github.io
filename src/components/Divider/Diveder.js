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


export default function Diveder(props) {
    const totalPnL = props.trade.totalPnL;
    const isNegative = totalPnL < 0;
    const winRate = (props.trade.win / (props.trade.win + props.trade.loss) * 100).toFixed(2); // Calculate win rate percentage
    console.log(props.trade);
    return (
      <Box sx={{ width: '100%', maxWidth: 800, bgcolor: 'background.paper' }}>
        <Box sx={{ my: 3, mx: 2 }}>
          <Grid container alignItems="center">
            <Grid item xs>
              <Typography gutterBottom variant="h4" component="div">
                {props.trade._id}
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                gutterBottom
                variant="h4"
                component="div"
                sx={{ color: isNegative ? Colors.red : Colors.green }}
              >
                ${totalPnL}
              </Typography>
            </Grid>
          </Grid>
          <Typography color="text.primary" variant="body1">
            {props.trade.numberOfTrades} Trades
          </Typography>
        </Box>
        <Divider variant="middle"  spacing={25}/>
        
        
        <Grid container rowSpacing={12} columnSpacing={{ xs: 3, sm: 5, md: 5 }}>
                      <Grid item xs={6}>
                        <Item>      <Typography color="text.secondary" variant="body2">
          Winners {props.trade.win}
         
          </Typography> </Item>
                      </Grid>
                      <Grid item xs={6}>
                        <Item>  <Typography color="text.secondary" variant="body2">
            Losers  {props.trade.loss}
         
          </Typography></Item>
                      </Grid>
            
        </Grid>

        <Divider variant="inset"  spacing={25}/>

  
        <Grid container rowSpacing={12} columnSpacing={{ xs: 13, sm: 5, md: 5 }}>
                      <Grid item xs={6}>
                        <Item>     <Typography color="text.primary" variant="body2">
            Win rate {winRate} %
         
          </Typography>   </Item>
                      </Grid>
                      <Grid item xs={6}>
                        <Item> 3</Item>
                      </Grid>
            
        </Grid>


     

          
        
     

       
       
      
        
    
        <Divider variant="inset"  spacing={25}/>
        <Box sx={{ mt: 3, ml: 1, mb: 1 }}>
          <Button>Edit note</Button>
        </Box>
      </Box>
      
    );
  }