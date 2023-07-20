

import { Calendar } from 'rsuite';
import { useState,  useEffect } from 'react';
import './styles.css';
import './calendar.css';
import api from '../../api/api';



function getTodoList(info, date) {
  const filteredInfo = info.filter((item) => {
    const itemDate = new Date(item._id); // Convert the _id to a Date object
    return itemDate.getDate() === date.getDate(); // Check if the item date matches the provided date
  });

  return filteredInfo.map((item) => ({
    numoftrades: item.trades,
    title: 'trades',
    amount: item.totalPnL,
  }));
}

const CalendarComponent = () => {
  const [calendarTrades, setCalendarTrades] = useState([]);

  useEffect(() => {
    api.get('/api/ShowNumOfTradeTotalPnlInfoByDates')
      .then((res) => {
        setCalendarTrades(res.data);
     
      })
      .catch();
  }, []);
  function renderCell(date) {
    const list = getTodoList(calendarTrades, date);
    const displayList = list.filter((item, index) => index < 2);
  
    const desiredDays = calendarTrades
      .filter((trade) => {
        const tradeDate = new Date(trade._id); // Convert the _id to a Date object
        const tradeMonth = tradeDate.getMonth();
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
  
        // Filter trades from the current month and the previous month
        return tradeMonth === date.getMonth() || tradeMonth === currentMonth - 1;
      })
      .map((trade) => parseInt(trade._id.split("-")[2] > 0 ? trade._id.split("-")[2] : trade._id.split("-")[2] % 10));
  
    const isDesiredDay = desiredDays.includes(date.getDate());
    const isCurrentMonth = date.getMonth() === new Date().getMonth();
  
    if (isDesiredDay && isCurrentMonth && list.length) {
      return (
        <div>
          {displayList.map((item, index) => (
            <div key={index}>
              <b>
                {item.numoftrades} {item.title}
              </b>
              <br />
              {item.amount < 0 ? (
                <b style={{ color: 'red' }}>-{Math.abs(item.amount)}$</b>
              ) : item.amount > 0 ? (
                <b style={{ color: 'green' }}>+{item.amount}$</b>
              ) : (
                <b style={{ color: 'blue' }}>{item.amount}$</b>
              )}
            </div>
          ))}
        </div>
      );
    }
  
    return null;
  }
  return <Calendar bordered renderCell={renderCell} />;
};

export default CalendarComponent;