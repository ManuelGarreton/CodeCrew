import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { SocketContext } from '../sockets/SocketContext';
import { API_URL } from '../config';
import '../../assets/styles/game/board.css';

// Importar todas las imágenes necesarias
import Agronomia from '../../../public/images/facultades/agronomia.png';
import Civil from '../../../public/images/facultades/civil.png';
import College from '../../../public/images/facultades/college.png';
import Comercial from '../../../public/images/facultades/comercial.png';
import Construccion from '../../../public/images/facultades/construccion.png';
import Dcc from '../../../public/images/facultades/dcc.png';
import Matematicas from '../../../public/images/facultades/matematicas.png';
import Pedagogia from '../../../public/images/facultades/pedagogia.png';
import Teologia from '../../../public/images/facultades/teologia.png';
import Veterinaria from '../../../public/images/facultades/veterinaria.png';
import Biblio from '../../../public/images/puntos_de_interes/biblio.png';
import Capilla from '../../../public/images/puntos_de_interes/capilla.png';
import Deportes from '../../../public/images/puntos_de_interes/deportes.png';
import Hall from '../../../public/images/puntos_de_interes/hall.png';
import Innova from '../../../public/images/puntos_de_interes/innova.png';
import Meones from '../../../public/images/puntos_de_interes/meones.png';
import dadoImage from '../../../public/images/elementos/dice.png';
import ChestImage from '../../../public/images/elementos/chest.png';

// Mapa de imágenes
const imageMap = {
  'i-1': Biblio,
  'i-2': Innova,
  'i-3': Hall,
  'i-4': Meones,
  'i-5': Capilla,
  'i-6': Deportes,
  'f-1': Civil,
  'f-2': Dcc,
  'f-3': Comercial,
  'f-4': College,
  'f-5': Teologia,
  'f-6': Veterinaria,
  'f-7': Construccion,
  'f-8': Pedagogia,
  'f-9': Agronomia,
  'f-10': Matematicas,
};

