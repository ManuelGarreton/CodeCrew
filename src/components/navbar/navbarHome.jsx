import '../../assets/styles/navbar/navbar.css'

function NavbarHome() {
    return (
        <nav className="navbar">
            <ul className="nav-links">
                <li><a href="/instrucciones">Instrucciones</a></li>
                <li><a href="/acerca-de-nosotros">Nosotros</a></li>
                <li><a href="/contacto">Contáctanos</a></li>
            </ul>
            <div className="home-icon">
                <a href="/">
                Home 🏠
                </a>
            </div>
        </nav>
    );
}

export default NavbarHome