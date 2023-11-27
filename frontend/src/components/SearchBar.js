import React, { useState, useEffect } from 'react';
import './SearchBar.css';
import axios from 'axios';



const SearchBar = ({ }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);

    const handleSearch = async (value) => {
        setSearchTerm(value);

        try {


            const response = await axios.post('/api/searchemail', {
                requesterUserId: 'your_requester_user_id',  // Replace with the actual requester user ID
                partialEmail: value,
                jwtToken: localStorage.getItem("token"),  // Replace with the actual JWT token
            });

            localStorage.setItem("token", response.jwtToken);

            // Assuming the API response has a field named 'result' containing the list of users
            setFilteredUsers(response.data.result);
        } catch (error) {
            console.error('Error searching users:', error);
        }
    };


    return (
        <div className="search-container">
            <input
                type='text'
                placeholder='Search users'
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className='search-input'
            />
            <ul className="user-list">
                {filteredUsers.map((user) => (
                    <li key={user.id}>{user.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default SearchBar;