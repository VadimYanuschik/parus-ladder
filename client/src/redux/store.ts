import {configureStore} from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import leaderTableSlice from "./features/leaderTableSlice";
import gameNames from "./features/gameNames";


export const store = configureStore({
    reducer: {
        user: userSlice,
        tables: leaderTableSlice,
        games: gameNames,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch