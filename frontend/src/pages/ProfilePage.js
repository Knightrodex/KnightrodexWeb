import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import UserProfile from "../components/UserProfile";
import Navbar from "../components/Navbar";
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

function ProfilePage() {
    // Define the hardcoded user data
    // const userData = {
    //     name: 'Ethan Constant',
    //     location: 'New York',
    //     photos: 253,
    //     followers: 500,
    //     following: 478,
    //     about: ['Web Developer', 'Lives in New York', 'Photographer'],
    //     recentPhotos: [
    //         'https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(112).webp',
    //         'https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(107).webp',
    //         'https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(108).webp',
    //         'https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(114).webp',
    //     ],
    // };
    
    const [userInfo, setUserInfo] = useState();

    // useEffect runs when the page loads
    useEffect(() => {
        getUserData();
    });

    const getUserData = async () => {
        const jwt = jwtDecode(localStorage.token);

        await axios.post('https://knightrodex-49dcc2a6c1ae.herokuapp.com/api/showuserprofile', {
            userId: jwt.userId,
            jwtToken: localStorage.token
        })
        .then((response) => {
            // console.log(response)
            setUserInfo(response.data);
        })
        .catch(err => {
            console.log(err);
        });
    }

    // axios.post('https://knightrodex-49dcc2a6c1ae.herokuapp.com/api/showuserprofile', {
    //     userId: jwt.userId,
    //     jwtToken: localStorage.token
    // })
    // .then((response) => {
    //     setUserData(response.data);
    // })
    // .catch(err => console.log(err));

    // console.log(userData2);

    return (
        <>
            <Navbar />
            {/* <UserProfile /> */}
            {/* Pass the userData as a prop to the UserProfile component */}
            {/* <UserProfile userData={userData} /> */}
            <UserProfile userData={userInfo} />
        </>
    );
}

export default ProfilePage;