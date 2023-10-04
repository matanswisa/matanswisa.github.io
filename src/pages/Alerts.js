import React from 'react'
import Typography from '@mui/material/Typography';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Label from '../components/label/Label';
import Switch from '@mui/material/Switch';
import { useState } from 'react';
import { Button, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit'; // Import EditIcon
import { useDispatch, useSelector } from 'react-redux';
import { selectUser ,selectAlerts , setAlerts} from '../redux-toolkit/userSlice';
import { selectDarkMode } from '../redux-toolkit/darkModeSlice';
import { selectlanguage } from '../redux-toolkit/languagesSlice';
import { number } from 'prop-types';
import { useEffect } from 'react';
import api from '../api/api';



function createData(type,name, condition) {
    return { type,name, condition };
}


const Alerts = () => {
    const darkMode = useSelector(selectDarkMode);
    const isHebrew = useSelector(selectlanguage);
    const user = useSelector(selectUser);
    const alerts = useSelector(selectAlerts);
    const dispatch = useDispatch();
    const [conditions, setConditions] = useState([]);

    
    useEffect(() => {
        if (alerts) {
            const initialConditions = alerts.map((alert) => alert.condition);
            setConditions(initialConditions);
        }
    }, [alerts]);
    


    // default values : 
    let initialAlertTitle = [
        createData("Over Trading",isHebrew === true ? "בצע התראה כאשר חרגתי מכמות הטריידים שהגבלתי" : 'Alert me when I exceed a certain limit trades per day.', 0),
        createData("Losses in a row",isHebrew === true ? "בצע התראה כאשר הפסדתי מספר הפסדים רצוף" : 'Alert me when I lose a certain number of times in a row.', 0),
        // createData(isHebrew  === true ? "בצע התראה לפני חדשות"  :'Alert before news.'),
    ];





    let inputsTitle = [
        [isHebrew === true ? "מספר טריידים" : "Number of trades"],
        [isHebrew === true ? "מספר הפסדים" : "Number of losing"],
        // [isHebrew  === true ?"זמן בדקות":"Time in minutes"],
    ]




    // read alerts from db. if is enable show 0 in inputs.
    if (alerts) {
        initialAlertTitle = [
            createData("Over Trading",isHebrew === true ? "בצע התראה כאשר חרגתי מכמות הטריידים שהגבלתי" : 'Alert me when I exceed a certain limit trades per day.',alerts[0].condition),
            createData("Losses in a row",isHebrew === true ? "בצע התראה כאשר הפסדתי מספר הפסדים רצוף" : 'Alert me when I lose a certain number of times in a row.',alerts[1].condition),
            // createData(isHebrew  === true ? "בצע התראה לפני חדשות"  :'Alert before news.'),0
        ];
    }

    const [alertTitle, setAlertTitle] = useState([...initialAlertTitle]);




    const [inputFieldValues, setInputFieldValues] = useState(Array(alertTitle.length).fill(''));


    const validateForm = (index) => {
        if (inputFieldValues[index].trim() === '') {
            alert('Input field cannot be empty'); // You can replace this with your preferred validation feedback
            return;
        }
        if (isNaN(inputFieldValues[index])) {
            alert('Input must be a valid number'); // You can customize this message
            return;
        }
        if (isNaN(inputFieldValues[index]) || parseFloat(inputFieldValues[index]) < 1) {
            alert('Input must be a valid positive number'); // You can customize this message
            return;
        }
        return true;
    }






    //------------------------------------------------ handle reset condtion -----------------------------------------------------//
    const handleResetCondition = async (index) => {
        const data = {
            userId: user._id,
            indexofAlert : index,
        };

        try {
            const response = await api.put('/api/auth/resetAlert', data, {
              headers: { Authorization: "Bearer " + user.accessToken }
            });
        
            if (response.status === 200) {
             
                dispatch(setAlerts(response.data));

              // You can also do other actions here if needed
            } else {
              // Handle other status codes, e.g., 400, 500, etc.
              console.log("Request failed with status code:", response.status);
            }
          } catch (err) {
            // Handle any exceptions that occurred during the request
            console.error(err);
            // Handle the error as needed
          }
    };


    //------------------------------------------------ handle reset condtion -----------------------------------------------------//
    const handleSetAlert = async (index,value) => {
        const data = {
            userId: user._id,
            indexofAlert : index,
            condition: value,
        };
        console.log(data);
        try {
            const response = await api.put('/api/auth/setAlert', data, {
              headers: { Authorization: "Bearer " + user.accessToken }
            });
        
            if (response.status === 200) {

                dispatch(setAlerts(response.data));

                
              
              // You can also do other actions here if needed
            } else {
              // Handle other status codes, e.g., 400, 500, etc.
              console.log("Request failed with status code:", response.status);
            }
          } catch (err) {
            // Handle any exceptions that occurred during the request
            console.error(err);
            // Handle the error as needed
          }


    };



    const handleEditClick = (index) => {
        const updatedAlertTitle = [...alertTitle];
        updatedAlertTitle[index].condition = 0;
        setAlertTitle(updatedAlertTitle);
        ///update alert to 0 in db.
        handleResetCondition(index);
    };


    // after click save new alert condtions in db.   and fetch to redux.
    const handleButtonClick = (index) => {
        if (validateForm(index)) {
          //update condtion in db. 
            handleSetAlert(index, inputFieldValues[index]);
        }
    };

    return (
        <TableContainer component={Paper} style={{ width: '85%', marginLeft: '7%', marginTop: '5%' }}>
            <Table sx={{ minWidth: 200 }} aria-label="simple table"  >
                <TableHead>
                    <TableRow>
                    <TableCell> {isHebrew === true ? "סוג התראה" : "Alert Type"}</TableCell>
                        <TableCell> {isHebrew === true ? "תיאור התראה" : "Alert Discription"}</TableCell>
                        <TableCell>{isHebrew === true ? "תנאי" : "Condtion"}</TableCell>
                        <TableCell>{isHebrew === true ? "סטטוס" : "Status"}</TableCell>
                        <TableCell>{isHebrew === true ? "פעולה" : "Action"}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {alertTitle.map((row, index) => (
                        <TableRow
                            key={row.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                              <TableCell component="th" scope="row">
                                <h6>{row.type}</h6>
                            </TableCell>

                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>


                            <TableCell>
                                {conditions[index]  !== 0 ? (
                                      conditions[index]
                                ) : (
                                    <TextField
                                        id="outlined-basic"
                                        label={inputsTitle[index]}
                                        variant="outlined"
                                        required
                                        value={inputFieldValues[index]}
                                        onChange={(e) => {
                                            const updatedInputFieldValues = [...inputFieldValues];
                                            updatedInputFieldValues[index] = e.target.value;
                                            setInputFieldValues(updatedInputFieldValues);
                                        }}
                                    />
                                )}
                            </TableCell>


                            <TableCell>
                                {  conditions[index] !== 0 ? (
                                    <Label color="success">On</Label>
                                ) : (
                                    <Label color="error">Off</Label>
                                )}
                            </TableCell>


                            <TableCell>
                                {  conditions[index] !== 0 ? (

                                    <IconButton aria-label="Edit" onClick={() => handleEditClick(index)}>
                                        <EditIcon />
                                    </IconButton>
                                ) : (

                                    <Button onClick={() => handleButtonClick(index)}>
                                        {isHebrew === true ? "שמור" : 'Save'}
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}

                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default Alerts

