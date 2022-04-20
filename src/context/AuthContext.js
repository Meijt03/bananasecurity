import React, {useState, useEffect} from "react";
import {createContext} from "react";
import {useHistory} from "react-router-dom";
import jwt_decode from 'jwt-decode';
import axios from "axios";

export const AuthContext = createContext({});

const AuthContextProvider = ({children}) => {
    const [isAuth, toggleIsAuth] = useState({
        isAuth: false,
        user: null,
        status: 'pending',
    });

    const history = useHistory();

    useEffect (() => {

        const token = localStorage.getItem('token');

        if (token) {
            const decoded = jwt_decode(token);
            getUserData(decoded.sub, token);
        } else {

            toggleIsAuth({
                isAuth: false,
                user: null,
                status: 'done',
            });
        }
    }, []);

    function signIn(jwt) {

        const decoded = jwt_decode(jwt);

        console.log(decoded);
        console.log('Gebruiker is ingelogd');
        getUserData(decoded.sub, jwt,);
        localStorage.setItem('token', jwt);

    }

    function signOut() {

        toggleIsAuth(
            {
                ...isAuth,
                isAuth: false,
                user: null
            });
        console.log('Gebruiker is uitgelogd');
        history.push('/');
        localStorage.removeItem('token');
    }



    async function getUserData(id, token) {
        try {
            const result = await axios.get(`http://localhost:3000/600/users/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(result.data);
            toggleIsAuth({
                ...isAuth, isAuth: true,
                status: 'done',
                user: {
                    id: result.data.id,
                    email: result.data.email,
                    username: result.data.username
                }
            });
            history.push('/profile');
        } catch (error) {
            console.error(error);
        }
    }


    const data = {
        isAuth: isAuth.isAuth,
        user: isAuth.user,
        login: signIn,
        logout: signOut,
    };

    return (
        <div>
            <AuthContext.Provider value={data}>
                {isAuth.status === 'done' ? children : <p>Loading...</p>}
            </AuthContext.Provider>
        </div>
    );
};

export default AuthContextProvider;