import React from 'react';
import Container from "@mui/material/Container";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';

import {useNavigate} from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import OAuth from "./OAuth";
import {useAppDispatch} from "../hooks/redux";
import {fetchCurrentUser, userSlice} from "../redux/features/userSlice";
import {collection, addDoc, updateDoc} from "firebase/firestore";
import {db} from "../firebase/firebase.config";

const Registration = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const [userCredentials, setUserCredentials] = React.useState({
        nickname: '',
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
        const auth = getAuth();

        const nickname = userCredentials.nickname
        const email = userCredentials.email
        const password = userCredentials.password

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                updateProfile(userCredential.user, {
                    displayName: nickname
                }).then(async () => {
                    await addDoc(collection(db, "users"), {
                        name: userCredential.user.displayName,
                        isVerified: false,
                        user: userCredential.user.uid
                    }).then(async (docRef) => {
                        await updateDoc(docRef, {
                            id: docRef.id
                        }).then(() => {
                            dispatch(fetchCurrentUser())
                        })
                    })
                }).then(() => {
                    navigate('/');
                }).catch((error) => {
                    console.log(error)
                })
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
                    Регистрация
                </Typography>
                <Box component="form" noValidate sx={{mt: 3}} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <OAuth/>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="given-name"
                                name="nickname"
                                required
                                fullWidth
                                id="nickname"
                                label="Nickname"
                                autoFocus
                                onChange={handleChangeInputs}
                            />
                        </Grid>
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
                        Регистрация
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Registration;
