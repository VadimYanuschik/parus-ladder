import React from 'react';
import Button from "@mui/material/Button";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Box from "@mui/material/Box";
import {getAuth, deleteUser, signOut} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import {useAppDispatch} from "../hooks/redux";
import {userSlice} from "../redux/features/userSlice";

const DeleteAccount = () => {
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);

    const dispatch = useAppDispatch()
    const {LogOut} = userSlice.actions;

    const handleStateMenu = () => {
        setOpen(!open);
    };

    const handleDeleteAccount = () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            deleteUser(user).then(() => {
                signOut(auth).then(() => {
                    dispatch(LogOut());
                    navigate('/')
                })
            }).catch((error) => {
                console.log(error)
            });
        }
    }


    return (
        <Box sx={{ml: "auto"}} component="div">
            <Button variant="contained" color="error" onClick={handleStateMenu}>
                Удалить аккаунт
            </Button>
            <Dialog open={open} onClose={handleStateMenu}>
                <DialogTitle sx={{fontWeight: 'bold'}}>Аккаунт будет безвозвратно удален, вы уверены?</DialogTitle>
                <DialogActions sx={{mx: "auto"}}>
                    <Button variant={'outlined'} color={'error'} onClick={handleDeleteAccount}>УДАЛИТЬ</Button>
                    <Button variant={'contained'} onClick={handleStateMenu}>ОТМЕНА</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DeleteAccount;
