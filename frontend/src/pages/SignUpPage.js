import { useState } from 'react';

const SignUp = () => {
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
//buildPath('/api/signup')
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

    const checkEmail = () => {
        var validRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (email.match(validRegex)) {
            return true;
        }

        return false;
    }

    return (
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
    );
}

export default SignUp;