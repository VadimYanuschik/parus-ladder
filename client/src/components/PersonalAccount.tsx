import React, {useState, useEffect} from 'react';
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

import {getAuth} from "firebase/auth";
import DeleteAccount from "./DeteleAccount";
import {collection, query, where, getDocs, doc, updateDoc} from "firebase/firestore";
import {db} from "../firebase/firebase.config";
import SteamModal from "./SteamModal";
import SteamVerificationChecker from "./SteamVerificationChecker";

interface FormDataProps {
    nickname: string,
    email: string,
    password: string,
    newPassword: string,
    game: string,
    defaultGames: any[]
}

const PersonalAccount = () => {
    const [formData, setFormData] = useState<FormDataProps>({
        nickname: '',
        email: '',
        password: '',
        newPassword: '',
        game: '',
        defaultGames: []
    });

    const [userData, setUserData] = useState({
        uid: '',
        user: '',
        isVerified: false
    });

    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            setFormData({
                ...formData,
                nickname: user.displayName || '',
                email: user.email || '',
            })
            setUserData({
                ...userData,
                uid: user.uid
            })
        }
    }, []);

    useEffect(() => {
        async function getUserData() {
            const q = query(collection(db, "users"), where("user", "==", userData.uid));
            const querySnapshot = await getDocs(q);
            setUserData({
                ...userData,
                user: querySnapshot.docs[0].id,
                isVerified: querySnapshot.docs[0].data().isVerified
            })
        }

        async function getGames() {
            const q = query(collection(db, "games"));
            const querySnapshot = await getDocs(q);
            let qGames: any[] = [];
            querySnapshot.forEach(doc => {
                qGames.push(doc.data().name)
            })
            setFormData({
                ...formData,
                defaultGames: qGames
            })
        }

        getUserData();
        getGames();
    }, [userData.uid]);


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        async function saveChanges() {
            const userRef = doc(db, "users", userData.user);

            await updateDoc(userRef, {
                game: formData.game,
                startDate: new Date()
            });

            console.log(formData.game)
        }
        saveChanges();
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        })
    }

    const handleChangeSelect = (event: SelectChangeEvent) => {
        setFormData({
            ...formData,
            game: event.target.value as string
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
                <Typography component="h1" variant="h5">
                    Личный Кабинет
                </Typography>

                <SteamVerificationChecker isVerified={userData.isVerified}/>
                <SteamModal/>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Выберите игру</InputLabel>
                        <Select
                            labelId="choose-game-label"
                            id="choose-game-select"
                            value={formData.game}
                            label="Выберите игру"
                            onChange={handleChangeSelect}
                        >
                            {formData.defaultGames.map((game, index) => (
                                <MenuItem key={game} value={game}>{game}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        margin="normal"
                        fullWidth
                        id="nickname"
                        label="Nickname"
                        name="nickname"
                        autoComplete="nickname"
                        autoFocus
                        onChange={handleChange}
                        value={formData.nickname}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={handleChange}
                        value={formData.email}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        id="newPassword"
                        label="New Password"
                        name="newPassword"
                        autoComplete="newPassword"
                        autoFocus
                        onChange={handleChange}
                    />
                    <Typography variant={'body1'}>

                    </Typography>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                    >
                        Сохранить
                    </Button>
                </Box>
                <DeleteAccount/>
            </Box>
        </Container>
    );
};

export default PersonalAccount;
