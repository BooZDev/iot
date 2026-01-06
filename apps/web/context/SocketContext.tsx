"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null;
  room: string | null;
  joinRoom: (room: string) => void;
};

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);
  const [room, setRoom] = useState<string | null>(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:5002", {
      transports: ["websocket"],
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const joinRoom = (newRoom: string) => {
    if (!socketRef.current) return;

    if (room === newRoom) return;

    console.log(`🔵 Joining room: ${newRoom}`);
    socketRef.current.emit("joinRoom", newRoom);
    setRoom(newRoom);
  };

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
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
