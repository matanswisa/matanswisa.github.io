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

import { selectDarkMode } from '../redux-toolkit/darkModeSlice';
import { selectlanguage } from '../redux-toolkit/languagesSlice';

function createData(name) {
    return { name };
}


const Alerts = () => {
    const isHebrew = useSelector(selectlanguage);

    const darkMode = useSelector(selectDarkMode);


    let alertTitle = [
        createData( isHebrew  === true ? "בצע התראה כאשר חרגתי מכמות הטריידים שהגבלתי":'Alert me when I exceed a certain limit trades per day.'),
        createData(isHebrew  === true ? "בצע התראה כאשר הפסדתי מספר הפסדים רצוף" : 'Alert me when I lose a certain number of times in a row.'),
        createData(isHebrew  === true ? "בצע התראה לפני חדשות"  :'Alert before news.'),
    ];

    let inputsTitle = [
        [isHebrew  === true ? "מספר טריידים":"Number of trades"],
        [isHebrew  === true ? "מספר הפסדים":"Number of losing"],
        [isHebrew  === true ?"זמן בדקות":"Time in minutes"],
    ]






    // Initialize an array to track the visibility of input fields for each row
    const [inputFieldVisibility, setInputFieldVisibility] = useState(
        Array(alertTitle.length).fill(false)
    );

    // Initialize label state for each row
    const [labelState, setLabelState] = useState(
        Array(alertTitle.length).fill({ color: 'error', text: 'Off' })
    );

    const handleButtonClick = (index) => {
        // Create a copy of the inputFieldVisibility array
        const updatedInputFieldVisibility = [...inputFieldVisibility];
        // Toggle the visibility for the clicked row
        updatedInputFieldVisibility[index] = !updatedInputFieldVisibility[index];

        // Create a copy of the labelState array
        const updatedLabelState = [...labelState];
        // Toggle the label color and text
        updatedLabelState[index] = {
            color: updatedLabelState[index].color === 'error' ? 'success' : 'error',
            text: updatedLabelState[index].text === 'Off' ? 'On' : 'Off',
        };

        // Update the state with the new arrays
        setInputFieldVisibility(updatedInputFieldVisibility);
        setLabelState(updatedLabelState);
    };

    return (
        <TableContainer component={Paper} style={{width:'85%' , marginLeft:'7%' , marginTop:'5%'}}>
            <Table sx={{ minWidth: 200 }} aria-label="simple table"  >
                <TableHead>
                    <TableRow>
                        <TableCell> {isHebrew  === true ? "התראות":"Alerts"}</TableCell>
                        <TableCell>{isHebrew  === true ? "תנאי":"Condtion"}</TableCell>
                        <TableCell>{isHebrew  === true ? "סטטוס":"Status"}</TableCell>
                        <TableCell>{isHebrew  === true ? "פעולה":"Action"}</TableCell>
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
                                {labelState[index].text === 'On' ? (
                                    <Typography variant="body1">
                                        {inputsTitle[index]}
                                    </Typography>
                                ) : (
                                    <TextField
                                        id="outlined-basic"
                                        label={inputsTitle[index]}
                                        variant="outlined"
                                    />
                                )}
                            </TableCell>
                            <TableCell>
                                <Label color={labelState[index].color}>
                                    {labelState[index].text}
                                </Label>
                            </TableCell>
                            <TableCell>
                                <Button onClick={() => handleButtonClick(index)}>{labelState[index].text === 'On' ? <IconButton aria-label="Edit">
                                    <EditIcon />
                                </IconButton> : isHebrew  === true ?"שמור" : 'Save'}
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default Alerts

