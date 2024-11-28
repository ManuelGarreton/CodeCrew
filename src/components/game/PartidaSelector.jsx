import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/game/PartidaSelector.css';
import { AuthContext } from '../auth/authContext';

import TristianLuz from '../../../public/images/personajes/TristianLuz.png';

function PartidaSelector() {
    const { token, userData } = useContext(AuthContext);
    const navigate = useNavigate();
    const [partidas, setPartidas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5; // Cantidad de partidas por página

    useEffect(() => {
        axios.get(`${API_URL}/matches/publics`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(async response => {
            const partidasConCupos = await Promise.all(
                response.data.partidasPublicas.map(async (partida) => {
                    try {
                        const salaResponse = await axios.get(`${API_URL}/waiting_room/${partida.id}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        const cantidadJugadores = salaResponse.data.cantidadJugadores || 0;
                        return { ...partida, cupos: cantidadJugadores };
                    } catch (error) {
                        console.error(`Error fetching sala de espera for partida ${partida.id}:`, error);
                        return { ...partida, cupos: 0 };
                    }
                })
            );
            setPartidas(partidasConCupos);
        })
        .catch(error => {
            console.error("Error fetching partidas:", error);
        });
    }, [token]);

    const createPartidaPublica = () => {
        axios.post(`${API_URL}/matches`, { privada: false }, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            setPartidas(prevPartidas => [...prevPartidas, {
                ...response.data,
                cupos: 0 // Al crear la partida, el número inicial de cupos ocupados es 0
            }]);
        })
        .catch(error => {
            console.error("Error creando partida pública:", error);
        });
    };

    const joinPartida = (idPartida) => {
        axios.post(`${API_URL}/waiting_room/join`, {
            idUser: userData?.id,
            idGame: idPartida
        }, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            navigate(`/waiting-room/${idPartida}`);
        })
        .catch(error => {
            console.error("Error joining partida:", error);
        });
    };

    const handleNextPage = () => {
        if ((currentPage + 1) * itemsPerPage < partidas.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Partidas para la página actual y filtradas por búsqueda
    const filteredPartidas = partidas.filter(partida => 
        searchTerm === '' || (`Partida ${partida.id}`).includes(searchTerm)
    );
    const displayedPartidas = filteredPartidas.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    return (
        <div className="publics-partida-selector">
            <div className="publics-izquierda">
                <div className="publics-personaje-hablando">
                    <img src={TristianLuz} alt="Personaje hablando" />
                    <div className="publics-cuadro-dialogo">
                        <p>¡Unámonos a una partida!</p>
                    </div>
                </div>
                <button className="publics-boton-privado" onClick={createPartidaPublica}>Crear Partida Pública</button>
            </div>
            <div className="publics-derecha">
                <h2>PARTIDAS PÚBLICAS</h2>
                <input
                    type="text"
                    placeholder="Buscar partida (e.g., Partida 1)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="buscador-input"
                />
                <div className="flecha-izquierda" onClick={handlePreviousPage}></div>
                <div className="publics-partidas-publicas">
                    {displayedPartidas.map((partida) => (
                        <div key={partida.id} className="publics-partida-card">
                            <span>Partida {partida.id}</span>
                            <div className="publics-progress-bar">
                                <div className={`publics-progress-${partida.cupos}`}></div>
                            </div>
                            <span>{partida.cupos} / 4</span>
                            <button className="publics-button" onClick={() => joinPartida(partida.id)}>→</button>
                        </div>
                    ))}
                </div>
                <div className="flecha-derecha" onClick={handleNextPage}></div>
            </div>
            <button className="volver-btn" onClick={() => navigate('/modo-partida')}>Volver</button>
        </div>
    );
}

export default PartidaSelector;
