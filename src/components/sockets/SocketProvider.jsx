import { useEffect, useRef } from "react";
import { SocketContext } from "./SocketContext";
import io from "socket.io-client";
import { SOCKET_URL } from "../config";

const SocketProvider = ({ children }) => {
    const socket = useRef();

    const connectSocket = (userId) => {
        const storedUserId = userId || getUserIdFromSession();
        if (storedUserId) {
            // Inicializar el socket con opciones de reconexión
            socket.current = io(`${SOCKET_URL}`, {
                reconnection: true,
                reconnectionAttempts: 10,
                reconnectionDelay: 1000,
            });

            // Registrar el usuario en el servidor
            socket.current.emit("addUser", Number(storedUserId));
        }
    };

    const disconnectSocket = () => {
        if (socket.current) {
            socket.current.disconnect();
            socket.current = null;
        }
    };

    const getUserIdFromSession = () => {
        const storedUserData = JSON.parse(sessionStorage.getItem("userData"));
        return storedUserData ? storedUserData.id : null;
    };

    useEffect(() => {
        const storedUserId = getUserIdFromSession();
        if (storedUserId) {
            connectSocket(storedUserId);
        }

        const handleReconnect = () => {
            const reconnectedUserId = getUserIdFromSession();
            if (reconnectedUserId && socket.current) {
                // Volver a registrar el usuario al reconectar
                socket.current.emit("addUser", Number(reconnectedUserId));
            }
        };

        if (socket.current) {
            socket.current.on("connect", handleReconnect);
        }

        return () => {
            if (socket.current) {
                socket.current.off("connect", handleReconnect);
                disconnectSocket();
            }
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, connectSocket, disconnectSocket }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
