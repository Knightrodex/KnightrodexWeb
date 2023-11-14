import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const RouteGuard = ({ component: Component, ...rest }) => {
    
    function hasJWT() {
        let flag = false;

        // check is user has JWT token
        localStorage.getItem("token") ? flag=true : flag=false

        return flag
    }
    
    return hasJWT() ? <Outlet /> : <Navigate to="/" />;
}

export default RouteGuard;