import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FriendsSearchBox.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';

import { jwtDecode } from 'jwt-decode';

function FriendsSearchBox() {

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



    const handleFollow = async (otherUser) => {
        const jwt = jwtDecode(localStorage.token);

        if (otherUser.isFollowed) {
            await axios.post('https://knightrodex-49dcc2a6c1ae.herokuapp.com/api/unfollowuser', {
                currentUserId: jwt.userId,
                otherUserId: otherUser.userId,
                jwtToken: localStorage.token
            })
                .then((response) => {

                    console.log("Unfollowed user successfully.");

                })
                .catch(err => {
                    console.log(err);
                });
        }
        else {
            await axios.post('https://knightrodex-49dcc2a6c1ae.herokuapp.com/api/followUser', {
                currentUserId: jwt.userId,
                otherUserId: otherUser.userId,
                jwtToken: localStorage.token
            })
                .then((response) => {

                    console.log("Followed user Successfully.");

                })
                .catch(err => {
                    console.log(err);
                });
        }

        setFilteredUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.userId === otherUser.userId
                    ? { ...user, isFollowed: !user.isFollowed }
                    : user
            )
        );

    }

     // useEffect runs when the page loads
     useEffect(() => {
        getUserData();
    }, []);

    const getUserData = async () => {
        handleSearch("");
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
        <>
            <h3 className="text-center">Find Your Friends</h3>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search users"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="search-input"
                />
            </div>

            <ul className="list-group list-group-light friend-list-container">
                {filteredUsers.map((user) => (
                    <li key={user.userId} className="list-group-item d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                            <img src={user.profilePicture} alt="" style={{ width: '45px', height: '45px' }} className="rounded-circle" />
                            <div className="ms-3">
                                <p className="fw-bold mb-1">{`${user.firstName} ${user.lastName}`}</p>
                                <p className="text-muted mb-0">{user.email}</p>
                            </div>
                        </div>
                        <button className= "btn btn-sm btn-primary  " onClick={() => handleFollow(user)}>
                            {user.isFollowed ? "Unfollow" : "Follow"}
                        </button>
                    </li>
                ))}
            </ul>




            {/* <div className="col-md-12 col-right">
                <div
                    className="col-inside-lg decor-default activities"
                    id="friends"
                    style={{ overflowY: "auto", maxHeight: "700px", outline: "none" }}
                    tabIndex={5003}
                >
                    {filteredUsers.map((user, index) => (
                        <div className="friend-item" key={index}>
                            {user.profilePicture && (
                                <div className="avatar">
                                    <img
                                        src={user.profilePicture}
                                        className="img-responsive"
                                        alt="profile"
                                    />
                                </div>
                            )}
                            <div className="field title fw-bold">
                                {user.firstName + " " + user.lastName}
                                <p className="fw-light">{user.email}</p>
                            </div>
                            <div className="follow-button">
                                <button onClick={() => handleFollow(user)}>
                                    {user.isFollowed ? "Unfollow" : "Follow"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div> */}



            {/* 
            <ul className="friend-list">
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
                                <button onClick={() => handleFollow(user)}>
                                    {user.isFollowed ? "Unfollow" : "Follow"}
                                </button>
                            </div>
                        </div>

                    </li>
                ))}
            </ul> */}


        </>



        // <div className="page-container">
        //     <div className="search-container">
        //         <input
        //             type="text"
        //             placeholder="Search users"
        //             value={searchTerm}
        //             onChange={(e) => handleSearch(e.target.value)}
        //             className="search-input"
        //         />
        //     </div>
        //     <div className="centered-box">
        //         <ul className="user-list">
        //             {filteredUsers.map((user) => (
        //                 <li key={user.userId} className="user-item unit">
        //                     <div className="avatar">
        //                         {user.profilePicture && (
        //                             <img
        //                                 src={user.profilePicture}
        //                                 className="img-responsive"
        //                                 alt="profile"
        //                             />
        //                         )}
        //                     </div>
        //                     <div className="user-details">
        //                         <div className="field title fw-bold">
        //                             {user.firstName} {user.lastName}
        //                             <p className="fw-light">{user.email}</p>
        //                         </div>
        //                         <div className="follow-button">
        //                             <button onClick={() => handleFollow(user)}>
        //                                 {user.isFollowed ? "Unfollow" : "Follow"}
        //                             </button>
        //                         </div>
        //                     </div>
        //                 </li>
        //             ))}
        //         </ul>
        //     </div>
        // </div>
    );

}

export default FriendsSearchBox;