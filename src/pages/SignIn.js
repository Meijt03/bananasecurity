import React, {useContext, useState} from 'react';
import {Link} from 'react-router-dom';
import {AuthContext} from "../context/AuthContext";
import axios from "axios";

function SignIn() {

    const {login} = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const result = await axios.post('http://localhost:3000/login', {
                email: email,
                password: password
            });

            login(result.data.accessToken);

        } catch (e) {
            console.error(e);
        }
    }

    return (
        <>
            <h1>Inloggen</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab alias cum debitis dolor dolore fuga id
                molestias qui quo unde?</p>

            <form onSubmit={handleSubmit}>
                <label htmlFor="signin-email">Email
                </label>
                <input type="email"
                       id="signin-email"
                       onChange={(e) => (setEmail(e.target.value))}
                       value={email}
                />
                <label htmlFor="signin-password">Password
                </label>
                <input type="password"
                       id="signin-password"
                       onChange={(e) => (setPassword(e.target.value))}
                       value={password}
                />
                <button
                    type="submit"
                >
                    Inloggen
                </button>
            </form>

            <p>Heb je nog geen account? <Link to="/signup">Registreer</Link> je dan eerst.</p>
        </>
    );
}

export default SignIn;