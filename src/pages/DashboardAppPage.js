import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';

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


import { ReactComponent as dollarLogo } from '../icons/dollar-symbol.svg';

import { Colors } from '../components/color-utils/Colors';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();


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
              chartLabels={[
                '01/01/2022',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
              ]}
              chartData={[

                {
                  name: 'Team B',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                  color: Colors.green
                },

              ]}
            />


          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Winning % By Trades"
              chartData={[
                { label: 'Winners', value: 5435 },
                { label: 'Lossers', value: 4224 },

              ]}
              chartColors={[
                Colors.green,
                Colors.red,
              ]}
            />



          </Grid>



          <Grid item xs={12} md={6} lg={7}>
            <h2>calender </h2>
          </Grid>


          <Grid item s={12} md={6} lg={5}>

            <AppCurrentVisits
              title="Winning % By Days"
              chartData={[
                { label: 'Winners', value: 4224 },
                { label: 'Lossers', value: 5435 },
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
