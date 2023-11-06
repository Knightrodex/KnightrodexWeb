import React, { useState } from 'react';
import './SearchBar.css';
import UserList from './UserList';

const SearchBar = ({ users, onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value);
    };

    return (
        <div className='search-container'>
            <input
                type="text"
                placeholder="Search users"
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
            />
        </div>
    );
};

export default SearchBar;
