import { Helmet } from 'react-helmet-async';

// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
import { useState,  useEffect } from 'react';
import Calendar from '../components/Calendar/calendar';
// components

import { useSelector } from 'react-redux';
// import { getTrades, getTradesList, setTrades as setTradesRedux } from '../redux-toolkit/tradesSlice';
// import {}
// sections
import {

  AppCurrentVisits,
  AppWebsiteVisits,

  AppWidgetSummary,
 
} from '../sections/@dashboard/app';

import api from '../api/api';


import { Colors } from '../components/color-utils/Colors';


import { selectCurrentAccount } from '../redux-toolkit/userSlice';
// ----------------------------------------------------------------------


const sumPnL = (trades) => {
  let sum = 0;
  trades.forEach((trade) => {
    if (trade !== null && trade?.netPnL !== null) sum += trade.netPnL
  });
  return sum;
}

const avgLosingTrades = (trades) => {
  let sum = 0;
  let countTrades = 0;
  trades.forEach((trade) => {
    if (trade && trade?.netPnL < 0) {
      sum += trade.netPnL;
      countTrades++;
    }
  });
  return sum / countTrades;

}



const avgWinningTrades = (trades) => {
  let sum = 0;
  let countTrades = 0;
  trades.forEach((trade) => {
    if (trade && trade.netPnL > 0) {
      sum += trade.netPnL;
      countTrades++;
    }
  });
  return sum / countTrades;

}


const ProfitFactor = (trades) => {
  let SumWin = 0;
  let SumLoss = 0;
  trades.forEach((trade) => {
    if (trade && trade?.netPnL > 0) {
      SumWin += trade.netPnL;

    }
    else if (trade && trade?.netPnL < 0) {
      SumLoss += trade.netPnL;
    }
  });

  if (SumWin == 0 || SumLoss == 0) return 0;


  return SumWin / SumLoss < 0 ? SumWin / SumLoss * -1 : SumWin / SumLoss;
}



export default function DashboardAppPage() {



  const currentAccount = useSelector(selectCurrentAccount)
  let Alltrades;
  if(currentAccount?.trades){

   Alltrades = currentAccount?.trades;
  }
  else{
     Alltrades = [];
  }
  
  const theme = useTheme();

  const [losingTrades, setLosingTrades] = useState(0);
  const [winningTrades, setWinningTrades] = useState(0);
  const [breakEvenTrades, setbreakEvenTrades] = useState(0);


  const [losingTradesInDays, setLosingTradesInDays] = useState(0);
  const [winningTradesInDays, setWinningTradesInDays] = useState(0);


  const [calendarTrades, setCalendarTrades] = useState([]);




  const DailyNetCumulativeDateProfit = () => {
    const WinTradesDates = [];

    dailyNetCumulative.forEach((trade) => {
      if (trade.totalPnL > 0) {
        WinTradesDates.push(trade._id);
      }
    });
    return WinTradesDates;
  }


  const DailyNetCumulativeDateLoss = () => {
    const WinTradesDates = [];

    dailyNetCumulative.forEach((trade) => {
      if (trade.totalPnL < 0) {
        WinTradesDates.push(trade._id);
      }
    });
    return WinTradesDates;
  }



  const DailyNetCumulativePnlProfit = () => {
    const WinTrades = [];

    dailyNetCumulative.forEach((trade) => {
      if (trade.totalPnL > 0) {
        WinTrades.push(trade.totalPnL);
      }
    });

    return WinTrades;
  }




  const DailyNetCumulativePnlLoss = () => {
    const LossTrades = [];

    dailyNetCumulative.forEach((trade) => {
      if (trade.totalPnL < 0) {
        LossTrades.push(trade.totalPnL);
      }
    });

    return LossTrades;
  }


  const [trades, setTrades] = useState([]);


  const [dailyNetCumulative, setDailyNetCumulative] = useState([]);


  useEffect(() => {
    api.get("/api/WinAndLossTotalTime").then(
      (res) => {
        setTrades(res.data)

        for (const index in res.data) {
          if (index === "lossCount") {
            setLosingTrades(res.data["lossCount"]);
          }
          else if (index === "breakEvenCount") {

            setbreakEvenTrades(res.data["breakEvenCount"]);
          }
          else {
            setWinningTrades(res.data["winCount"]);
          }

        }
      }
    ).catch()
  }, [])



  useEffect(() => {
    api.get("/api/ShowInfoByDates").then(
      (res) => {
        setDailyNetCumulative(res.data)

        for (const index in res.data) {

          if (res.data[index]["totalPnL"] < 0) {  //when in some day we have a lose day(P&L < 0) inc variable  
            setLosingTradesInDays(prevState => prevState + 1);
          }

          else { //when in some day we have a win day(P&L > 0) inc variable  
            setWinningTradesInDays(prevState => prevState + 1);
          }
        }
      }
    ).catch()
  }, [])



  useEffect(() => {
    api.get("/api/ShowNumOfTradeTotalPnlInfoByDates").then(
      (res) => {
        setCalendarTrades(res.data)
      }
    ).catch()
  }, [])

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>

      <Container maxWidth="xl">
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0px', marginRight: '3px' }}>
          {/* Your SelectAccount component content goes here */}


        </div>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Hi, Welcome back
        </Typography>
      

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total Net P&L" total={sumPnL(Alltrades)} icon={'eva:pie-chart-outline'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Profit Factor" total={ProfitFactor(Alltrades)} icon={'eva:grid-outline'} color="secondary" />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Average Winning Trade" total={avgWinningTrades(Alltrades)} icon={'eva:bar-chart-2-outline'} color="secondary" />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Average Losing Trade" total={avgLosingTrades(Alltrades)} icon={'eva:bar-chart-outline'} color="secondary" />
          </Grid>
        </Grid>

        <Grid container spacing={5}>
          <Grid item xs={12} md={6} lg={8}>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <AppWebsiteVisits
                  title="Daily Net Cumulative Profit"
                  subheader=""
                  chartLabels={DailyNetCumulativeDateProfit()}
                  chartData={[
                    {
                      name: '',
                      type: 'area',
                      fill: 'gradient',
                      data: DailyNetCumulativePnlProfit(),
                      color: Colors.green
                    },
                  ]}
                />
                <AppWebsiteVisits
                  title="Daily Net Cumulative Loss"
                  subheader=""
                  chartLabels={DailyNetCumulativeDateLoss()}
                  chartData={[
                    {
                      name: '',
                      type: 'area',
                      fill: 'gradient',
                      data: DailyNetCumulativePnlLoss(),
                      color: Colors.red
                    },
                  ]}
                />


              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>

                <AppCurrentVisits
                  title="Winning % By Trades"
                  chartData={[
                    { label: 'Winners', value: winningTrades },
                    { label: 'Losers', value: losingTrades },
                    { label: 'Break Even', value: breakEvenTrades },
                  ]}
                  chartColors={[Colors.green, Colors.red]}
                />

                <AppCurrentVisits
                  title="Winning % By Days"
                  chartData={[
                    { label: 'Winners', value: winningTradesInDays },
                    { label: 'Losers', value: losingTradesInDays },
                  ]}
                  chartColors={[Colors.green, Colors.red]}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Calendar />
          </Grid>
        </Grid>
      </Container >
    </>
  );

}


