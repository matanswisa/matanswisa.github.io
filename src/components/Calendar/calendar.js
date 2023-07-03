

import { Calendar, Whisper, Popover, Badge } from 'rsuite';

import './styles.css';
import './calendar.css';

function getTodoList(info) {
  
 console.log(info);

  switch (3) {
    case 3:
      return [
        { time: '10:30 am', title: 'trades' },
        { time: '12:00 pm', title: '$' }
      ];
    case 15:
      return [
        { trade: '1', title: '1' },
      
      ];
    default:
      return [];
  }
}

const CalendarComponent = (props) => {
 
    function renderCell(date) {
      const list = getTodoList(props.info);
      const displayList = list.filter((item, index) => index < 2);
  
      if (list.length) {
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
                <Badge /> <b>{item.trade}</b> - {item.title}
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