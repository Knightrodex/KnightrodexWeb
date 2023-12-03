import React, { useState, useEffect } from 'react';
import './SearchBar.css';
import axios from 'axios';
import { setAuthToken } from '../components/setAuthToken';

import { jwtDecode } from 'jwt-decode';




const SearchBar = ({ }) => {
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

    const handleFollow = (userId) => {

    }

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
        <div className="search-container">
            <input
                type="text"
                placeholder="Search users"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="search-input"
            />
            <ul className="user-list">
                {filteredUsers.map((user) => (
                    <li key={user.userId} className="user-item unit">
                        <div className="avatar">
                            {user.profilePicture && (
                                <img
                                    src={user.profilePicture}
                                    className="img-responsive"
                                    alt="profile"
                                />
                            )}
                        </div>
                        <div className="user-details">
                            <div className="field title fw-bold">
                                {user.firstName} {user.lastName}
                                <p className="fw-light">{user.email}</p>
                            </div>
                            <div className="follow-button">
                                {/* Add your Follow button here */}
                                <button onClick={() => handleFollow(user.userId)}>
                                    Follow
                                </button>
                            </div>
                            {/* Add additional fields as needed */}
                        </div>

                    </li>
                ))}
            </ul>
        </div>
    );



};

export default SearchBar;