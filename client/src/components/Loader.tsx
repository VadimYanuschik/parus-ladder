import React from 'react';
import CircularProgress from "@mui/material/CircularProgress";

const Loader = () => {
    return (
        <CircularProgress sx={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%)'}}/>
    );
};

export default Loader;
