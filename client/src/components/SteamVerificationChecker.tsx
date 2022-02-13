import React from 'react';
import Alert from "@mui/material/Alert";

interface SteamVerificationCheckerProps {
    isVerified: boolean
}

const SteamVerificationChecker = ({isVerified} : SteamVerificationCheckerProps) : JSX.Element  => {
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
