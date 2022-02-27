import React, {useEffect} from 'react';
import Navbar from "./components/Navbar";
import {Routes, Route} from "react-router-dom";
import Home from "./components/Home";
import LeadersTable from "./components/LeadersTable";
import Contacts from "./components/Contacts";
import Login from "./components/Login";
import Registration from "./components/Registration";
import PersonalAccount from "./components/PersonalAccount";
import PrivateRoute from "./components/PrivateRoute";
import Faq from "./components/Faq";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {useAppDispatch} from "./hooks/redux";
import {fetchCurrentUser, userSlice} from "./redux/features/userSlice";

function App() {
    const dispatch = useAppDispatch();
    const {LogOut} = userSlice.actions;


    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                dispatch(fetchCurrentUser());
            }
        });


    }, [])

    return (
        <div className="App">
            <Navbar/>
            <Routes>
                <Route path={'/'} element={<Home/>}/>
                <Route path={'/table'} element={<LeadersTable/>}/>
                <Route path={'/contacts'} element={<Contacts/>}/>
                <Route path={'/faq'} element={<Faq/>}/>
                <Route path={'/login'} element={<Login/>}/>
                <Route path={'/registration'} element={<Registration/>}/>
                <Route path="/personal-account" element={<PrivateRoute component={PersonalAccount}/>}/>
            </Routes>
        </div>
    );
}

export default App;