function Board() {
  const { idGame } = useParams();
  const { socket } = useContext(SocketContext);

  const [originalBoard, setOriginalBoard] = useState([]);
  const [board, setBoard] = useState([]);
  const [jugadores, setJugadores] = useState([]);
  const [jugadorActual, setJugadorActual] = useState(null);
  const [inventarioVisible, setInventarioVisible] = useState(false);
  const [dadoResultado, setDadoResultado] = useState(null);
  const [movimientosRestantes, setMovimientosRestantes] = useState(0);

  // Carga inicial del tablero, jugadores y turno actual
  useEffect(() => {
    fetchTablero();
    fetchJugadores();
    fetchTurnoActual();

    if (socket.current) {
      socket.current.emit("joinRoom", `sala-${idGame}`);
      socket.current.on("playerUpdated", handlePlayerUpdate);

      return () => {
        socket.current.emit("leaveRoom", `sala-${idGame}`);
        socket.current.off("playerUpdated", handlePlayerUpdate);
      };
    }
  }, [idGame, socket]);

  const fetchTablero = () => {
    axios
      .get(`${API_URL}/board/${idGame}`)
      .then((response) => {
        const { tableroOriginal, jugadores } = response.data;
        console.log("Tablero cargado:", tableroOriginal); // Log para depuración
        console.log("Jugadores cargados:", jugadores); // Log para depuración
        setBoard(tableroOriginal || []);
        setJugadores(jugadores || []);
      })
      
      .catch((error) => console.error("Error al obtener el tablero:", error));
      
  };



  const fetchJugadores = () => {
    axios
      .get(`${API_URL}/players`)
      .then((response) => {
        console.log("Todos los jugadores:", response.data); // Log para verificar la respuesta completa
        const jugadoresPartida = response.data.filter(
          (jugador) => jugador.idPartida === parseInt(idGame, 10)
        );
        console.log("Jugadores filtrados por partida:", jugadoresPartida);
        const jugadoresConPosicion = jugadoresPartida.map(async (jugador) => {
          const jugadorConPosicion = await axios.get(
            `${API_URL}/players/${jugador.idJugador}`
          );
          return jugadorConPosicion.data;
        });
        Promise.all(jugadoresConPosicion).then((jugadoresData) => {
          setJugadores(jugadoresData);
          console.log("Jugadores cargados con posición:", jugadoresData); // Log para verificar datos finales
        });
      })
      .catch((error) =>
        console.error("Error al obtener los jugadores:", error)
      );
  };

  const fetchTurnoActual = () => {
    axios
      .get(`${API_URL}/matches/index/${idGame}`)
      .then((response) => {
        const idJugadorActual = response.data.turnoActual;
        fetchJugadorActual(idJugadorActual);
      })
      .catch((error) => console.error("Error al obtener el turno actual:", error));
  };

  const fetchJugadorActual = (idJugador) => {
    axios
      .get(`${API_URL}/players/${idJugador}`)
      .then((response) => {
        setJugadorActual(response.data);
        setMovimientosRestantes(response.data.movimientosRestantes || 0);
        console.log("Jugador actual cargado:", response.data); // Log para depuración
      })
      .catch((error) => console.error("Error al obtener el jugador actual:", error));
  };

  const handlePlayerUpdate = (data) => {
    if (data.idGame === parseInt(idGame, 10)) {
      console.log("Jugadores actualizados:", data.players); // Log para depuración
      setJugadores(data.players || []);
    }
  };

  const tirarDado = () => {
    if (!jugadorActual) return;

    axios
      .post(`${API_URL}/players/tirar_dado/${idGame}/${jugadorActual.idJugador}`)
      .then((response) => {
        setDadoResultado(response.data.dado);
        setMovimientosRestantes(response.data.dado);
        console.log("Dado tirado:", response.data.dado); // Log para depuración
      })
      .catch((error) => console.error("Error al tirar el dado:", error));
  };

  const moverJugador = (direccion) => {
    if (movimientosRestantes <= 0) {
      alert("No hay movimientos restantes!");
      return;
    }
  
    axios.patch(`${API_URL}/board/move_with_dice/${jugadorActual.idJugador}`, { direccion })
      .then(response => {
        const { movimientosRestantes: nuevosMovimientosRestantes, tableroOriginal, nuevaPosicion, mensaje } = response.data;
  
        // Actualiza el tablero y el estado del jugador actual
        setOriginalBoard(tableroOriginal);
        setMovimientosRestantes(nuevosMovimientosRestantes);
  
        // Actualiza la posición del jugador actual en el frontend
        setJugadorActual(prevJugador => ({
          ...prevJugador,
          posicion: nuevaPosicion
        }));
  
        if (mensaje) {
          if (mensaje === "Posición inicial del jugador no definida.") {
            alert("Posición inicial del jugador no definida.");
          } else if (mensaje === "Dirección no válida.") {
            alert("Dirección no válida.");
          } else if (mensaje === "Movimiento fuera de los límites del tablero.") {
            alert("Movimiento fuera de los límites del tablero.");
          } else if (mensaje === "Intentaste moverte a una casilla de pasto. Escoge otra dirección.") {
            alert("Intentaste moverte a una casilla de pasto. Escoge otra dirección.");
          }
        }
      })
      .catch(error => {
        console.error("Error al mover el jugador:", error);
        alert("Error al mover el jugador. Revisa la conexión o intenta de nuevo.");
      });
  };
  

  const renderCell = (cellData, rowIndex, colIndex) => {
    const [cellType, cellSubType] = cellData.split('-');
    const cellId = `${cellType}${cellSubType ? '-' + cellSubType : ''}`;
    const imageSrc = imageMap[cellId] || null;

    const isCurrentPlayer = jugadorActual && jugadorActual.posicion.x === rowIndex + 1 && jugadorActual.posicion.y === colIndex + 1;
    const otroJugador = jugadores.find(jugador =>
      jugador.idJugador !== jugadorActual?.idJugador && 
      jugador.posicion.x === rowIndex + 1 && 
      jugador.posicion.y === colIndex + 1
    );

    return (
      <div 
        key={`${rowIndex}-${colIndex}`} 
        className={`cell ${getClass(cellType)} ${isCurrentPlayer ? 'highlight-current' : ''} ${otroJugador ? 'highlight-player' : ''}`}
        style={{ backgroundImage: imageSrc ? `url(${imageSrc})` : 'none' }}
      >
        {isCurrentPlayer && <span className="player-marker">{jugadorActual.Personaje.nombre[0]}</span>}
        {otroJugador && <span className="player-marker">{otroJugador.Personaje.nombre[0]}</span>}
      </div>
    );
  };

  const getClass = (cellType) => {
    switch (cellType) {
      case 'p': return 'pasto';
      case 'c': return 'camino';
      case 'i': return 'punto-interes';
      case 'f': return 'facultad';
      default: return '';
    }
  };


  const toggleInventario = () => {
    setInventarioVisible(!inventarioVisible);
  };



  return (
    <div className="game-container">
      
      {/* Sidebar de Inventario */}
      <div className="inventory-sidebar">
        <h3>Jugador Actual: {jugadorActual?.Personaje?.nombre || "Desconocido"}</h3>
        <h2>INVENTARIO</h2>
        <img src={ChestImage} alt="Cofre" className="chest-image" />
        {jugadorActual && (
          <div>
            <button onClick={toggleInventario}>
              {inventarioVisible ? "Ocultar Inventario" : "Ver Inventario"}
            </button>
          </div>
        )}
        {inventarioVisible && jugadorActual && (
          <div className="inventory">
            <ul>
              {jugadorActual.inventario && jugadorActual.inventario.length > 0 ? (
                jugadorActual.inventario.map((item, index) => (
                  <li key={index}>{item}</li>
                ))
              ) : (
                <li>No hay objetos en el inventario.</li>
              )}
            </ul>
          </div>
        )}
      </div>
  
        <div className="stats-sidebar">
       {/* Contenedor de Jugadores */}
       <div className="players-container">
         <h4>Jugadores en la partida:</h4>
         <ul>
            {jugadores.map((jugador, index) => (
              <li key={jugador.idJugador || index}>
                {jugador.Personaje?.nombre || "Personaje desconocido"}
              </li>
            ))}
          </ul>

          {jugadorActual && (
            <div className="stats-content">
              <h4>Estadísticas Jugador Actual</h4>
              <p><strong>Puntos de Aura:</strong> {jugadorActual.estadisticas.PuntosDeAura}</p>
              <p><strong>Vida:</strong> {jugadorActual.estadisticas.vida}</p>
              <p><strong>Daño:</strong> {jugadorActual.estadisticas.dano}</p>
              <p><strong>Movimientos Restantes:</strong> {movimientosRestantes}</p>
            </div>
          )}
        </div>
      
        {/* Contenedor de Botones de Movimiento en Forma de Cruz */}
        <div className="movement-container">
          <div className="movement-buttons">
            <button onClick={() => moverJugador("up")} className="move-button up">▲</button>
            <div className="horizontal-buttons">
              <button onClick={() => moverJugador("left")} className="move-button left">◀</button>
              <button onClick={() => moverJugador("down")} className="move-button down">▼</button>
              <button onClick={() => moverJugador("right")} className="move-button right">▶</button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor del Tablero */}
      <div className="board-container">
        <div className="board">
          {board.map((row, rowIndex) =>
            row.map((cellData, colIndex) => renderCell(cellData, rowIndex, colIndex))
          )}
        </div>
      </div>
  
      {/* Contenedor de Dado */}
      <div className="dice-container">
        <img src={dadoImage} alt="Dado" className="dice-image" />
        {dadoResultado !== null && (
          <div className="dice-result">
            <h4>¡Te ha salido un: {dadoResultado}!</h4>
          </div>
        )}
        <button onClick={tirarDado}>Tirar</button>
      </div>
    </div>
  );
  
}
export default Board;
