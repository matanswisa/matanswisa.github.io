import * as React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import {Colors} from '../color-utils/Colors'

export default function Diveder(props) {
    const totalPnL = props.trade.totalPnL;
    const isNegative = totalPnL < 0;
    const winRate = props.trade.win / (props.trade.win + props.trade.loss) * 100; // Calculate win rate percentage
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
        <Box sx={{ m: 3 }}>
        

          <Stack direction="row" spacing={20}>
          <Chip label="Extra Soft" />
          <Chip color="primary" label="Soft" />
          <Typography color="text.secondary" variant="body2">
            Losers  {props.trade.loss}
         
          </Typography>
          <Typography color="text.secondary" variant="body2">
          Winners {props.trade.win}
         
          </Typography>
        
          </Stack>
        </Box>
        <Box sx={{ mt: 3, ml: 1, mb: 1 }}>
        <Typography color="text.primary" variant="body2">
            Win rate {winRate} %
         
          </Typography>
        </Box>
        <Divider variant="inset"  spacing={25}/>
        <Box sx={{ mt: 3, ml: 1, mb: 1 }}>
          <Button>Edit note</Button>
        </Box>
      </Box>
      
    );
  }