import React from 'react';
import {Box, Typography} from "@mui/material";
import {purple} from '@mui/material/colors';

interface ChatMessageProps {
    name: string,
    message: string,
    ownMessage: boolean
}

const notOwnMessageStyles = {
    backgroundColor: purple[500],
    color: 'white',
    m: '0 auto 0 0',

}

const ownMessageStyles = {
    backgroundColor: purple[50],
    color: purple[500],
    m: '0 0 0 auto'
}

const ChatMessage = ({name, message, ownMessage}: ChatMessageProps) => {
    return (
        <Box sx={{
            backgroundColor: ownMessage
                ? ownMessageStyles.backgroundColor
                : notOwnMessageStyles.backgroundColor,
            color: ownMessage
                ? ownMessageStyles.color
                : notOwnMessageStyles.color,
            borderRadius: '10px', padding: 2,
            width: 'fit-content',
            m: ownMessage
                ? ownMessageStyles.m
                : notOwnMessageStyles.m,
            mb: 1
        }}>
            <Typography color={'inherit'} fontWeight={'bold'} variant={'body1'}>{name}</Typography>
            <Typography color={'inherit'} variant={'body1'}>{message}</Typography>
        </Box>
    );
};

export default ChatMessage;
