import '../../assets/styles/navbar/navbar.css';
import LogoutButton from '../common/logout';
import { useContext } from 'react';
import { AuthContext } from '../auth/authContext';

function isNull(value) {
    return value === "null";
}

function Navbar() {
    const { token, userData } = useContext(AuthContext);

    return (
        <nav className="navbar">
            <ul className="nav-links">
                <li><a href="/instrucciones">Instrucciones</a></li>
                <li><a href="/acerca-de-nosotros">Nosotros</a></li>
                <li><a href="/contacto">Contáctanos</a></li>
            </ul>
            <div className="home-icon">
                {isNull(token) ? (
                    <a href="/">Home 🏠</a>
                ) : (
                    <>  
                        <span>{userData?.username || ""}</span>
                        <div className="logout-button-wrapper">
                            <LogoutButton />
                        </div>
                        <a href="/">Home 🏠</a>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
