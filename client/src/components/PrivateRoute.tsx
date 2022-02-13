import React from 'react';
import { Navigate } from 'react-router-dom'
import {getAuth} from "firebase/auth";

interface PrivateRouteProps {
    component: React.ComponentType
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({component : RouteComponent}) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if(user) {
        return <RouteComponent/>
    }
    return (
        <Navigate to={'/'}/>
    );
};

export default PrivateRoute;
