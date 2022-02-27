import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {collection, DocumentData, getDocs, query, where} from "firebase/firestore";
import {db} from "../../firebase/firebase.config";
import {GameState} from "../../interfaces/game";


const initialState: GameState = {
    games: [],
    isLoading: true
}

export const fetchGameNames = createAsyncThunk(
    'games/fetchGameNames',
    async (_, {dispatch}) => {
        const q = query(collection(db, "games"));
        const querySnapshot = await getDocs(q);

        const games: DocumentData[] = [];
        querySnapshot.forEach(doc => {
            games.push(doc.data().name)
        })

        dispatch(GetGameNames(games))
    }
)


export const gameNames = createSlice({
    name: 'games',
    initialState,
    reducers: {
        GetGameNames(state, action) {
            state.games = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchGameNames.fulfilled, (state : GameState) => {
            state.isLoading = false;
        })
    }
})

const {GetGameNames} = gameNames.actions

export default gameNames.reducer
