

import { Calendar, Whisper, Popover, Badge } from 'rsuite';

import './styles.css';
import './calendar.css';

function getTodoList(info) {
  
 console.log(info[1]); 

  switch (6) {
   
    case 6:
      return [
        { numoftrades:  info[1]["trades"], title: 'trades', amount: '-550' },
      
      ];
    default:
      return [];
  }
}

const CalendarComponent = (props) => {
 
  function renderCell(date) {
    const list = getTodoList(props.info);
    const displayList = list.filter((item, index) => index < 2);
  
    // Check if the date matches the desired day
    const desiredDay =   props.info[1]["_id"].split('-')[2]%10; // Change this value to the desired day
    const isDesiredDay = date.getDate() === desiredDay;
  
    if (isDesiredDay && list.length) {
      const moreCount = list.length - displayList.length;
      const moreItem = (
        <li>
          <Whisper
            placement="top"
            trigger="click"
            speaker={
              <Popover>
                {list.map((item, index) => (
                  <p key={index}>
                    <b>{item.time}</b> - {item.title} 
                  </p>
                ))}
              </Popover>
            }
          >
            <a>{moreCount} more</a>
          </Whisper>
        </li>
      );
  
      return (
        <ul className="calendar-todo-list">
          {displayList.map((item, index) => (
            <li key={index}>
             <b>{item.numoftrades} {item.title}</b>  
           <br/>
              <b style={{color: "red"}}>{item.amount + '$'}</b>
            </li>
            
          ))}
          {moreCount ? moreItem : null}
        </ul>
      );
    }
  
    return null;
  }
  
    return <Calendar bordered renderCell={renderCell} />;
  };
  

  export default CalendarComponent 