import React, { useState } from "react";
import Navbar from "../components/Navbar";
import UserList from '../components/UserList';
import SearchBar from '../components/SearchBar';

const initialUsers = [ // This is your initial list of users
    { id: 1, name: 'Nathan Cheng' },
    { id: 2, name: 'Natalie Constnat' },
    { id: 3, name: 'ethan metryoos' },
    // Add more user data
];

function HomePage() {
    const [filteredUsers, setFilteredUsers] = useState(initialUsers);

    const handleSearch = (searchTerm) => {
        if (searchTerm) {
            const filtered = initialUsers.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()));
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(initialUsers);
        }
    };

    return (
        <>
            {/* <Navbar /> */}
            <div>
                <SearchBar users={filteredUsers} onSearch={handleSearch} />
                <UserList users={filteredUsers} />
            </div>
        </>
    );
}

export default HomePage;
