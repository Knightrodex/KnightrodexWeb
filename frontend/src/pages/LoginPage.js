import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

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


    const doLogin = async (e) => {
        e.preventDefault();
        // Create an object with the login data
        const loginData = {
            email: loginUsername,
            password: loginPassword,
        };

        try {
            const response = await fetch('https://knightrodex-49dcc2a6c1ae.herokuapp.com/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            if (response.ok) {

                const data = await response.json();
                if (data.error) {
                    setError(data.error);
                    alert("Login Failed!");

                } else {
                    // Login successful, you can redirect or perform other actions
                    setError('');
                    alert('Login successful!'); // Display a success message or redirect here
                    window.location.href = '/HomePage';
                }
            } else {

                // Handle login failure here
                setError('Invalid credentials');
                alert('Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred during login. Please try again later.');
        }


            const [firstName, setFirstName] = useState('');
            const [lastName, setLastName] = useState('');
            const [email, setEmail] = useState('');
            const [username, setUsername] = useState('');
            const [password1, setPassword1] = useState('');
            const [password2, setPassword2] = useState('');
            const [isPending, setIsPending] = useState(false);
            const [isPasswordValid, setIsPasswordValid] = useState(true);
            const [isEmailValid, setIsEmailValid] = useState(true);
            const [error, setError] = useState('');

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

                setIsPending(true);
                setIsPasswordValid(true);
                setIsEmailValid(true);

                if (password1 !== password2) {
                    setIsPasswordValid(false);
                    setIsPending(false);
                }

                if (checkEmail() == false) {
                    setIsEmailValid(false);
                    setIsPending(false);
                }

                if (!isPending) {
                    console.log("hello");
                    // then we do API to add an account
                    // redirect when done!

                    // Create an object with the registration data
                    const registrationData = {
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        password: password1
                    };
                    try {
                        const response = await fetch('https://knightrodex-49dcc2a6c1ae.herokuapp.com/api/signup', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(registrationData),
                        });

                        if (response.ok) {
                            const data = await response.json();
                            if (data.error) {
                                setError(data.error);
                            } else {
                                // Registration successful
                                setError('');
                                // You can set a success message if needed
                                // setSuccessMessage('Registration successful!');
                                // Clear form fields
                                setFirstName('');
                                setLastName('');
                                setEmail('');
                                setPassword1('');
                                window.location.href = buildPath('/');

                            }
                        } else {
                            // Handle registration failure here
                            setError('Registration failed. Please check your registration data.');
                        }
                    } catch (error) {
                        console.error('Error:', error);
                        setError('An error occurred during registration. Please try again later.');
                    }


                }
            }
        };

    const checkEmail = () => {
        var validRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (email.match(validRegex)) {
            return true;
        }

        return false;
    }

    return (
        <section className="vh-20">
            <div className="container-fluid h-100">
                <div className="row h-100">
                    <div className="col-sm-6 text-black d-flex flex-column justify-content-center align-items-center">
                        <div className="px-5 ms-xl-4 text-center">
                            <i className="fas fa-crow fa-2x me-3" style={{ color: '#709085' }}></i>
                            <span className="h1 fw-bold mb-0">Knightrodex</span>
                        </div>
                        <form style={{ width: '23rem' }} onSubmit={doLogin}>
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
                            <p className="small mb-5 pb-lg-2"><a className="text-muted" href="#!">Forgot password?</a></p>
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

            <div className="signUp">
                <h1>This is where you will sign up</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>First Name: </label>
                        <input
                            type="text"
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Last Name: </label>
                        <input
                            type="text"
                            required
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Email: </label>
                        <input
                            type="text"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {!isEmailValid && <p>Must enter a valid email address</p>}
                    </div>
                    <div>
                        <label>Username: </label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Password: </label>
                        <input
                            type="text"
                            required
                            value={password1}
                            onChange={(e) => setPassword1(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Confirm password: </label>
                        <input
                            type="text"
                            required
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                        />
                        {!isPasswordValid && <p>Passwords must match</p>}
                    </div>
                    {!isPending && <button>Create Account</button>}
                    {isPending && <button disabled>Adding Account...</button>}
                </form>
            </div>
        </section>


    );




};
export default Login;