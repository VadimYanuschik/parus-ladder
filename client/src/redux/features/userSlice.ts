import {createSlice} from "@reduxjs/toolkit";

export interface UserState {
    isAuth: boolean
}

const initialState: UserState = {
    isAuth: false
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        LogIn(state) {
            state.isAuth = true;
        },
        LogOut(state) {
            state.isAuth = false;
        }
    }
})

export default userSlice.reducer
