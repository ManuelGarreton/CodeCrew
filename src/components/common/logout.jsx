import React, { useContext, useState } from "react";
import { AuthContext } from "../auth/authContext";
import '../../assets/styles/common/logout.css';

const LogoutButton = () => {
    const { logout } = useContext(AuthContext);
    const [msg, setMsg] = useState("");

    const handleLogout = () => {
        logout();
        setMsg("Cerrando sesión...");
        window.location.href = '/';
        logout();
    }

    return (
        <>
            {msg.length > 0 && <div className="successMsg">{msg}</div>}
            <button className="logout-button" onClick={handleLogout}>Cerrar Sesión</button>
        </>
    );
}

export default LogoutButton;
