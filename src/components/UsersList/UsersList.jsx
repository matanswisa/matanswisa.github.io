import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Button,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Slide
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'; // Import DeleteIcon
import EditIcon from '@mui/icons-material/Edit'; // Import EditIcon
import 'react-toastify/dist/ReactToastify.css';
import DialogContentText from '@mui/material/DialogContentText';
import { selectDarkMode } from '../../redux-toolkit/darkModeSlice';
import { selectlanguage } from '../../redux-toolkit/languagesSlice';



//Related to dialog error - has to be outside of the component
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});




export const UsersList = ({ users, onDelete, onUpdate }) => {
    const darkMode = useSelector(selectDarkMode);
    const isHebrew = useSelector(selectlanguage);
    const convertDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1; // Months are zero-indexed, so we add 1.
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    };

    // const { usersIds, setUsersIds } = useState([]);
    const [opendialog, setDialogOpen] = useState(false);

    const handleClickDialogOpen = () => {
        setDialogOpen(true);
    };


    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    return (


        <TableContainer component={Paper} sx={{ mt: 3 }}>
            {isHebrew === false ?
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography style={{ color: darkMode ? '#fff' : '#000', }} variant="subtitle1" fontWeight="bold">
                                    Username
                                </Typography>

                            </TableCell>
                            <TableCell>
                                <Typography style={{ color: darkMode ? '#fff' : '#000', }} variant="subtitle1" fontWeight="bold">
                                    Email
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography style={{ color: darkMode ? '#fff' : '#000', }} variant="subtitle1" fontWeight="bold">
                                    License

                                </Typography></TableCell>
                            <TableCell>
                                <Typography style={{ color: darkMode ? '#fff' : '#000', }} variant="subtitle1" fontWeight="bold">
                                    Actions
                                </Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <UserTableRow darkMode user={user} userId={user._id} isHebrew convertDate={convertDate} handleClickDialogOpen={handleClickDialogOpen} onUpdate={onUpdate} onDelete={onDelete} handleDialogClose={handleDialogClose} opendialog={opendialog} />

                        ))}
                    </TableBody>
                </Table> :

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography style={{ color: darkMode ? '#fff' : '#000', }} variant="subtitle1" fontWeight="bold">
                                    פעולות  </Typography>

                            </TableCell>
                            <TableCell>
                                <Typography style={{ color: darkMode ? '#fff' : '#000', }} variant="subtitle1" fontWeight="bold">
                                    רישיון

                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography style={{ color: darkMode ? '#fff' : '#000', }} variant="subtitle1" fontWeight="bold">
                                    אימייל

                                </Typography></TableCell>
                            <TableCell>
                                <Typography style={{ color: darkMode ? '#fff' : '#000', }} variant="subtitle1" fontWeight="bold">
                                    שם משתמש
                                </Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <UserTableRow darkMode user={user} userId={user._id} isHebrew convertDate={convertDate} handleClickDialogOpen={handleClickDialogOpen} onUpdate={onUpdate} onDelete={onDelete} handleDialogClose={handleDialogClose} opendialog={opendialog} />

                        ))}
                    </TableBody>
                </Table>}


        </TableContainer>
    );
};




const UserTableRow = ({ darkMode, user, userId, isHebrew, convertDate, handleClickDialogOpen, onUpdate, onDelete, handleDialogClose, opendialog }) => {
    console.log('good morning ', userId, user)

    return (
        <TableRow key={userId}>

            <TableCell>
                {user.username}
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{convertDate(user.license)}</TableCell>
            <TableCell>

                <IconButton aria-label="Delete" onClick={() => onDelete(userId)} >
                    <DeleteIcon />
                </IconButton>


                <IconButton onClick={() => onUpdate(userId)} aria-label="Edit">
                    <EditIcon />
                </IconButton>
            </TableCell>
        </TableRow>
    )
}