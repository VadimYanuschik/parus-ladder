import React from 'react';
import Alert from "@mui/material/Alert";
import {useAppSelector} from "../hooks/redux";


const SteamVerificationChecker = () : JSX.Element  => {
    const isVerified = useAppSelector(state => state.user.user?.isVerified)
    return (
        <>
            {isVerified ? (
                <Alert sx={{my: 2, width: '100%'}} variant="filled" severity="success">
                    Steam-аккаунт привязан!
                </Alert>
            ) : (
                <Alert sx={{my: 2, width: '100%'}} variant="filled" severity="error">
                    Привяжите Steam-аккаунт для верификации!
                </Alert>
            )}
        </>
    );
};

export default SteamVerificationChecker;
