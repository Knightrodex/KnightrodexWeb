// we really need to add email verification!

import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import React, { useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { useNavigate } from 'react-router-dom';
import ForgotPasswordBox from '../components/ForgotPasswordBox';
import axios from 'axios';
import { setAuthToken } from '../components/setAuthToken';
import '../components/Login.css';


const md5 = require("blueimp-md5");


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
    const [errFlag, setErrFlag] = useState(false);
    const navigate = useNavigate();



    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrFlag(false);

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

                // store JWT in local
                localStorage.setItem("token", token);

                // set token to axios common header
                setAuthToken(token);

                navigate('/HomePage');
            })
            .catch(err => {
                console.log(err);
                findErrorMsg(err.message);
                setErrFlag(true);
            });


    }

    const findErrorMsg = (msg) => {
        if (msg == "Request failed with status code 500")
            setError("Email needs to be verified, click this link (not here yet lol)");
        else if (msg == "Request failed with status code 400")
            setError("Invalid email or password");
        else
            setError("ERROR");
    }

    return (

        <>

            <section className="vh-20">
                <div className="container-fluid h-100">
                    <div className="row h-100">
                        <div className="col-sm-6 text-black d-flex flex-column justify-content-center align-items-center">
                            <div className="mb-4">
                                <i className="fas fa-crow fa-2x me-3" style={{ color: '#709085' }}></i>
                                <span className="h1 fw-bold mb-0">Knightrodex</span>
                            </div>

                            <form style={{ width: '23rem' }} onSubmit={handleSubmit}>

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
                                {(errFlag) ? <p>{error}</p> : <p></p>}
                                <div className="mb-4">
                                    <button className="btn btn-lg btn-primary btn-block" type="submit">Login</button>
                                </div>
                                {(errFlag) ? <p>{error}</p> : <p></p>}
                                <p className="small mb-5 pb-lg-2 text-center"><a className="text-muted" href={buildPath('/ResetPasswordPage')}>Forgot password?</a></p>
                                <p className="small mb-5 pb-lg-2"><a className="text-muted" href={buildPath('/HomePage')}>Forgot password?</a></p>
                                <p className= "text-center">Don't have an account? <a href={buildPath('/SignUp')} className="link-info">Register here</a></p>
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