import React from 'react';
import Typography from "@mui/material/Typography";
import {useNavigate} from "react-router-dom";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

import {getAuth, signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import {addDoc, collection} from "firebase/firestore";
import {db} from "../firebase/firebase.config";

const OAuth = () => {
    const navigate = useNavigate();
    const handleClick = () => {
        const provider = new GoogleAuthProvider();
        const auth = getAuth();
        signInWithPopup(auth, provider)
            .then(async (result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential?.accessToken;
                const user = result.user;
                await addDoc(collection(db, "users"), {
                    name: result.user.displayName,
                    isVerified: false,
                    user: user.uid
                })
            }).then(() => {
            navigate('/');
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
        });
    }

    return (
        <Grid item xs={12}>
            <Typography variant='body1' sx={{display: 'flex', alignItems: 'center', columnGap: 1}}>Войти с помощью:
                <Button sx={{px: 0}} onClick={handleClick}>
                    <img src="./google.png" alt=""/>
                </Button>
            </Typography>
        </Grid>
    );
};

export default OAuth;
