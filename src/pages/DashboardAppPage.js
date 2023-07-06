import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
import { useState, useRef, useEffect } from 'react';
import Calendar from '../components/Calendar/calendar';
// components
import Iconify from '../components/iconify';

// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';

import api from '../api/api';
import { ReactComponent as dollarLogo } from '../icons/dollar-symbol.svg';

import { Colors } from '../components/color-utils/Colors';

// ----------------------------------------------------------------------



export default function DashboardAppPage() {
  const theme = useTheme();

  const [losingTrades,setLosingTrades] = useState(0);
  const [winningTrades,setWinningTrades] = useState(0);


  const [losingTradesInDays,setLosingTradesInDays] = useState(0);
  const [winningTradesInDays,setWinningTradesInDays] = useState(0);


  const [calendarTrades,setCalendarTrades] = useState([]);

  const DailyNetCumulativeDate = () =>
  {
   
   return dailyNetCumulative.map((trade)=>trade._id)
  }

  const DailyNetCumulativePnl = () =>
  {
    
    
   return dailyNetCumulative.map((trade)=>trade.totalPnL)
  }

  const [trades,setTrades] = useState([]);


  const [dailyNetCumulative,setDailyNetCumulative] = useState([]);


  useEffect(() => {
    api.get("/api/WinAndLossTotalTime").then(
      (res)=>{setTrades(res.data)   
       
        for (const index in res.data) {
           if (index === "lossCount"){
            setLosingTrades(res.data["lossCount"]);
           }
           else{
            setWinningTrades(res.data["winCount"]);
           }

        }
        }
    ).catch()
  },[]) 


 
  useEffect(() => {
    api.get("/api/ShowInfoByDates").then(
      (res)=>{setDailyNetCumulative(res.data)   
     
        for (const index in res.data) {

          if(res.data[index]["totalPnL"] < 0){  //when in some day we have a lose day(P&L < 0) inc variable  
            setLosingTradesInDays(prevState => prevState + 1);  
          }
   
          else{ //when in some day we have a win day(P&L > 0) inc variable  
            setWinningTradesInDays(prevState => prevState + 1);
          }
           
  
       }
     
        }
    ).catch()
  },[])



 
  useEffect(() => {
    api.get("/api/ShowNumOfTradeTotalPnlInfoByDates").then(
      (res)=>{setCalendarTrades(res.data)   
     
       
     
        }
    ).catch()
  },[])



  
  
  
  return (
    <>

    
      <Helmet>
        <title> Dashboard </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 3 }}>
          Hi, Welcome back
        </Typography>


     
        <Grid container spacing={3}>


          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title=" Total Net P&L " total={10000} color="secondary" icon={dollarLogo} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Profit Factor" total={1352831} color="secondary" />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Average Winning Trade" total={1723315} color="secondary" />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Average Losing Trade" total={234} color="secondary" />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Daily Net Cumulative P&L"
              subheader=""
              chartLabels = { DailyNetCumulativeDate()}
               
            
              chartData={[

                {
                  name: '',
                  type: 'area',
                  fill: 'gradient',
                  data: DailyNetCumulativePnl(),
                  color: Colors.green

                  
                },

              ]}
            />


          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Winning % By Trades"
              chartData={[
                { label: 'Winners', value: winningTrades },
                { label: 'Lossers', value: losingTrades },

              ]}
              chartColors={[
                Colors.green,
                Colors.red,
              ]}
            />



          </Grid>



          <Grid item xs={12} md={6} lg={7}>
    
          <Calendar/>
          </Grid>


          <Grid item s={12} md={6} lg={5}>

            <AppCurrentVisits
              title="Winning % By Days"
              chartData={[
                { label: 'Winners', value: winningTradesInDays},
                { label: 'Lossers', value: losingTradesInDays },
              ]}
              chartColors={[
                Colors.green,
                Colors.red,

              ]}
            />

          </Grid>

        

          
          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Score"
              chartLabels={['Win %', 'Avg win/loss', 'Profit Factor']}
              chartData={[
                { name: 'Series 1', data: [80, 50, 30] },


              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid>


        </Grid>
      </Container>
    </>
  );
}
