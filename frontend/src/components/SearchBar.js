import React, { useState, useEffect } from 'react';
import './SearchBar.css';

const SearchBar = ({ users }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        setFilteredUsers(users);
    }, [users]);

    const handleSearch = (value) => {
        setSearchTerm(value);

        if (value) {
            const filtered = users.filter(user => user.name.toLowerCase().includes(value.toLowerCase()));
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(users);
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