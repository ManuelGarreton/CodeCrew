import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../auth/authContext';
import axios from 'axios';
import { API_URL } from '../config';
import { SocketContext } from '../sockets/SocketContext';
import '../../assets/styles/game/WaitingRoom.css';


import ValeryHuskovic from '../../../public/images/personajes/ValeryHuskovic.png';
import KingGeorge from '../../../public/images/personajes/KingGeorge.png';
import HernyCobrera from '../../../public/images/personajes/HernyCobrera.png';
import TristianLuz from '../../../public/images/personajes/TristianLuz.png';

const WaitingRoom = () => {
    const { idGame } = useParams();
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [characterAssignments, setCharacterAssignments] = useState({});
    const [isModerator, setIsModerator] = useState(false);
    const [players, setPlayers] = useState([]);
    const [waitingRoomData, setWaitingRoomData] = useState(null); // Nuevo estado
    const { socket } = useContext(SocketContext);
    const { userData } = useContext(AuthContext);
    const navigate = useNavigate();

    const characters = [
        { id: 1, name: "Herny Cobrera", imgSrc: HernyCobrera },
        { id: 2, name: "King George Moñoz", imgSrc: KingGeorge },
        { id: 3, name: "Tristian Luz", imgSrc: TristianLuz  },
        { id: 4,name: "Valery Huskovic", imgSrc: ValeryHuskovic },
    ];

    useEffect(() => {
        axios.get(`${API_URL}/waiting_room/${idGame}`)
            .then((response) => {
                const salaEspera = response.data;
                console.log("Datos de la sala de espera:", salaEspera); // Depuración de datos recibidos
                setWaitingRoomData(salaEspera); // Almacenar la respuesta en el nuevo estado
                if (salaEspera.Jugadores && salaEspera.Jugadores.length > 0) {
                    console.log("moderador:", userData.id)
                    setPlayers(salaEspera.Jugadores);
                    setIsModerator(salaEspera.Jugadores[0].idUsuario === userData.id);
                }
            })
            .catch((error) => {
                console.error("Error al verificar el moderador:", error);
            });
    }, []); //idGame, userData.id

    useEffect(() => {
        if (!idGame || !socket.current) return;

        socket.current.emit("joinRoom", `sala-${idGame}`);

        const handlePlayerUpdate = (data) => {
            if (data.idGame === parseInt(idGame, 10) && Array.isArray(data.players)) {
                console.log("Datos de jugadores recibidos:", data.players); // Depuración de datos recibidos
                setPlayers(data.players.map(player => ({ idUsuario: player.idUsuario, username: player.username })));
            } else {
                console.warn("Formato de datos inesperado:", data);
            }
        };
        
        const handleCharacterAssignmentsUpdate = (assignments) => {
            setCharacterAssignments(assignments);
        };

        socket.current.on("playerUpdated", handlePlayerUpdate);
        socket.current.on("characterAssignments", handleCharacterAssignmentsUpdate);

        return () => {
            socket.current.emit("leaveRoom", `sala-${idGame}`);
            socket.current.off("playerUpdated", handlePlayerUpdate);
            socket.current.off("characterAssignments", handleCharacterAssignmentsUpdate);
        };
    }, [socket.current]);

    useEffect(() => {
        if (!socket.current) {
            console.warn("Socket no inicializado");
            return;
        }
    
        const handleStartGame = (data) => {
            console.log("Iniciando partida:", data.idGame);
            navigate(`/board/${idGame}`);
        };
    
        console.log("Registrando listener para 'startGame'");
        socket.current.on("startPlayer", handleStartGame);
    
        return () => {
            console.log("Desmontando listener para 'startGame'");
            socket.current.off("startPlayer", handleStartGame);
        };
    }, [socket.current]);
    
    

    const handleCharacterSelect = (characterId) => {
        const currentAssignment = characterAssignments[characterId];

        if (currentAssignment && currentAssignment.idUser === userData.id) {
            setSelectedCharacter(null);
            socket.current.emit("deselectCharacter", { idUser: userData.id, characterId, idGame });
            axios.post(`${API_URL}/waiting-room/deselect-character`, {
                idUser: userData.id,
                idGame: idGame,
                characterId: characterId,
            }).catch(error => console.error("Error al deseleccionar el personaje:", error));
        }
        else {
            if (selectedCharacter !== null) {
                socket.current.emit("deselectCharacter", { idUser: userData.id, characterId: selectedCharacter, idGame });
                axios.post(`${API_URL}/waiting-room/deselect-character`, {
                    idUser: userData.id,
                    idGame: idGame,
                    characterId: selectedCharacter,
                }).catch(error => console.error("Error al deseleccionar el personaje anterior:", error));
            }

            setSelectedCharacter(characterId);
            socket.current.emit("selectCharacter", { idUser: userData.id, characterId, idGame, username: userData.username });
            axios.post(`${API_URL}/waiting-room/select-character`, {
                idUser: userData.id,
                idGame: idGame,
                characterId: characterId,
                username: userData.username,
            }).catch(error => console.error("Error al seleccionar el personaje:", error));
        }
    };

    const startGame = async () => {
        if (!isModerator) return;
    
        if (Object.keys(characterAssignments).length !== players.length) {
            alert("Todos los jugadores deben seleccionar un personaje antes de iniciar la partida.");
            return;
        }
    
        let moderadorId = null; // Para guardar el ID del moderador
        const jugadores = []; // Lista para enviar al backend
    
        await Promise.all(
            Object.entries(characterAssignments).map(async ([personaje, userInfo]) => {
                const userId = userInfo.idUser;
    
                try {
                    // Crear el jugador en la base de datos
                    const response = await axios.post(`${API_URL}/players/create`, {
                        idUsuario: userId,
                        idPersonaje: personaje,
                        idPartida: idGame,
                    });
    
                    const jugador = response.data.data_jugador;
    
                    if (!jugador) {
                        alert("Error al crear el jugador.");
                        return;
                    }
    
                    console.log("Jugador creado:", jugador.id);
    
                    // Actualizar el jugador como moderador si aplica
                    if (waitingRoomData && userId === waitingRoomData.Jugadores[0].idUsuario) {
                        moderadorId = jugador.id;
    
                        await axios.patch(`${API_URL}/players/edit/${moderadorId}`, {
                            idPartida: idGame,
                            idPersonaje: personaje,
                            PuntosDeAura: 0,
                            inventario: [],
                            moderador: true,
                        });
                        console.log("Moderador asignado:", moderadorId);
                    }
    
                    // Agregar datos del jugador a la lista
                    jugadores.push({
                        idJugador: jugador.id,
                        idUsuario: userId,
                        personaje,
                        posicion: { x: 6, y: 15 }, // Posición inicial
                        inventario: [], // Inventario inicial vacío
                    });
                } catch (error) {
                    console.error("Error al crear el jugador:", error);
                }
            })
        );
    
        if (moderadorId) {
            try {
                // Asociar la partida con los jugadores
                await axios.post(`${API_URL}/matches/join`, { idGame });
    
                // Crear el tablero en la base de datos con los jugadores
                await axios.post(`${API_URL}/board/create`, {
                    idGame,
                    jugadores, // Enviar la lista completa de jugadores al backend
                });
                
                
                // Iniciar la partida
                const response = await axios.post(`${API_URL}/matches/start`, { idGame, idPlayer: moderadorId });
                console.log(response.data.message);
    
                // Emitir evento al socket
                console.log(socket.current.connected);
                socket.current.emit("startGameForUsers", { idGame, jugadores, socketId: socket.current.id });
                console.log("Partida iniciada con jugadores:", jugadores);
            }
            catch (error) {
                console.error("Error al iniciar la partida:", error);
            }
        } else {
            console.error("No se pudo obtener el ID del jugador para iniciar la partida.");
        }
    };
    
    
    const leaveGame = () => {
        if (selectedCharacter !== null) {
            socket.current.emit("deselectCharacter", { idUser: userData.id, characterId: selectedCharacter, idGame });
            axios.post(`${API_URL}/waiting_room/leave`, {
                idUser: userData.id,
                idGame: idGame,
                characterId: selectedCharacter,
            }).catch(error => console.error("Error al deseleccionar el personaje al salir:", error));
        }

        axios.put(`${API_URL}/waiting_room/leave`, { idUser: userData.id, idGame: idGame })
            .then(() => {
                window.location.href = "/seleccionar-partida";
            })
            .catch(error => {
                console.error("Error al salir de la partida:", error);
            });
    };

    return (
        <div className="personajes">
            <h2>¡Escoge tu personaje, {userData.username}!</h2>
            <div className="wrapper">
                {characters.map(character => (
                    <div
                        key={character.id}
                        className={`personaje-card ${characterAssignments[character.id] ? 'taken' : ''}`}
                        onClick={() => handleCharacterSelect(character.id)}
                    >
                        <img src={character.imgSrc} alt={character.name} />
                        <h2>{character.name}</h2>
                        <div className={`select-circle ${selectedCharacter === character.id || characterAssignments[character.id] ? 'selected' : ''}`} />
                        {characterAssignments[character.id] && (
                            <p className="character-name">
                                {characterAssignments[character.id].username}
                            </p>
                        )}
                    </div>
                ))}
            </div>
            <div className="players-list">
                <h3>Jugadores en la sala de espera:</h3>
                <ul>
                    {players.map((player, index) => (
                        <li key={index}>{player.username || player.idUsuario || "ID no disponible"}</li>
                    ))}
                </ul>
            </div>
            <div className="character-assignments-list">
                <h3>Asignaciones de personajes:</h3>
                <ul>
                    {Object.entries(characterAssignments).map(([characterId, { username }]) => (
                        <li key={characterId}>El usuario "{username}" ha escogido a "{characters.find(c => c.id === parseInt(characterId))?.name}"</li>
                    ))}
                </ul>
            </div>
            <div className="buttons-container">
                <button className="leave-game-btn" onClick={leaveGame}>
                    Salir de la Partida
                </button>
                {isModerator && (
                    <button className="start-game-btn" onClick={startGame}>
                        Iniciar Partida
                    </button>
                )}
            </div>
        </div>
    );
};

export default WaitingRoom;
