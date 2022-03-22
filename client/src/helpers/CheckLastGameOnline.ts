import {addDoc, collection, doc, getDocs, query, updateDoc, where} from "firebase/firestore";
import {db} from "../firebase/firebase.config";
import {SteamPlayCheckerProps} from "../interfaces/table";
import axios from "axios";
import {isPossibleUpdateTables, tableTimeWithoutGame} from "./LeaderTableHelpers";

export async function checkLastGameOnline() {
    let isPossibleUpdate : boolean = true;
    let untilUpdateHours : number = 0;
    let droppedUsers : SteamPlayCheckerProps[] = []

    const q = query(collection(db, "users"),
        where("isVerified", "==", true),
        where("game", "!=", ""));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(userDocument => {
        const {steamID, playedTime, game, id, name, startDate} = userDocument.data()

        async function fetchRecentGames(steamID: string) {
            let isSame = false;
            await axios.get(`https://parus-ladder.herokuapp.com/api/steam/getrecentgames/${steamID}`)
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
                                startDate: new Date(),
                                playedTime: recentGame?.playtime_forever || playedTime
                            }).then(async res => {
                                let droppedUser = {
                                    name,
                                    game,
                                    withOutGameDays: tableTimeWithoutGame(startDate.toDate())
                                }
                                droppedUsers.push(droppedUser);
                            })
                        }
                    }
                })
        }
        fetchRecentGames(steamID);
    })


    const currentTime = new Date()
    const docRef = await addDoc(collection(db, "tableUpdates"), {
        updatedAt: currentTime
    }).then(res => {
        const {isPossible, diffHours} = isPossibleUpdateTables(currentTime);
        isPossibleUpdate = isPossible
        untilUpdateHours = diffHours
    })
    return {isPossibleUpdate, untilUpdateHours, droppedUsers}
}