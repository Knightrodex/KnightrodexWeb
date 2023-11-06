import React, { useState } from "react";
import Navbar from "../components/Navbar";
 import UserProfile from "../components/UserProfile";
import { Link } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.css';

function HomePage() {

    return (
        <>
            <Navbar />
            <UserProfile />
        </>
    );

}


export default HomePage; 