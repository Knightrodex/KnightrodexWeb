import React, { useState } from "react";
import Navbar from "../components/Navbar";
import SearchBar from '../components/SearchBar';
import Activities from "../components/Activities";



function HomePage() {
    const initialUsers = [ // This is your initial list of users
        { id: 1, name: 'Nathan Cheng' },
        { id: 2, name: 'Natalie Constnat' },
        { id: 3, name: 'ethan metryoos' },
        // Add more user data
    ];

    return (
        <>
            <Navbar />
            <SearchBar users={initialUsers} />
            <Activities />
        </>
    );
}

export default HomePage;