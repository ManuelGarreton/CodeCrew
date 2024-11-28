import { useEffect, useState, useRef } from "react";
import { SocketContext } from "./SocketContext";
import io from "socket.io-client";
import { SOCKET_URL } from "../config";

const SocketProvider = ({ children }) => {
    const socket = useRef();

    const connectSocket = (userId) => {
        const storedUserId = userId || (userData ? userData.id : localStorage.getItem("userData"));
        if (storedUserId) {
            socket.current = io(`${SOCKET_URL}`, {
                reconnection: true,
                reconnectionAttempts: 10,
                reconnectionDelay: 1000
            });

            socket.current.emit("addUser", Number(storedUserId));
        }
    };

    const disconnectSocket = () => {
        socket.current?.disconnect();
    };

    useEffect(() => {
        const storedUserData = JSON.parse(localStorage.getItem("userData"));
        const storedUserId = storedUserData ? storedUserData.id : null;

        if (storedUserId) connectSocket(storedUserId);
    }, []);

    return (
        <SocketContext.Provider value={{socket, connectSocket, disconnectSocket }}>
            {children}
        </SocketContext.Provider>
    );
};


export default SocketProvider; 