import { useState } from 'react'
import axios from "axios";


export function useToken () {
    const getToken = () => {
        const tokenString = sessionStorage.getItem("token");
        const userToken = JSON.parse(tokenString);
        axios.defaults.headers.common["Authorization"] = userToken;
        return userToken;
    }
    console.log(getToken());
    const [token, setToken] = useState(getToken());

    const saveToken = userToken => {
        sessionStorage.setItem('token', JSON.stringify(userToken));
        setToken(userToken);
    }

    return {
        setToken: saveToken,
        token
    }
}

export function logout () {
    sessionStorage.removeItem('token');
    delete axios.defaults.headers.common["Authorization"];
}