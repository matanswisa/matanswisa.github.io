

import { Calendar } from 'rsuite';
import { useState, useEffect } from 'react';
import './styles.css';
import './calendar.css';
import api from '../../api/api';
import userSlice, { selectCurrentAccount, selectUser } from '../../redux-toolkit/userSlice';
import { configAuth } from '../../api/configAuth';
import { useDispatch, useSelector } from 'react-redux';
import { selectlanguage } from '../../redux-toolkit/languagesSlice';

function getTodoList(info, date, isHebrew) {
  const filteredInfo = info.filter((item) => {
    const itemDate = new Date(item._id); // Convert the _id to a Date object
    return itemDate.getDate() === date.getDate(); // Check if the item date matches the provided date
  });

  return filteredInfo.map((item) => ({
    numoftrades: item.trades,
    title: item.trades > 1 ? (isHebrew ? 'עסקאות' : 'trades') : (isHebrew ? 'עסקה' : 'trade'),
    amount: item.totalPnL,
  }));
}

const CalendarComponent = (props) => {

  const { calendarTrades } = props;
  const isHebrew = useSelector(selectlanguage);

  function renderCell(date) {
    const list = getTodoList(calendarTrades, date, isHebrew);
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