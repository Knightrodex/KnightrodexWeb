// hello future Ethan or Caden, can you implement something to display that someone
// tried to login with invalid credentials, an error message or something that
// displays under the form after you try to login and fail.
// Thanks    - Caden from the past

import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import React, { useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router-dom';
import ForgotPasswordBox from '../components/ForgotPasswordBox';
import axios from 'axios';
import { setAuthToken } from '../components/setAuthToken';
const md5 = require("blueimp-md5");
//import { jwtDecode } from 'jwt-decode';
 //const jwt = require("jsonwebtoken");



function Login() {

    const app_name = 'knightrodex-49dcc2a6c1ae'
    function buildPath(route) {
        if (process.env.NODE_ENV === 'production') {
            return 'https://' + app_name + '.herokuapp.com' + route;
        }
        else {
            return 'http://localhost:3000' + route;
        }
    } //  buildPath('/api/login')


    // State variables
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [error, setError] = useState('');
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
 


    const handleSubmit = async (e) => {
        e.preventDefault();

        // hash password
        var hash = md5(loginPassword);

        // create an object with the login data
        const loginData = {
            email: loginUsername,
            password: hash
        };

        axios.post("https://knightrodex-49dcc2a6c1ae.herokuapp.com/api/login", loginData)
            .then(response => {
                // get token from response

                const token = response.data.jwtToken;
                //const decodedToken = jwtDecode(localStorage.token);

                // store user ID in local
                // localStorage.setItem("userID", decodedToken.userID);
                console.log("IM WORKING");
                //console.log("Decoded Token:", decodedToken);


                // store JWT in local
                localStorage.setItem("token", token);

                // set token to axios common header
                setAuthToken(token);

                navigate('/HomePage');
            })
            .catch(err => console.log(err));
    }

    // ------------------------------------------------------ preserving this bad boi
    // const doLogin = async (e) => {
    //     e.preventDefault();

    //     // hash password
    //     var hash = md5(loginPassword);

    //     // Create an object with the login data
    //     const loginData = {
    //         email: loginUsername,
    //         password: hash
    //     };

    //     try {
    //         const response = await fetch('https://knightrodex-49dcc2a6c1ae.herokuapp.com/api/login', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(loginData),
    //         });

    //         if (response.ok) {

    //             const data = await response.json();
    //             if (data.error) {
    //                 setError(data.error);
    //                 alert("Login Failed!");

    //             } else {
    //                 // Login successful, you can redirect or perform other actions
    //                 setError('');
    //                 setUser(data);

    //                 alert('Login successful!'); // Display a success message or redirect here
    //                 await navigate('/HomePage');
    //             }
    //         } else {

    //             // Handle login failure here
    //             setError('Invalid credentials');
    //             alert('Login failed. Please check your credentials.');
    //         }
    //     } catch (error) {
    //         console.error('Error:', error);
    //         setError('An error occurred during login. Please try again later.');
    //     }
    // };


    return (

        <>

            <section className="vh-20">
                <div className="container-fluid h-100">
                    <div className="row h-100">
                        <div className="col-sm-6 text-black d-flex flex-column justify-content-center align-items-center">
                            <div className="px-5 ms-xl-4 text-center">
                                <i className="fas fa-crow fa-2x me-3" style={{ color: '#709085' }}></i>
                                <span className="h1 fw-bold mb-0">Knightrodex</span>
                            </div>
 
                            <form style={{ width: '23rem' }} onSubmit={handleSubmit}>
                                <h3 className="fw-normal mb-3 pb-3" style={{ letterSpacing: '1px' }}>Log in</h3>
                                <div className="mb-4">
                                    <label className="form-label" htmlFor="form2Example18">Email address</label>
                                    <input
                                        type="email"
                                        id="form2Example18"
                                        name="loginUsername"
                                        className="form-control form-control-lg"
                                        value={loginUsername}
                                        onChange={(e) => setLoginUsername(e.target.value)}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label" htmlFor="form2Example28">Password</label>
                                    <input
                                        type="password"
                                        id="form2Example28"
                                        name="loginPassword"
                                        className="form-control form-control-lg"
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                    />
                                </div>
                                <div className="mb-4">
                                    <button className="btn btn-info btn-lg btn-block" type="submit">Login</button>
                                </div>
                                <p className="small mb-5 pb-lg-2"><a className="text-muted" href={buildPath('/HomePage')}>Forgot password?</a></p>
                                <p>Don't have an account? <a href={buildPath('/SignUp')} className="link-info">Register here</a></p>
                            </form>
                        </div>
                        <div className="col-sm-6 px-0 d-none d-sm-block" style={{ maxHeight: '100vh', overflow: 'hidden' }}>
                            <img
                                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img3.webp"
                                alt="Login image"
                                className="w-100"
                                style={{ maxWidth: '100%', height: 'auto' }}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );




};
export default Login;