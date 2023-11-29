import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import './ForgotPassword.css';
import { useNavigate } from 'react-router-dom';

const md5 = require("blueimp-md5");



function NewPasswordBox() {
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();


    const handlePasswordChange = (e) => {
        setNewPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userEmail = localStorage.getItem("inputtedEmail");
        const resetCode = localStorage.getItem("inputtedResetCode");

        // Hash password here
        var hash = md5(newPassword);


        try {
            const response = await axios.post('https://knightrodex-49dcc2a6c1ae.herokuapp.com/api/passwordupdate', { email: userEmail, userReset: resetCode, newPassword: hash });
            console.log(response);
            if (response.status === 200) {
                console.log('New passowrd successfully set!');
                setSuccess(true);
                setError(null);
                // wait 2 seconds before redirecting
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                console.error('Error sending reset code:', response.data.error);
                setSuccess(false);
                setError(response.data.error || 'Unknown error');
            }
        } catch (error) {
            console.error('Error sending reset code:', error.message);
            setSuccess(false);
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
                                    <h2 className="text-center">Create New Password</h2>
                                    <p>Please enter a new password.</p>
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
                                                        placeholder="New Password"
                                                        className="form-control"
                                                        value={newPassword} // Add this line to bind the input value to the state
                                                        onChange={handlePasswordChange} // Add this line to handle email changes
                                                    />
                                                </div>
                                            </div>
                                            <div className="custom-form-group small-gap">
                                                <input
                                                    name="recover-submit"
                                                    className="btn btn-lg btn-primary btn-block"
                                                    value="Update Password"
                                                    type="submit"
                                                />
                                            </div>
                                        </form>
                                        {error && <p className="small-gap error-text">{error}</p>}
                                        {success && <p className="small-gap success-text">New password successfully created! Redirecting to login page.</p>}
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

export default NewPasswordBox;
