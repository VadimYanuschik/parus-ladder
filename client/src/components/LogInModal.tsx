import React from 'react';
import {Box, Button, DialogTitle, Typography} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import {Link as LinkRouter} from "react-router-dom";
import Dialog from "@mui/material/Dialog";

const LogInModal = ({isOpenLogInModal, changeStateLogInModal} : {isOpenLogInModal : boolean, changeStateLogInModal() : void}) => {
    return (
        <Dialog open={isOpenLogInModal} onClose={changeStateLogInModal}>
            <DialogTitle>
                <Typography>Для активации чата сначала авторизуйтесь!</Typography>
            </DialogTitle>
            <DialogActions>
                <Box sx={{mx: 'auto', display: 'flex', justifyContent: 'center', columnGap: 1}}>
                    <Button component={LinkRouter} variant={'contained'} to={'/login'}>Войти</Button>
                    <Button onClick={changeStateLogInModal} variant={'outlined'}>ОТМЕНА</Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default LogInModal;
