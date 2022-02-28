import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {UserProps} from "../../interfaces/user";
import {getAuth} from "firebase/auth";
import {collection, doc, getDocs, query, updateDoc, where} from "firebase/firestore";
import {db} from "../../firebase/firebase.config";

export interface UserState {
    isAuth: boolean,
    user?: UserProps
}

const initialState: UserState = {
    isAuth: false,
    user: undefined
}

export const fetchCurrentUser = createAsyncThunk(
    'user/fetchCurrentUser',
    async (_, {dispatch}) => {
        const auth = getAuth();
        const user = auth.currentUser;

        const q = query(collection(db, "users"), where("user", "==", user?.uid));
        const querySnapshot = await getDocs(q);

        const userDB = querySnapshot.docs[0].data();

        if(userDB?.startDate) {
            userDB.startDate = querySnapshot.docs[0].data().startDate.seconds * 1000;
        }

        dispatch(LogIn(userDB))
    }
)

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        LogIn(state, action) {
            state.isAuth = true;
            state.user = action.payload
        },
        LogOut(state) {
            state.isAuth = false;
            state.user = undefined;
        },
        UpdateUser(state, action) {
            if(state.user) {
                state.user.game = action.payload.game;
                state.user.startDate = action.payload.startDate;
                state.user.name = action.payload.name;
            }
        }
    }
})

export const {LogIn, LogOut, UpdateUser} = userSlice.actions

export default userSlice.reducer
