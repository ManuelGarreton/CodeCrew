import React, { useEffect, useState } from 'react';
import { AuthContext } from "./authContext";

function AuthProvider({ children }) {
    const [token, setToken] = useState(sessionStorage.getItem('token') || "null"); // Cambiar null por "null"
    const [userData, setUserData] = useState(
        JSON.parse(sessionStorage.getItem('userData')) || null
    );

    useEffect(() => {
        if (token && token !== "null") {
            sessionStorage.setItem('token', token);
        } else {
            sessionStorage.setItem('token', "null");
            setUserData(null);
        }
    }, [token]);

    useEffect(() => {
        if (userData) {
            sessionStorage.setItem('userData', JSON.stringify(userData));
        } else {
            sessionStorage.setItem('userData', "null");
        }
    }, [userData]);

    function logout() {
        setToken("null"); // Asegúrate de usar "null" aquí
        setUserData(null);
    }

    return (
        <AuthContext.Provider value={{ token, setToken, userData, setUserData, logout }}>
            {children}
        </AuthContext.Provider>
    );
}


export default AuthProvider;
