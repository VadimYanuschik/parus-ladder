import React from 'react';
import {Container, TextField, Box, Button, Link, DialogTitle, Typography} from "@mui/material";
import { Link as LinkRouter } from "react-router-dom";
import ChatMessage from "./ChatMessage";
import {purple} from "@mui/material/colors";
import {useAppSelector} from "../hooks/redux";
import {collection, addDoc, DocumentData, query, orderBy} from "firebase/firestore";
import {db} from "../firebase/firebase.config";
import {useCollectionData} from "react-firebase-hooks/firestore";
import Loader from "./Loader";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import Login from "./Login";
import LogInModal from "./LogInModal";

interface MessageProps {
    id: string,
    name: string,
    message: string
}

const Chat = () => {
    const {isAuth, user} = useAppSelector(state => state.user)
    const [messageInput, setMessageInput] = React.useState('');
    const [isOpenLogInModal, setIsOpenLogInModal] = React.useState(false);
    const [messages, loading] = useCollectionData(
        query(collection(db, "messages"), orderBy('createdAt', 'asc'))
    )

    const sendMessage = async () => {
        await addDoc(collection(db, "messages"), {
            name: user?.name,
            message: messageInput,
            createdAt: new Date()
        })
        setMessageInput('')
    }

    const changeStateLogInModal = () => {
        setIsOpenLogInModal(!isOpenLogInModal);
    };

    const handleChangeInput = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setMessageInput(event.target.value)
    }

    const handlePressEnter = (event: { keyCode: number; }) => {
      if(event.keyCode == 13) {
          sendMessage();
      }
    }

    const handleFocusTextField = (event: { target: { blur: () => void; }; }) => {
        if(!isAuth) {
            event.target.blur();
            changeStateLogInModal();
        }
    }

    if(loading) {
        return <Loader/>
    }

    return (
        <Container sx={{my: 2, pb: 1, position: 'relative'}}>
            {messages && messages.map((mess: DocumentData) => (
                <ChatMessage key={mess.id} name={mess.name} message={mess.message} ownMessage={mess.name == user?.name}/>
            ))}

            <LogInModal isOpenLogInModal={isOpenLogInModal} changeStateLogInModal={changeStateLogInModal}/>

            <Box position={'fixed'} left={0} bottom={0} width={'100%'} className="chat-input" sx={{display: 'flex'}}>
                <TextField
                    sx={{backgroundColor: purple[50]}}
                    fullWidth label="Введите Сообщение"
                    value={messageInput}
                    onChange={handleChangeInput}
                    onKeyDown={handlePressEnter}
                    onFocus={handleFocusTextField}
                    name="message"
                />
                <Button
                    type="submit"
                    sx={{px: 3}}
                    variant="contained"
                    onClick={sendMessage}
                >
                    Отправить
                </Button>
            </Box>
        </Container>
    );
};

export default Chat;
