import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {TableProps, TablesProps} from "../../interfaces/table";
import {collection, getDocs, orderBy, query, where} from "firebase/firestore";
import {db} from "../../firebase/firebase.config";

const initialState : TablesProps = {
    tables: [],
    isLoading: true
}

export const fetchLeadersTable = createAsyncThunk(
    'tables/fetchLeadersTable',
    async (_, {dispatch, rejectWithValue}) => {
        const qGames = query(collection(db, "games"))
        const querySnapshotGames = await getDocs(qGames);

        let gameNames: string[] = [];

        querySnapshotGames.forEach(doc => {
            gameNames.push(doc.data().name)
        })

        const tempTable: TableProps[] = [];

        const qUsers = query(collection(db, "users"),
            orderBy("game", "asc"),
            where("game", "!=", ""),
            orderBy("startDate", "asc"));
        const querySnapshotUsers = await getDocs(qUsers);

        let tableAll: TableProps = {
            name: 'Все',
            items: []
        };

        await Promise.all(querySnapshotUsers.docs.map(async (docUser) => {
            tableAll.items.push({
                id: docUser.id,
                name: docUser.data().name,
                isVerified: docUser.data().isVerified,
                startDate: new Date(docUser.data().startDate.seconds * 1000).toString(),
                game: docUser.data().game,
                steamID: docUser.data().steamID
            })
        }))


        tempTable.push(tableAll);

        let tableVerified: TableProps = {
            name: 'Верифицированные',
            items: []
        }

        const qUsersVerified = query(collection(db, "users"),
            where("isVerified", "==", true),
            orderBy("game", "asc"),
            where("game", "!=", ""),
            orderBy("startDate", "asc"));
        const querySnapshotUsersVerified = await getDocs(qUsersVerified)

        querySnapshotUsersVerified.forEach(doc => {
            tableVerified.items.push({
                id: doc.id,
                name: doc.data().name,
                isVerified: doc.data().isVerified,
                startDate: new Date(doc.data().startDate.seconds * 1000).toString(),
                game: doc.data().game,
                steamID: doc.data().steamID
            })
        })

        tempTable.push(tableVerified)

        await Promise.all(gameNames.map(async (docGame) => {
            let qUsersGame = query(collection(db, "users"),
                where("game", "==", docGame),
                orderBy("startDate", "asc"));
            const querySnapshotUsersGame = await getDocs(qUsersGame);

            let table: TableProps = {
                name: '',
                items: []
            };
            table.name = docGame

            querySnapshotUsersGame.forEach(docUser => {
                table.items.push({
                    id: docUser.id,
                    name: docUser.data().name,
                    isVerified: docUser.data().isVerified,
                    startDate: new Date(docUser.data().startDate.seconds * 1000).toString(),
                    game: docUser.data().game,
                    steamID: docUser.data().steamID
                })
            })
            tempTable.push(table);
        }))
        dispatch(GetTables(tempTable));
    }
)

export const leaderTableSlice = createSlice({
    name: 'tables',
    initialState,
    reducers: {
        GetTables(state, action) {
            state.tables = action.payload;
            state.isLoading = false;
        }
    }
})
const {GetTables} = leaderTableSlice.actions
export default leaderTableSlice.reducer;