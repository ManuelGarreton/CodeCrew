// src/components/game/EleccionModoPartida.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/game/EleccionModoPartida.css';

// Importa la imagen del personaje Valery
import ValeryHuskovic from '../../assets/images/personajes/ValeryHuskovic.png';

function EleccionModoPartida() {
    const navigate = useNavigate();

    const handlePublicGame = () => {
        navigate('/seleccionar-partida');
    };

    const handlePrivateGame = () => {
        navigate('/partida-privada');
    };
    

    return (
        <div className="modo-partida">
            <div className="modo-izquierda">
                <div className="modo-personaje-hablando">
                    <img src={ValeryHuskovic} alt="Personaje Valery" />
                    <div className="modo-cuadro-dialogo">
                        <p>Elige el modo de partida!</p>
                    </div>
                </div>
            </div>
            <div className="modo-derecha">
                <h1>MODO PARTIDA</h1>
                <div className="modo-botones">
                    <button className="boton-partida" onClick={handlePublicGame}>Partida Pública</button>
                    <button className="boton-partida" onClick={handlePrivateGame}>Partida Privada</button>
                </div>
            </div>
        </div>
    );
}

export default EleccionModoPartida;
