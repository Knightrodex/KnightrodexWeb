 import Navbar from "../components/Navbar";
import SearchBar from '../components/SearchBar';
import Activities from "../components/Activities";
import { jwtDecode } from 'jwt-decode'
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
 import axios from 'axios';
import { setAuthToken } from '../components/setAuthToken';

function HomePage() {

    const users = [ // This is your initial list of users
        { id: 1, name: 'Steven Bagatini' },
        { id: 2, name: 'Natalie Smith' },
        { id: 3, name: 'John Doe' },
        // Add more user data
    ];


    const [userInfo, setUserInfo] = useState();
    const [isLoading, setIsLoading] = useState(true);

    // useEffect runs when the page loads
    useEffect(() => {
        getUserData();
    }, [userInfo]);

    const getUserData = async () => {
        setIsLoading(true);

        const jwt = jwtDecode(localStorage.token);

        await axios.post('https://knightrodex-49dcc2a6c1ae.herokuapp.com/api/getactivity', {
            userId: jwt.userId,
            jwtToken: localStorage.token
        })
        .then((response) => {
            setIsLoading(false);

            console.log(response);

            localStorage.setItem("token", response.data.jwtToken);   
            setAuthToken(localStorage.token);

            response.data.jwtToken = jwtDecode(response.data.jwtToken);
            setUserInfo(response.data);
        })
        .catch(err => {
            console.log("jknsdfknfgsdklsdnbklsedjbfkolsdjb");
            console.log(err);
        });
    }    

    return (
        <>
            <Navbar />
            <SearchBar users />
            <Activities userActivity={userInfo}/>
        </>
    );
}

export default HomePage;
