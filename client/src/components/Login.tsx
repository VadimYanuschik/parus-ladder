import React from 'react';
import Container from "@mui/material/Container";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import {Link as RouterLink, useNavigate} from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import OAuth from "./OAuth";
import {useAppDispatch} from "../hooks/redux";
import {userSlice} from "../redux/features/userSlice";

const Login = () => {
    const navigate = useNavigate()

    const dispatch = useAppDispatch()
    const {LogIn} = userSlice.actions;

    const [userCredentials, setUserCredentials] = React.useState({
        email: '',
        password: ''
    });

    const handleChangeInputs = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserCredentials({
            ...userCredentials,
            [event.target.name]: event.target.value
        })
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const email = userCredentials.email
        const password = userCredentials.password

        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                dispatch(LogIn());
                navigate('/')
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage)
            });

    };
    return (
        <Container sx={{my: 2}}>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    maxWidth: 650,
                    mx: 'auto'
                }}
            >
                <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Войти
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 3}}>
                    <Grid container spacing={2}>
                        <OAuth/>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                onChange={handleChangeInputs}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                onChange={handleChangeInputs}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                    >
                        Войти
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;
