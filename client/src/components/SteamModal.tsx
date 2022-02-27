import React, {useState, useEffect} from 'react';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import {useNavigate} from "react-router-dom";
import Typography from "@mui/material/Typography";
import {getAuth} from "firebase/auth";
import TextField from "@mui/material/TextField";
import {Link} from "@mui/material";
import Alert from "@mui/material/Alert";
import {collection, doc, getDocs, query, updateDoc, where} from "firebase/firestore";
import {db} from "../firebase/firebase.config";
import {useAppDispatch, useAppSelector} from "../hooks/redux";
import {fetchCurrentUser} from "../redux/features/userSlice";

const SteamModal = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [open, setOpen] = React.useState(false);
    const [steamIDInput, setSteamIDInput] = useState('');
    const steamID = useAppSelector(state => state.user.user?.steamID)

    useEffect(() => {
        steamID && setSteamIDInput(steamID);
    }, [])

    const handleStateMenu = () => {
        setOpen(!open);
    };

    const handleSaveSteam = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            const q = query(collection(db, "users"), where("user", "==", user.uid));
            const querySnapshot = await getDocs(q);
            const userRef = doc(db, "users", querySnapshot.docs[0].id);

            if(steamIDInput) {
                await updateDoc(userRef, {
                    steamID: steamIDInput,
                    game: "",
                    startDate: new Date(),
                    isVerified: true
                })
            } else {
                await updateDoc(userRef, {
                    steamID: steamIDInput,
                    isVerified: false
                })
            }

            dispatch(fetchCurrentUser());
        }
        setOpen(!open);
        setSteamIDInput(steamIDInput)
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSteamIDInput(event.target.value)
    }

    return (
        <Box sx={{mr: "auto"}} component="div">
            <Typography variant='body1' sx={{display: 'flex', alignItems: 'center', columnGap: 1, width: '100%'}}>Привязать
                Steam:
                <Button onClick={handleStateMenu}>
                    <img src="./steam.png" alt=""/>
                </Button>
            </Typography>
            <Dialog open={open} onClose={handleStateMenu}>
                <DialogTitle sx={{fontWeight: 'bold'}}>Привязка steam-аккаунта</DialogTitle>
                <Alert sx={{m: 2}} variant="filled" severity="info">
                    Для верификации steam-аккаунта укажите ваш SteamID64!
                </Alert>
                <Box component="form" noValidate sx={{px: 2}}>
                    <TextField
                        margin="normal"
                        fullWidth
                        id="steamID64"
                        label="SteamID64"
                        name="steamID64"
                        autoComplete="SteamID64"
                        autoFocus
                        onChange={handleChange}
                        value={steamIDInput}
                    />
                </Box>
                <Link sx={{p: 2}} href={'https://steamid.io/lookup/'} target={'_blank'}>Узнать свой STEAM_ID</Link>
                <DialogActions>
                    <Box sx={{mx: 'auto', display: 'flex', justifyContent: 'center', columnGap: 1}}>
                        <Button variant={'contained'} onClick={handleSaveSteam}>Сохранить</Button>
                        <Button variant={'outlined'} onClick={handleStateMenu}>ОТМЕНА</Button>
                    </Box>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SteamModal;
