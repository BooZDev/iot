"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null;
  room: string | null;
  joinRoom: (room: string) => void;
};

const SocketContext = createContext<SocketContextType | null>(null);

let roomCurrent: string | null = null;

const isMongoId = (value: string) =>
  /^[a-f\d]{24}$/i.test(value);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [room, setRoom] = useState<string | null>(null);

  const url = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:5002";

  useEffect(() => {
    const socketInstance = io(url, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketInstance.on("connect", () => {
      if (roomCurrent) {
        socketInstance.emit("joinRoom", roomCurrent);
        setRoom(roomCurrent);
      }
    });

    socketInstance.on("rfidError", (data: { message: string }) => {
    });

    socketInstance.on("alert", (data: {
      reason: string;
      level: 'warning' | 'danger'
    }) => {
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


  const joinRoom = (newRoom: string | undefined) => {
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

    if (!newRoom || !isMongoId(newRoom)) {
      setRoom(null);
      return;
    }

    // Join new room
    if (socket.connected) {
      socket.emit("joinRoom", newRoom);
      roomCurrent = newRoom;
      setRoom(newRoom);
    } else {
      socket.on("connect", () => {
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