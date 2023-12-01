import Divider from '../components/trades/DailystatsView/Divider'
import { Helmet } from 'react-helmet-async';
import { filter, includes, lowerCase } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Container,
  Typography,
  FormControl,
} from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { selectCurrentAccount, selectUser } from '../redux-toolkit/userSlice';
import { selectDarkMode } from '../redux-toolkit/darkModeSlice';
import { selectlanguage } from '../redux-toolkit/languagesSlice';
import api from '../api/api';
import axiosInstance from '../utils/axiosService';



export default function DailyStatsPage() {


  //------------------------------------------------   States ----------------------------------------------------- //
  const [trades, setTrades] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null); // New state for the selected date
  const currentAccount = useSelector(selectCurrentAccount);
  const darkMode = useSelector(selectDarkMode);
  const isHebrew = useSelector(selectlanguage);

  const user = useSelector(selectUser);

  useEffect(() => {

    // Check if currentAccount and currentAccount.trades are not null/undefined
    if (currentAccount?.trades) {
      axiosInstance.post('/api/DailyStatsInfo', { trades: currentAccount.trades })
        .then((res) => {
          setTrades(res.data);
        })
        .catch((error) => {
        });
    }
  }, [currentAccount?.trades]);


  //handle filter reuslts by date
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleClearDate = () => {
    setSelectedDate(null);
  };

  return (
    <>
      <Helmet>
        <title>{isHebrew === false ? "Daily Stats" : "סטטיסטיקה יומית"}</title>
      </Helmet>
      <FormControl variant="outlined" style={{ minWidth: 120 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ marginRight: "10px" }}>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="E, MMM d, yyyy"
              placeholderText="Select a date"
            />
          </div>
          <Button style={{ fontSize: "12px", minWidth: "80px", backgroundColor: darkMode ? '#1ba6dc' : "", color: darkMode ? 'white' : "", }}

            variant="contained"
            onClick={handleClearDate}

          >
            {isHebrew === false ? "Clear" : "נקה"}
          </Button>
        </div>

      </FormControl >
      <Container>
        <div style={{ maxHeight: '850px', maxWidth: '1400px', overflowY: 'scroll' }}>

          {trades.length === 0 ?
            <Typography variant="h6" gutterBottom style={{ marginLeft: "30%" }}>
              {isHebrew === false ? "Add Trades in Reports to view data." : ".אנא הוסף טריידים בדוחות על מנת לראות נתונים"}
            </Typography>
            : ""
          }
          {trades
            .filter((trade) => {
              // Filter trades based on the selected date
              if (!selectedDate) {
                return true; // Show all trades if no date is selected
              }
              const tradeDate = new Date(trade._id);
              return tradeDate.toDateString() === selectedDate.toDateString();
            })
            .map((trade) => (
              <Divider trade={trade} key={trade.id} />
            ))}
        </div>
      </Container>
    </>
  );
}