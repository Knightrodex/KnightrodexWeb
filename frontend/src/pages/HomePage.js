import React, { useContext, useState } from "react";
import Navbar from "../components/Navbar";
import SearchBar from '../components/SearchBar';
import Activities from "../components/Activities";
import { jwtDecode } from 'jwt-decode'

function HomePage() {

    const info = jwtDecode(localStorage.token);

    const initialUsers = [ // This is your initial list of users
        { id: 1, name: 'Steven Bagatini' },
        { id: 2, name: 'Natalie Smith' },
        { id: 3, name: 'John Doe' },
        // Add more user data
    ];


    return (
        <>
            <Navbar />
            <SearchBar users />
            <Activities />
        </>
    );
}

export default HomePage;
