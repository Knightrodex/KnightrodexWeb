import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import UserProfile from "../components/UserProfile";
import Navbar from "../components/Navbar";

function ProfilePage() {
    // Define the hardcoded user data
    const userData = {
        name: 'Ethan Constant',
        location: 'New York',
        photos: 253,
        followers: 500,
        following: 478,
        about: ['Web Developer', 'Lives in New York', 'Photographer'],
        recentPhotos: [
            'https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(112).webp',
            'https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(107).webp',
            'https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(108).webp',
            'https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(114).webp',
        ],
    };

    return (
        <>
            <Navbar />
            {/* <UserProfile /> */}
            {/* Pass the userData as a prop to the UserProfile component */}
            <UserProfile userData={userData} />
        </>
    );
}

export default ProfilePage;