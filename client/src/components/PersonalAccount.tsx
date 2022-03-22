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

import {getAuth, signOut, updatePassword} from "firebase/auth";
import DeleteAccount from "./DeteleAccount";
import {doc, updateDoc} from "firebase/firestore";
import {db} from "../firebase/firebase.config";
import SteamModal from "./SteamModal";
import SteamVerificationChecker from "./SteamVerificationChecker";
import {useAppDispatch, useAppSelector} from "../hooks/redux";
import {fetchGameNames} from "../redux/features/gameNames";
import {LogOut, UpdateUser} from "../redux/features/userSlice";
import axios from "axios";
import Alert from "@mui/material/Alert";
import {useNavigate} from "react-router-dom";


interface FormDataProps {
    nickname: string,
    email: string,
    newPassword: string,
    game: string
}

interface SteamGame {
    name: string,
    playtime_forever: number
}

interface UpdatedFields {
    name?: string,
    game?: string,
    playedTime?: number,
    startDate?: Date
}

const PersonalAccount = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const user = useAppSelector(state => state.user.user);
    const {games, isLoading} = useAppSelector(state => state.games);

    const [isSteamGamesLoading, setIsSteamGamesLoading] = useState(true);
    const [steamGames, setSteamGames] = useState<SteamGame[]>([]);
    const [successSaveModalShow, setSuccessSaveModalShow] = useState(false);

    const [formData, setFormData] = useState<FormDataProps>({
        nickname: '',
        email: '',
        newPassword: '',
        game: ""
    });

    async function fetchSteamGames() {
        if (user?.steamID) {
            await axios.get(`https://parus-ladder.herokuapp.com/api/steam/getownedgames/${user.steamID}`)
                .then(result => {
                    if (result) {
                        setIsSteamGamesLoading(false);
                        setSteamGames(result.data);
                    }
                })
        }
    }

    useEffect(() => {
        dispatch(fetchGameNames());
    }, []);

    useEffect(() => {
        const auth = getAuth();
        const userAuth = auth.currentUser;

        if(user) {
            setFormData({
                ...formData,
                game: user?.game || '',
                nickname: user.name,
                email: userAuth?.email || ''
            })

            if (user.isVerified) {
                fetchSteamGames();
            }
        }
    }, [user]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        async function saveChanges() {
            const playedTime = formData.game && steamGames.find(steamGame => steamGame.name === formData.game)?.playtime_forever
            const userRef = user && doc(db, "users", user.id);

            let updatedFields : UpdatedFields = {};

            if(user?.name != formData.nickname) {
                updatedFields["name"] = formData.nickname
            }

            if(user?.game != formData.game) {
                updatedFields["game"] = formData.game
                updatedFields["startDate"] = new Date();
                updatedFields["playedTime"] = 0;
            }


            // @ts-ignore
            userRef && await updateDoc(userRef, updatedFields).then(() => {
                setSuccessSaveModalShow(true);
                setTimeout(() => {
                    setSuccessSaveModalShow(false);
                }, 5000)
            });
            dispatch(UpdateUser({game: formData.game, name: formData.nickname, startDate: new Date().toString()}));

            if(formData.newPassword.length) {
                const auth = getAuth();
                const user = auth.currentUser;

                if (user) {
                    updatePassword(user, formData.newPassword).then(() => {
                        const auth = getAuth();
                        signOut(auth).then(() => {
                            dispatch(LogOut())
                            navigate('/')
                        }).catch((error) => {
                            console.log(error)
                        });
                    }).catch((error) => {
                        console.log(error)
                    });
                }
            }
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
                    marginTop: 2,
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

                <SteamVerificationChecker/>
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
                            {user && user.isVerified ? !isSteamGamesLoading && steamGames.map((game, index) => {
                                return <MenuItem key={index} value={game.name}>{game.name}</MenuItem>
                            }) : !isLoading && games.map((game, index) => {
                                return <MenuItem key={index} value={game}>{game}</MenuItem>
                            })}
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
                        disabled={true}
                        onChange={handleChange}
                        value={formData.email}
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
                {successSaveModalShow ? <Alert sx={{my: 2, width: '100%'}}
                                               variant="filled"
                                               severity="success"
                                               onClose={() => {
                                                   setSuccessSaveModalShow(false)
                                               }}
                >
                    Успешно сохранено!
                </Alert> : ''}
            </Box>
        </Container>
    );
};

export default PersonalAccount;
