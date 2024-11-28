import React, { useState, useContext } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/game/PartidaPrivada.css';
import { AuthContext } from '../auth/authContext';

import TristianLuz from '../../../public/images/personajes/TristianLuz.png';

function PartidaPrivada() {
  const { token, userData } = useContext(AuthContext);
  const navigate = useNavigate();
  const [codigoPartida, setCodigoPartida] = useState(null);
  const [codigoIngreso, setCodigoIngreso] = useState('');

  // Crear una partida privada y mostrar el ID como código
  const handleCreatePartidaPrivada = () => {
    axios.post(`${API_URL}/matches`, { privada: true }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      setCodigoPartida(response.data.id); // Guarda el ID como el código de la partida
    })
    .catch(error => {
      console.error("Error creando partida privada:", error);
    });
  };

  // Unirse a una partida privada y a la sala de espera, luego redirigir a la sala de espera
  const joinPartida = (codigoPartida) => {
    axios.post(`${API_URL}/waiting_room/join`, {
        idUser: userData?.id,
        idGame: codigoPartida
    }, {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
        navigate(`/waiting-room/${codigoPartida}`);
    })
    .catch(error => {
        console.error("Error joining partida:", error);
    });
  };

  return (
    <div className="partida-privada">
      <div className="priv-izquierda">
        <div className="priv-personaje-hablando">
          <img src={TristianLuz} alt="Personaje hablando" />
          <div className="priv-cuadro-dialogo">
            <p>¡PARTIDA PRIVADA!</p>
          </div>
        </div>
      </div>
      <div className="priv-derecha">
        <h2>CREAR UNA PARTIDA</h2>
        <button onClick={handleCreatePartidaPrivada}>Crear Partida</button>
        
        {codigoPartida && (
          <p>Código de la partida: {codigoPartida}</p>
        )}
        
        <h2>UNIRSE A UNA PARTIDA</h2>
        <div className="codigo-input">
          <label>Ingrese el código de la partida</label>
          <input
            type="text"
            value={codigoIngreso}
            onChange={(e) => setCodigoIngreso(e.target.value)}
          />
        </div>
        <button onClick={() => joinPartida(codigoIngreso)}>Unirse a la Partida</button>
      </div>
      <button className="volver-btn" onClick={() => navigate('/modo-partida')}>Volver</button>
    </div>
  );
}

export default PartidaPrivada;
