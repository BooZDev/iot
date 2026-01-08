"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null;
  room: string | null;
  joinRoom: (room: string) => void;
};

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [room, setRoom] = useState<string | null>(null);

  useEffect(() => {
    const socketInstance = io("http://localhost:5002", {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketInstance.on("connect", () => {
    });

    socketInstance.on("disconnect", () => {
    });

    socketInstance.on("connect_error", (error) => {
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [children]);

  const joinRoom = (newRoom: string) => {
    if (!socket) {
      return;
    }

    if (room === newRoom) {
      return;
    }

    // Leave old room if exists
    if (room) {
      socket.emit("leaveRoom", room);
    }

    // Join new room
    if (socket.connected) {
      socket.emit("joinRoom", newRoom);
      setRoom(newRoom);
    } else {
      socket.once("connect", () => {
        socket.emit("joinRoom", newRoom);
        setRoom(newRoom);
      });
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        room,
        joinRoom,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used inside SocketProvider");
  return ctx;
};