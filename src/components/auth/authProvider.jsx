import React, { useEffect, useState } from 'react';
import { AuthContext } from "./authContext";

function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [userData, setUserData] = useState(
        JSON.parse(localStorage.getItem('userData')) || null
    );

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        }
        else {
            localStorage.setItem('token', "null");
            setUserData(null);
        }
    }, [token]);

    useEffect(() => {
        if (userData) {
            localStorage.setItem('userData', JSON.stringify(userData));
        }
        else {
            localStorage.setItem('userData', "null");
        }
    }, [userData]);

    function logout() {
        setToken(null);
        setUserData(null);
    }

    return (
        <AuthContext.Provider value={{ token, setToken, userData, setUserData, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
