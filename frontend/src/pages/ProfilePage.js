import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import UserProfile from "../components/UserProfile";
import Navbar from "../components/Navbar";
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { setAuthToken } from '../components/setAuthToken';

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
        })
        .catch(err => {
            console.log(err);
        });
    }

    // the loading text doesnt display (i think because it's not styled so it's covered by the nav bar)
    return (
        <>
            <Navbar />
            { (isLoading) ? <p>Loading...</p> : <UserProfile userData={userInfo} />} 
        </>
    );
}

export default ProfilePage;