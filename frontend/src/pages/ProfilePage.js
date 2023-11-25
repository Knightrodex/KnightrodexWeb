import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import UserProfile from "../components/UserProfile";
import Navbar from "../components/Navbar";
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

function ProfilePage() {    
    const [userInfo, setUserInfo] = useState();
    const [isLoading, setIsLoading] = useState(true);

    // useEffect runs when the page loads
    useEffect(() => {
        getUserData();
    }, []);

    const getUserData = async () => {
        setIsLoading(true);

        const jwt = jwtDecode(localStorage.token);

        await axios.post('https://knightrodex-49dcc2a6c1ae.herokuapp.com/api/showuserprofile', {
            userId: jwt.userId,
            jwtToken: localStorage.token
        })
        .then((response) => {
            setIsLoading(false);
            setUserInfo(response.data);
            localStorage.setItem("token", response.data.jwtToken);   
        })
        .catch(err => {
            console.log(err);
        });
    }

    return (
        <>
            <Navbar />
            { (isLoading) ? <p>Loading...</p> : <UserProfile userData={userInfo} />}
        </>
    );
}

export default ProfilePage;