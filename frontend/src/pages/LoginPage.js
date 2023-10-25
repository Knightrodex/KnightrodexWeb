import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

function Login() {

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
    };

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
                            <div className="form-outline mb-4">
                                <input
                                    type="email"
                                    id="form2Example18"
                                    name="loginUsername"
                                    className="form-control form-control-lg"
                                    value={loginUsername}
                                    onChange={(e) => setLoginUsername(e.target.value)}
                                />
                                <label className="form-label" htmlFor="form2Example18">Email address</label>
                            </div>
                            <div className="form-outline mb-4">
                                <input
                                    type="password"
                                    id="form2Example28"
                                    name="loginPassword"
                                    className="form-control form-control-lg"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                />
                                <label className="form-label" htmlFor="form2Example28">Password</label>
                            </div>
                            <div className="mb-4">
                                <button className="btn btn-info btn-lg btn-block" type="submit">Login</button>
                            </div>
                            <p className="small mb-5 pb-lg-2"><a className="text-muted" href="#!">Forgot password?</a></p>
                            <p>Don't have an account? <a href="/SignUp" className="link-info">Register here</a></p>
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
    );

};
export default Login;