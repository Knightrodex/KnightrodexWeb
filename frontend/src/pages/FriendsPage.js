import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import FriendsSearchBox from '../components/FriendsSearchBox';
import Navbar from "../components/Navbar";


function FriendsPage() {

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);


    const user = [ // User this as an example reference of a single user in the filteredUsers array
        {
            email: "stevenagrady@gmail.com",
            firstName: "Steven",
            isFollowed: true,
            lastName: "Grady",
            profilePicture: "https://res.cloudinary.com/knightrodex/image/upload/v1700985162/knightrodex_users/6525c13e21cb5f9f2b270d87.jpg",
            userId: "6525c13e21cb5f9f2b270d87"
        },
    ];





    const handleSearch = async (value) => {
        setSearchTerm(value);

        try {

            const jwt = jwtDecode(localStorage.token);
            console.log("JWTTTTTT  ", jwt);

            const response = await axios.post('https://knightrodex-49dcc2a6c1ae.herokuapp.com/api/searchemail', {
                requesterUserId: jwt.userId,
                partialEmail: value,
                jwtToken: localStorage.token
            });

            console.log("API RESPONSE: ", response.data);
            setFilteredUsers(response.data.result);
        } catch (error) {
            console.error('Error searching users:', error);
        }
    };

    return (
        <>
            <Navbar />
            <FriendsSearchBox />

        </>

    );

}

export default FriendsPage;