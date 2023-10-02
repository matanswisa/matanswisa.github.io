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
import { Button } from '@mui/material';


function createData(name) {
    return { name };
}


const alertTitle = [
    createData('Alert me when I exceed a certain limit trades per day.'),
    createData('Alert me when I lose a certain number of times in a row.'),
    createData('Alert before news.'),
];


const inputsTitle = [
    ["Number of trades"],
    ["Number of losing"],
    ["Time in minutes"],
]

const Alerts = () => {
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
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 200 }} aria-label="simple table" >
                <TableHead>
                    <TableRow>
                        <TableCell>Alerts</TableCell>
                        <TableCell>Input</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Action</TableCell>
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
                                <Button
                                    onClick={() => handleButtonClick(index)}
                                >
                                    {labelState[index].text === 'On' ? 'Change' : 'Save'}
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

