import React, { useState } from 'react';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import './ForgotPassword.css';


function ForgotPasswordBox({ onSuccess }) {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://knightrodex-49dcc2a6c1ae.herokuapp.com/api/passwordsend', { email: email });
            console.log(response);
            if (response.status === 200) {
                console.log('Reset code sent successfully!');
                localStorage.setItem("inputtedEmail", email);
                setError(null);
                onSuccess(); // triggers the UI to update
            } else {
                console.error('Error sending reset code:', response.data.error);
                setError(response.data.error || 'Unknown error');
            }
        } catch (error) {
            console.error('Error sending reset code:', error.message);
            setError('Invalid Email. Please try again.');
        }
    };


    return (
        <div className="text-center" style={{ marginTop: '30vh' }}>
            <div className="container">
                <div className="row">
                    <div>
                        <div className="panel panel-default">
                            <div className="panel-body">
                                <div className="text-center">
                                    <h3><i className="fa fa-lock fa-4x"></i></h3>
                                    <h2 className="text-center">Forgot Password?</h2>
                                    <p>Please enter your email to receive a reset code.</p>
                                    <div className="panel-body">
                                        <form
                                            id="register-form"
                                            role="form"
                                            autoComplete="off"
                                            className="form"
                                            onSubmit={handleSubmit}
                                        >
                                            <div className="custom-form-group">
                                                <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <i className="glyphicon glyphicon-envelope color-blue"></i>
                                                    </span>
                                                    <input
                                                        id="email"
                                                        name="email"
                                                        placeholder="Email Address"
                                                        className="form-control"
                                                        type="email"
                                                        value={email} // Add this line to bind the input value to the state
                                                        onChange={handleEmailChange} // Add this line to handle email changes
                                                    />
                                                </div>
                                            </div>
                                            <div className="custom-form-group small-gap">
                                                <input
                                                    name="recover-submit"
                                                    className="btn btn-lg custom-login-btn btn-block"
                                                    value="Receive Reset Code"
                                                    type="submit"
                                                />
                                            </div>
                                        </form>
                                        {error && <p className="small-gap error-text">{error}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default ForgotPasswordBox;
