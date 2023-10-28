import { Helmet } from 'react-helmet-async';

// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Button } from '@mui/material';
import { useState, useEffect } from 'react';
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


import { selectCurrentAccount, selectUser } from '../redux-toolkit/userSlice';
import { selectlanguage } from '../redux-toolkit/languagesSlice';
import axiosInstance from '../utils/axiosService';
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
  //------------------------------------------------   States ----------------------------------------------------------------------------------
  const isHebrew = useSelector(selectlanguage);
  const [losingTrades, setLosingTrades] = useState(0);
  const [winningTrades, setWinningTrades] = useState(0);
  const [breakEvenTrades, setbreakEvenTrades] = useState(0);
  const [losingTradesInDays, setLosingTradesInDays] = useState(0);
  const [winningTradesInDays, setWinningTradesInDays] = useState(0);
  const [calendarTrades, setCalendarTrades] = useState([]);
  const [trades, setTrades] = useState([]);
  const [dailyNetCumulative, setDailyNetCumulative] = useState([]);
  const currentAccount = useSelector(selectCurrentAccount)

  //------------------------------------------------handle trade by current account selected -----------------------------------------------------
  let Alltrades;
  if (currentAccount?.trades) {

    Alltrades = currentAccount?.trades;
  }
  else {
    Alltrades = [];
  }

  // ------------------------------------------handle "Daily Net "Daily Net Cumulative Profit"-----------------------------------------------------

  /*This function save Date for each day with profit and show the dates on the graph -> "Daily Net Cumulative Profit" */
  const DailyNetCumulativeDateProfit = () => {
    const WinTradesDates = [];

    dailyNetCumulative.forEach((trade) => {
      if (trade.totalPnL > 0) {
        WinTradesDates.push(trade._id);
      }
    });
    return WinTradesDates;
  }

  /*This function save Profit for each day with profit and show the Profits on the graph -> "Daily Net Cumulative Profit" */
  const DailyNetCumulativePnlProfit = () => {
    const WinTrades = [];

    dailyNetCumulative.forEach((trade) => {
      if (trade.totalPnL > 0) {
        WinTrades.push(trade.totalPnL);
      }
    });

    return WinTrades;
  }

  // -----------------------------------------------handle "Daily Net Cumulative Loss" -------------------------------------------------------------

  /*This function save Date for each day with Losses and show the dates on the graph -> "Daily Net Cumulative Loss"*/
  const DailyNetCumulativeDateLoss = () => {
    const LossTradesDates = [];

    dailyNetCumulative.forEach((trade) => {
      if (trade.totalPnL < 0) {
        LossTradesDates.push(trade._id);
      }
    });
    return LossTradesDates;
  }

  /*This function save Losses for each day with Loss and show the Losses on the graph ->  "Daily Net Cumulative Loss" */
  const DailyNetCumulativePnlLoss = () => {
    const LossTrades = [];

    dailyNetCumulative.forEach((trade) => {
      if (trade.totalPnL < 0) {
        LossTrades.push(trade.totalPnL);
      }
    });

    return LossTrades;
  }


  //-----------------------------------------------handle "Winning % By Trades" cake. --------------------------------------------------------------

  useEffect(() => {
    const fetchDashboardData = async () => {


      const winAndLossTotalTimePromise = new Promise(async (resolve, reject) => {
        // this post handle "Winning % By Trades" cake.
        const result = await axiosInstance.post('/api/WinAndLossTotalTime', { trades: Alltrades });
        if (result.status == 200 || result.status == 201) {
          for (const index in result.data) {
            if (index === "lossCount") {
              setLosingTrades(result.data["lossCount"]);
            }
            else if (index === "breakEvenCount") {

              setbreakEvenTrades(result.data["breakEvenCount"]);
            }
            else {
              setWinningTrades(result.data["winCount"]);
            }

          }
          resolve(result.data);
        } else {
          reject(`Failed ${result.status} `);
        }

      });

      const ShowInfoByDatesPromise = new Promise(async (resolve, reject) => {
        // this post handle  "Winning % By Days" cake. 
        const result = await axiosInstance.post('/api/ShowInfoByDates', { trades: Alltrades });
        if (result.status == 200 || result.status == 201) {
          setDailyNetCumulative(result.data)

          if (!result.data.length) {
            setLosingTradesInDays(0);
            setWinningTradesInDays(0)
          }

          for (const index in result.data) {

            if (result.data[index]["totalPnL"] < 1) {  //when in some day we have a lose day(P&L < 0) inc variable  
              setLosingTradesInDays(prevState => prevState + 1);
            }

            else { //when in some day we have a win day(P&L > 0) inc variable  
              setWinningTradesInDays(prevState => prevState + 1);
            }
          }
          resolve(result.data);
        } else {
          reject(`Failed ${result.status} when try to fetch info by dates`);
        }

      });

      const updateCalenderDisplayPromiseObject = new Promise(async (resolve, reject) => {

        //this post request responsible to update the calender display.
        const result = await axiosInstance.post("/api/ShowNumOfTradeTotalPnlInfoByDates", { trades: Alltrades })
        if (result.status == 200 || result.status == 201) {
          setCalendarTrades(result.data)
          resolve(result.data);
        } else {
          reject("Rejected with status , fetching calender trades data" + result.status);
        }
      });

      return [winAndLossTotalTimePromise, ShowInfoByDatesPromise, updateCalenderDisplayPromiseObject];
    }

    fetchDashboardData().then(data => {
      Promise.allSettled(data).then((results) => results.forEach((result) => console.log(result)))
    })


  }, [currentAccount])





  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>

      <Container maxWidth="xl">
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0px', marginRight: '3px' }}>
          {/* Your SelectAccount component content goes here */}


        </div>


        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title={isHebrew === false ? "Total Net P&L" : "רווח/הפסד טוטאל"} total={sumPnL(Alltrades)} icon={'eva:pie-chart-outline'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title={isHebrew === false ? "Profit Factor" : "פקטור רווח"} total={ProfitFactor(Alltrades)} icon={'eva:grid-outline'} color="secondary" />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title={isHebrew === false ? "Average Winning Trade" : "ממוצע לטרייד מנצח"} total={avgWinningTrades(Alltrades)} icon={'eva:bar-chart-2-outline'} color="secondary" />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title={isHebrew === false ? "Average Losing Trade" : "ממוצע לטרייד מפסיד"} total={avgLosingTrades(Alltrades)} icon={'eva:bar-chart-outline'} color="secondary" />
          </Grid>
        </Grid>

        <Grid container spacing={5}>
          <Grid item xs={12} md={6} lg={8}>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <AppWebsiteVisits
                  title={isHebrew === false ? "Daily Net Cumulative Profit" : "רווח יומי נקי מצטבר"}
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
                  title={isHebrew === false ? "Daily Net Cumulative Loss" : "הפסד יומי נקי מצטבר"}
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
                <div style={{ display: 'grid', gridTemplateColumns: ' auto', }}>

                  <AppCurrentVisits
                    title={isHebrew === false ? "Winning % By Trades" : "אחוזי ניצחון בעסקאות"}
                    chartData={[
                      { label: isHebrew === false ? 'Winners' : "נצחונות", value: winningTrades },
                      { label: isHebrew === false ? 'Losers' : "הפסדים", value: losingTrades },
                      { label: isHebrew === false ? 'Break Even' : "ברייק איוון", value: breakEvenTrades },
                    ]}
                    chartColors={[Colors.green, Colors.red]}
                  />

                  {/* for version 2 or 1 ?? */}
                  {/* <Button variant="contained" color="primary" style={buttonStyle}>
                  Winning % By Trades History
                  </Button> */}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: ' auto', }}>
                  <AppCurrentVisits
                    title={isHebrew === false ? "Winning % By Days" : "אחוזי ניצחון בימים"}
                    chartData={[
                      { label: isHebrew === false ? 'Winners' : "נצחונות", value: winningTradesInDays },
                      { label: isHebrew === false ? 'Losers' : "הפסדים", value: losingTradesInDays },
                    ]}
                    chartColors={[Colors.green, Colors.red]}
                  />

                  {/* for version 2 or 1 ?? */}
                  {/* <Button variant="contained" color="primary" style={buttonStyle}>
                 Winning % By Days History
                  </Button> */}
                </div>

              </Grid>

            </Grid>

          </Grid>

        </Grid>

        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Calendar calendarTrades={calendarTrades} />
          </Grid>
        </Grid>
      </Container >
    </>
  );

}


const buttonStyle = {
  fontSize: '12px', // Adjust the font size to make the button smaller
  padding: '1px 3px', // Adjust padding to control the button's size
  color: 'black',
  backgroundColor: 'white', // Set the background color to white
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'column', // Arrange items vertically
  alignItems: 'flex-start', // Align items to the start (top)
};