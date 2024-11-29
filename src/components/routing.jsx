import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './navbar/navbar.jsx';
import NavbarHome from './navbar/navbarHome.jsx';

import AboutUs from './navbar/aboutus.jsx';
import Instructions from './navbar/instructions.jsx';
import Contact from './navbar/contact.jsx';

import LandingPage from './common/landingpage.jsx';
import GamesAdmin from './common/GamesAdmin.jsx';
import Register from './common/register.jsx'
import Login from './common/login.jsx'

import Characters from './game/characters.jsx';
import CharactersView from './game/charactersView'; 
import PartidaSelector from './game/PartidaSelector.jsx';
import WaitingRoom from './game/WaitingRoom.jsx';
import Board from './game/board.jsx'
import EleccionModoPartida from './game/EleccionModoPartida.jsx';
import PrivateGame from './game/PartidaPrivada.jsx';


function Routing() {
    return (
        <>
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <Routes>
                    <Route path={'/'} element={<> <Navbar/><LandingPage/> </>} />
                    <Route path={'/instrucciones'} element={<> <NavbarHome/><Instructions/> </>} />
                    <Route path={'/acerca-de-nosotros'} element={<> <NavbarHome/><AboutUs/> </>} />
                    <Route path={'/contacto'} element={<> <NavbarHome/><Contact/> </>} />
                    <Route path={'/registro'} element={<> <NavbarHome/><Register/> </>} />
                    <Route path={'/ingreso'} element={<> <NavbarHome/><Login/> </>} />
                    <Route path={'/personajes'} element={<> <Navbar/><Characters/> </>} />
                    <Route path={'/personajes-vista'} element={<> <Navbar/><CharactersView/> </>} />
                    <Route path={'/waiting-room/:idGame'} element={<> <Navbar/><WaitingRoom/> </>} /> {/* Parámetro idGame */}
                    <Route path={'/seleccionar-partida'} element={<> <Navbar/><PartidaSelector/> </>} />
                    <Route path={"/board/:idGame"} element={<> <Navbar/><Board/> </>} />
                    <Route path={'/modo-partida'} element={<> <Navbar/><EleccionModoPartida /> </>} />
                    <Route path={'/partida-privada'} element={<> <Navbar/><PrivateGame /> </>} /> 
                    <Route path={'/admin/games'} element={<> <Navbar/> <GamesAdmin />  </>} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default Routing;
