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
import { selectUser } from '../redux-toolkit/userSlice';
import { selectDarkMode } from '../redux-toolkit/darkModeSlice';
import { selectlanguage } from '../redux-toolkit/languagesSlice';
import { number } from 'prop-types';
import { useEffect } from 'react';
import api from '../api/api';



function createData(name, condition) {
    return { name, condition };
}


const Alerts = () => {
    const darkMode = useSelector(selectDarkMode);
    const isHebrew = useSelector(selectlanguage);
    const alerts = useSelector(selectUser);

    
    
    
    
    // default values : 
    let initialAlertTitle = [
        createData(isHebrew === true ? "בצע התראה כאשר חרגתי מכמות הטריידים שהגבלתי" : 'Alert me when I exceed a certain limit trades per day.', 2),
        createData(isHebrew === true ? "בצע התראה כאשר הפסדתי מספר הפסדים רצוף" : 'Alert me when I lose a certain number of times in a row.', 0),
        // createData(isHebrew  === true ? "בצע התראה לפני חדשות"  :'Alert before news.'),
    ];
    
    let inputsTitle = [
        [isHebrew === true ? "מספר טריידים" : "Number of trades"],
        [isHebrew === true ? "מספר הפסדים" : "Number of losing"],
        // [isHebrew  === true ?"זמן בדקות":"Time in minutes"],
    ]
    
    let condition = 3;
    
    
    
    
    // read alerts from db. if is enable show 0 in inputs.
    if (condition != 0) {
        initialAlertTitle = [
            createData(isHebrew === true ? "בצע התראה כאשר חרגתי מכמות הטריידים שהגבלתי" : 'Alert me when I exceed a certain limit trades per day.', condition),
            createData(isHebrew === true ? "בצע התראה כאשר הפסדתי מספר הפסדים רצוף" : 'Alert me when I lose a certain number of times in a row.', condition),
            // createData(isHebrew  === true ? "בצע התראה לפני חדשות"  :'Alert before news.'),
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


       const [inputFieldVisibility, setInputFieldVisibility] = useState(
        alertTitle.map((row) => row.condition === 0)
    );


    // Initialize label state for each row
    const [labelState, setLabelState] = useState(
        Array(alertTitle.length).fill({ color: 'error', text: 'Off' })
    );


    const handleEditClick = (index) => {
        const updatedAlertTitle = [...alertTitle];
    updatedAlertTitle[index].condition = 0;
    setAlertTitle(updatedAlertTitle);
    ///update alert to 0 in db.
    }; 
    

    // after click save alert condtion in db. 
    const handleButtonClick = (index) => {
        if (validateForm(index)) {


            // //     handleCreateAlert(index, inputFieldValues[index]);

            // // Create a copy of the inputFieldVisibility array
            // const updatedInputFieldVisibility = [...inputFieldVisibility];
            // // Toggle the visibility for the clicked row
            // updatedInputFieldVisibility[index] = !updatedInputFieldVisibility[index];

            // // Create a copy of the labelState array
            // const updatedLabelState = [...labelState];
            // // Toggle the label color and text
            // updatedLabelState[index] = {
            //     color: updatedLabelState[index].color === 'error' ? 'success' : 'error',
            //     text: updatedLabelState[index].text === 'Off' ? 'On' : 'Off',
            // };

            // // Update the state with the new arrays
            // setInputFieldVisibility(updatedInputFieldVisibility);
            // setLabelState(updatedLabelState);

        }
    };

    return (
        <TableContainer component={Paper} style={{ width: '85%', marginLeft: '7%', marginTop: '5%' }}>
            <Table sx={{ minWidth: 200 }} aria-label="simple table"  >
                <TableHead>
                    <TableRow>
                        <TableCell> {isHebrew === true ? "התראות" : "Alerts"}</TableCell>
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
                                {row.name}
                            </TableCell>


                            <TableCell>
                                {row.condition !== 0 ? (
                                    row.condition
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
                                {row.condition !== 0 ? (
                                    <Label color="success">On</Label>
                                ) : (
                                    <Label color="error">Off</Label>
                                )}
                            </TableCell>




                            <TableCell>
                                {row.condition !== 0 ? (

                                    
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

