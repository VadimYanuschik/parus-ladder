import React, {useEffect, useState} from 'react';
import {Box, Button, Dialog, DialogContent, Typography} from "@mui/material";
import {query, collection, limit, getDocs, where, doc, updateDoc, addDoc, orderBy} from "firebase/firestore";
import {db} from "../firebase/firebase.config";
import {isPossibleUpdateTables} from "../helpers/LeaderTableHelpers";
import axios from "axios";
import {SteamPlayCheckerProps} from "../interfaces/table";
import {useAppDispatch} from "../hooks/redux";
import {fetchLeadersTable} from "../redux/features/leaderTableSlice";
import {fetchLastUpdate} from "../helpers/FetchLastUpdateTable";
import {checkLastGameOnline} from "../helpers/CheckLastGameOnline";


const CheckVerifiedButton = () => {
    const dispatch = useAppDispatch();

    const [isActiveButton, setIsActiveButton] = useState(true);
    const [untilUpdate, setUntilUpdate] = useState(0);
    const [isActiveModal, setIsActiveModal] = useState(false);
    const [droppedOutGame, setDroppedOutGame] = useState<SteamPlayCheckerProps[]>([]);


    useEffect(() => {
        fetchLastUpdate().then(res => {
            const {isPossible, diffHours} = res
            setIsActiveButton(isPossible);
            setUntilUpdate(diffHours);
        });

    }, []);


    const handleClick = () => {
        checkLastGameOnline().then(res => {
            const {isPossibleUpdate, untilUpdateHours, droppedUsers} = res

            setIsActiveButton(isPossibleUpdate);
            setUntilUpdate(untilUpdateHours);
            setDroppedOutGame(droppedUsers);
            dispatch(fetchLeadersTable());
        });
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
                            без {game} - <strong>{withOutGameDays}</strong></Typography>
                    }) : <Typography key={'Никто не вылетел'}>Никто не вылетел</Typography>}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CheckVerifiedButton;
