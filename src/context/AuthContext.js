import React, {useState} from "react";
import {createContext} from "react";
import {useHistory} from "react-router-dom";
import jwt_decode from 'jwt-decode';
import axios from "axios";

export const AuthContext = createContext({});

const AuthContextProvider = ({children}) => {
    const [isAuth, toggleIsAuth] = useState({
        isAuth: false,
        user: null,
    });

    const history = useHistory();

    async function getUserData(id, token) {
        try {
            const result = await axios.get(`http://localhost:3000/600/users/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(result);
            toggleIsAuth({
                    ...isAuth,
                    isAuth: true,
                    user: {
                        id: result.data.id,
                        email: result.data.email,
                        username: result.data.username
                    }
                });
        } catch (error) {
            console.error(error);
        }
    }

    function signIn(jwt) {

        const decoded = jwt_decode(jwt);

        console.log(decoded);
        console.log('Gebruiker is ingelogd');
        getUserData(decoded.sub, jwt);
        localStorage.setItem('token', jwt);
        history.push('/profile');
    }

    function signOut() {
        console.log('Gebruiker is uitgelogd');
        toggleIsAuth(
            {
                ...isAuth,
                isAuth: false,
                user: null
            });
        history.push('/');
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
                {children}
            </AuthContext.Provider>
        </div>
    );
};

export default AuthContextProvider;