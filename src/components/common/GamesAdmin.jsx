import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/common/gamesAdmin.css';

function AdminGames() {
  const [games, setGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [error, setError] = useState(null);
  const itemsPerPage = 5; // Número de partidas por página
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGamesWithPlayerCount = async () => {
      try {
        const response = await axios.get(`${API_URL}/matches`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        
        const gamesWithPlayers = await Promise.all(
          response.data.partidas.map(async (game) => {
            try {
              const salaResponse = await axios.get(`${API_URL}/waiting_room/${game.id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
              });
              const cantidadJugadores = salaResponse.data.cantidadJugadores || 0;
              return { ...game, cupos: cantidadJugadores };
            } catch (error) {
              console.error(`Error fetching sala de espera for partida ${game.id}:`, error);
              return { ...game, cupos: 0 };
            }
          })
        );
        setGames(gamesWithPlayers);
      } catch (err) {
        console.error('Error al cargar las partidas:', err);
        setError('No se pudieron cargar las partidas.');
      }
    };

    fetchGamesWithPlayerCount();
  }, []);

  const handleNextPage = () => {
    if ((currentPage + 1) * itemsPerPage < games.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const deleteGame = (gameId) => {
    axios
      .delete(`${API_URL}/matches/delete/${gameId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then(() => {
        setGames(games.filter((game) => game.id !== gameId));
      })
      .catch((err) => {
        console.error('Error al eliminar la partida:', err);
        setError('Error al eliminar la partida.');
      });
  };

  const filteredGames = games.filter(
    (game) =>
      searchTerm === '' || `Partida ${game.id}`.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const displayedGames = filteredGames.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <div className="admin-games-container">
      <div className="admin-games-list">
        <h1 className="admin-games-title">Gestión de Partidas</h1>
        <input
          type="text"
          placeholder="Buscar partida (e.g., Partida 1)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="admin-search-input"
        />
        {error && <p className="admin-error">{error}</p>}
        {displayedGames.length > 0 ? (
          displayedGames.map((game) => (
            <div key={game.id} className="admin-game-card">
              <p>Partida {game.id}</p>
              <p>Estado: {game.estado}</p>
              <p>Tipo: {game.privada ? 'Privada' : 'Pública'}</p>
              <p>Jugadores: {game.cupos} / 4</p>
              <button
                className="admin-delete-button"
                onClick={() => deleteGame(game.id)}
              >
                Eliminar partida
              </button>
            </div>
          ))
        ) : (
          <p>No hay partidas disponibles.</p>
        )}
        <div className="admin-pagination">
          <button
            className="admin-pagination-button"
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
          >
            Anterior
          </button>
          <button
            className="admin-pagination-button"
            onClick={handleNextPage}
            disabled={(currentPage + 1) * itemsPerPage >= filteredGames.length}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminGames;
