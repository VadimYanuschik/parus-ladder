import React from 'react';
import Navbar from "./components/Navbar";
import {Routes, Route} from "react-router-dom";
import Home from "./components/Home";
import LeadersTable from "./components/LeadersTable";
import Contacts from "./components/Contacts";
import Login from "./components/Login";
import Registration from "./components/Registration";
import PersonalAccount from "./components/PersonalAccount";
import PrivateRoute from "./components/PrivateRoute";

function App() {
    return (
        <div className="App">
            <Navbar/>
            <Routes>
                <Route path={'/'} element={<Home/>}/>
                <Route path={'/table'} element={<LeadersTable/>}/>
                <Route path={'/contacts'} element={<Contacts/>}/>
                <Route path={'/login'} element={<Login/>}/>
                <Route path={'/registration'} element={<Registration/>}/>
                <Route path="/personal-account" element={<PrivateRoute component={PersonalAccount}/>}/>
            </Routes>
        </div>
    );
}

export default App;
