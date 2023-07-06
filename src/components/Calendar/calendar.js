

import { Calendar, Whisper, Popover, Badge } from 'rsuite';
import { useState, useRef, useEffect } from 'react';
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
        console.log(res.data);
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
        const tradeYear = tradeDate.getFullYear();
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // Filter trades from the current month and the previous month
        return (
          (tradeMonth === date.getMonth() && tradeYear === date.getFullYear()) ||
          (tradeMonth === currentMonth - 1 && tradeYear === currentYear)
        );
      })
      .map((trade) =>
        parseInt(trade._id.split('-')[2] > 0 ? trade._id.split('-')[2] : trade._id.split('-')[2] % 10)
      );

    const isDesiredDay = desiredDays.includes(date.getDate());
    const isCurrentMonth =
      date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear();

    if (isDesiredDay && (isCurrentMonth || list.length)) {
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
              ) : (
                <b style={{ color: 'green' }}>+{item.amount}$</b>
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