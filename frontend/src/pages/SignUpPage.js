import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
const md5 = require("blueimp-md5");

const SignUp = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [doPasswordsMatch, setDoPasswordsMatch] = useState(true);
    const [isPending, setIsPending] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [vis, setVis] = useState("password")
    
    const app_name = 'knightrodex-49dcc2a6c1ae'
    function buildPath(route) {
        if (process.env.NODE_ENV === 'production') {
            return 'https://' + app_name + '.herokuapp.com' + route;
        }
        else {
            return 'http://localhost:3000' + route;
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const app_name = 'knightrodex-49dcc2a6c1ae'
        function buildPath(route) {
            if (process.env.NODE_ENV === 'production') {
                return 'https://' + app_name + '.herokuapp.com' + route;
            }
            else {
                return 'http://localhost:3000' + route;
            }
        }

        await setIsPending(true);
        await setIsPasswordValid(true);
        await setIsEmailValid(true);
        await setDoPasswordsMatch(true);
        
        if (checkEmail() == false) {
            setIsEmailValid(false);
            setIsPending(false);
            return false;
        }

        if (password.length < 8) {
            setIsPasswordValid(false);
            setIsPending(false);
            return false;
        }
        
        if (!/[A-Z]+/.test(password)) {
            setIsPasswordValid(false);
            setIsPending(false);
            return false;
        }
        
        if (!/[a-z]+/.test(password)) {
            setIsPasswordValid(false);
            setIsPending(false);
            return false;
        }
        
        if (!/[0-9]+/.test(password)) {
            setIsPasswordValid(false);
            setIsPending(false);
            return false;
        }
        
        if (!/[^A-Za-z0-9]+/.test(password)) {
            setIsPasswordValid(false);
            setIsPending(false);
            return false;
        }

        if (password !== password2) {
            setDoPasswordsMatch(false);
            setIsPending(false);
            return false;
        }

        // hash password
        var hash = md5(password);

        // Create an object with the registration data
        const registrationData = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hash
        };

        axios.post('https://knightrodex-49dcc2a6c1ae.herokuapp.com/api/signup', registrationData)
            .then(response => {
                // Registration successful
                setError('');
                
                // Clear form fields
                setFirstName('');
                setLastName('');
                setEmail('');
                setPassword('');

                alert('Email needs to be verified before you can login, check your email');

                navigate('/');
            })
            .catch(err => {
                console.error('Error:', err);
                setError('An error occurred during registration. Please try again later.');
            });
    }

    const checkEmail = () => {
        var validRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (email.match(validRegex)) {
            return true;
        }

        return false;
    }
    
    const toggleVis = () => {
        if (vis === "password") {
            setVis("text");
            return;
        }

        setVis("password");
        return;
    }

    return (
        <>
            <section className="vh-20">
                <div className="container-fluid h-100">
                    <div className="row h-100">
                        <div className="col-sm-6 text-black d-flex flex-column justify-content-center align-items-center">
                        <div className="px-5 ms-xl-4 text-center">
                            <span className="h1 fw-bold mb-0">Sign Up</span>
                        </div>
                            <form style={{ width: '23rem' }} onSubmit={handleSubmit}>
                                <div>
                                    <br />
                                    <label>First Name: </label>
                                    <br />
                                    <input
                                        id='fName'
                                        type="text"
                                        required
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="form-control form-control-lg"
                                    />
                                    <br />
                                </div>
                                <div>
                                    <label>Last Name: </label>
                                    <br />
                                    <input
                                        id='lName'
                                        type="text"
                                        required
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="form-control form-control-lg"
                                    />
                                    <br />
                                </div>
                                <div>
                                    <label>Email: </label>
                                    <br />
                                    {(isEmailValid) ? 
                                        <input
                                            name='email'
                                            type="text"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="form-control form-control-lg"
                                        />
                                    :
                                        <input
                                            name='email'
                                            type="text"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="form-control form-control-lg border-danger border-3"
                                        />
                                    }
                                    {!isEmailValid && <p>*Must enter a valid email address</p>}
                                    <br />
                                </div>
                                <div>
                                    <label>Password: </label>
                                    <br />
                                    {(isPasswordValid) ?
                                        <input
                                            name='password'
                                            type={vis}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="form-control form-control-lg"
                                        />
                                    :
                                        <input
                                            name='password'
                                            type={vis}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="form-control form-control-lg border-danger border-3"
                                        />
                                        
                                    }
                                    <p><input type="checkbox" onClick={() => toggleVis()} /> Toggle Visibility</p>
                                    {!isPasswordValid && <p>*Password requirements: At least 8 characters, one uppercase, one lowercase, one number, one special character</p>}
                                </div>
                                <div>
                                    <label>Re-Enter Password: </label>
                                    {(doPasswordsMatch) ?
                                        <input
                                            name='password'
                                            type="password"
                                            required
                                            value={password2}
                                            onChange={(e) => setPassword2(e.target.value)}
                                            className="form-control form-control-lg"
                                        />
                                    :
                                        <input
                                            name="password"
                                            type={vis}
                                            required
                                            value={password2}
                                            onChange={(e) => setPassword2(e.target.value)}
                                            className="form-control form-control-lg border-danger border-3"
                                        />
                                        
                                    }
                                    {!doPasswordsMatch && <p>*Passwords must match</p>}
                                </div>
                                <br />
                                <br />
                                {!isPending && <button className="btn btn-info btn-lg btn-block" type='submit'>Create Account</button>}
                                {isPending && <button disabled className="btn btn-info btn-lg btn-block">Adding Account...</button>}
                            </form>
                            <div>
                                <br />
                                <br />
                                <p>Already have an account? <a href={buildPath('/')} className="link-info">Login Here</a></p>
                            </div>
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
}

export default SignUp;