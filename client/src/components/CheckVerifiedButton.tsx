import React, {useEffect, useState} from 'react';
import {Box, Button, Dialog, DialogContent, Modal, Snackbar, Typography} from "@mui/material";
import {query, collection, limit, getDocs, where, doc, updateDoc, addDoc, orderBy} from "firebase/firestore";
import {db} from "../firebase/firebase.config";
import {daysWithOutGame, isPossibleUpdateTables} from "../helpers/LeaderTableHelpers";
import axios from "axios";
import {SteamPlayCheckerProps} from "../interfaces/table";
import {useAppDispatch} from "../hooks/redux";
import {fetchLeadersTable} from "../redux/features/leaderTableSlice";


const CheckVerifiedButton = () => {
    const dispatch = useAppDispatch();

    const [isActiveButton, setIsActiveButton] = useState(true);
    const [untilUpdate, setUntilUpdate] = useState(0);
    const [isActiveModal, setIsActiveModal] = useState(false);
    const [droppedOutGame, setDroppedOutGame] = useState<SteamPlayCheckerProps[]>([]);


    useEffect(() => {
        async function fetchLastUpdate() {
            const q = query(collection(db, "tableUpdates"), orderBy("updatedAt", "desc"), limit(1));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const updateDate = querySnapshot.docs[0].data().updatedAt.toDate();
                const {isPossible, diffHours} = isPossibleUpdateTables(updateDate);

                setIsActiveButton(isPossible);
                setUntilUpdate(diffHours);
            }
        }

        fetchLastUpdate();

    }, []);


    const handleClick = () => {
        async function checkLastGameOnline() {
            const q = query(collection(db, "users"),
                where("isVerified", "==", true),
                where("game", "!=", ""));
            const querySnapshot = await getDocs(q);

            let steamChangedPlayedTime: SteamPlayCheckerProps[] = [];


            querySnapshot.forEach(userDocument => {
                const {steamID, playedTime, game, id, name, startDate} = userDocument.data()

                async function fetchRecentGames(steamID: string) {
                    let isSame = false;
                    await axios.get(`http://localhost:3001/api/steam/getrecentgames/${steamID}`)
                        .then(async result => {
                            if (result.data) {
                                const recentGame = result.data.find((steamGame: { name: string; }) => steamGame.name === game);

                                if (recentGame) {
                                    isSame = recentGame?.playtime_forever === playedTime;
                                } else {
                                    isSame = true
                                }

                                if (!isSame) {
                                    const userRef = doc(db, "users", id);

                                    await updateDoc(userRef, {
                                        startDate: new Date().toString(),
                                        playedTime: recentGame?.playtime_forever || playedTime
                                    }).then(async res => {
                                        let droppedUser = {
                                            name,
                                            game,
                                            withOutGameDays: daysWithOutGame(startDate)
                                        }
                                        setDroppedOutGame(prev => [...prev, droppedUser]);
                                        dispatch(fetchLeadersTable());
                                    })
                                }
                            }
                        })
                }

                fetchRecentGames(steamID);
            })

            // @ts-ignore
            const currentTime = new Date()
            const docRef = await addDoc(collection(db, "tableUpdates"), {
                updatedAt: currentTime
            }).then(res => {
                const {isPossible, diffHours} = isPossibleUpdateTables(currentTime);
                setIsActiveButton(isPossible);
                setUntilUpdate(diffHours);
            })
        }

        checkLastGameOnline();
        handleChangeModalState();
    }

    const handleChangeModalState = () => {
        setIsActiveModal(!isActiveModal)
    }

    return (
        <>
            <Box sx={{display: 'flex', alignItems: 'center', columnGap: 1, mt: 1, justifyContent: 'flex-end'}}>
                {!isActiveButton ? <Typography>До следующей проверки: {untilUpdate} ч.</Typography> : null}
                <Button disabled={!isActiveButton} onClick={handleClick} variant={'contained'}>проверить</Button>
            </Box>
            <Dialog
                open={isActiveModal}
                onClose={handleChangeModalState}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <DialogContent>
                    {droppedOutGame.length ? droppedOutGame.map(user => {
                        const {name, game, withOutGameDays} = user
                        return <Typography key={name + game}>{name} продержался
                            без {game} - <strong>{withOutGameDays} д.</strong></Typography>
                    }) : <Typography key={'Никто не вылетел'}>Никто не вылетел</Typography>}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CheckVerifiedButton;
