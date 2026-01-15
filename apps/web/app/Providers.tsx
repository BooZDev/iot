"use client";

import { addToast, HeroUIProvider, ToastProvider } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, ThemeProviderProps } from "next-themes";
import { useRouter } from "next/navigation";
import { useSocket } from "../context/SocketContext";
import { useEffect } from "react";
import { getSession } from "../libs/session";
import useUserStore from "../stores/UseUserStore";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

const queryClient = new QueryClient()

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export default function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();
  const useHref = (href: string) => href;
  const { setUser } = useUserStore();

  useEffect(() => {
    async function fetchSession() {
      const session = await getSession();
      if (session && session.user) {
        setUser({ id: session.user.id });
      }
    }
    fetchSession();
  }, [setUser]);

  const { joinRoom, socket } = useSocket();

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on("connect", () => {
    });

    socket.on("rfidError", (data: { message: string }) => {
      addToast({
        title: "Lỗi RFID",
        description: data.message,
        timeout: 5000,
        color: "danger",
      });
    });

    socket.on("alert", (data: {
      reason: string;
      level: 'warning' | 'danger'
    }) => {
      addToast({
        title: "Thông báo",
        description: data.reason,
        timeout: 5000,
        color: data.level === 'warning' ? 'warning' : 'danger',
      });
    });

    // Optional: Handle disconnect
    socket.on("disconnect", () => {
    });

    // Cleanup
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [socket, joinRoom]);

  return (
    <QueryClientProvider client={queryClient}>
      <HeroUIProvider navigate={router.push} useHref={useHref}>
        <ThemeProvider {...themeProps}>
          <ToastProvider placement="top-right" toastOffset={40} />
          {children}
        </ThemeProvider>
      </HeroUIProvider>
    </QueryClientProvider>
  );
}

interface JoinRoomProps {
  children: React.ReactNode;
  warehouseId?: string;
}

export const JoinRoom = ({ children, warehouseId }: JoinRoomProps) => {
  const { joinRoom, socket } = useSocket();

  useEffect(() => {
    const handleJoinRoom = () => {
      joinRoom(warehouseId as string);
    };

    if (!socket) {
      return;
    }

    // Join room when socket is already connected
    if (socket.connected) {
      handleJoinRoom();
    } else {
      socket.connect();
    }

    // Listen for connect event (handles reconnection after refresh)
    socket.on("connect", () => {
      handleJoinRoom();
    });

    socket.on("rfidError", (data: { message: string }) => {
      addToast({
        title: "Lỗi RFID",
        description: data.message,
        timeout: 5000,
        color: "danger",
      });
    });

    socket.on("alert", (data: {
      reason: string;
      level: 'warning' | 'danger'
    }) => {
      addToast({
        title: "Thông báo",
        description: data.reason,
        timeout: 5000,
        color: data.level === 'warning' ? 'warning' : 'danger',
      });
    });

    // Optional: Handle disconnect
    socket.on("disconnect", () => {
    });

    // Cleanup
    return () => {
      socket.off("connect", handleJoinRoom);
      socket.off("disconnect");
    };
  }, [socket, warehouseId, joinRoom]);

  return (
    <div className="relative">
      {children}
    </div>
  )
};