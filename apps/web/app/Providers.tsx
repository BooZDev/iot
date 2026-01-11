"use client";

import { HeroUIProvider } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, ThemeProviderProps } from "next-themes";
import { useRouter } from "next/navigation";
import { useSocket } from "../context/SocketContext";
import { use, useEffect } from "react";
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

const isMongoId = (value: string) =>
  /^[a-f\d]{24}$/i.test(value);

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
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <HeroUIProvider navigate={router.push} useHref={useHref}>
        <ThemeProvider {...themeProps}>
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

    if (!warehouseId) return;

    if (!isMongoId(warehouseId)) return;

    const handleJoinRoom = () => {
      joinRoom(warehouseId);
    };

    if (!socket) {
      return;
    }

    // Join room when socket is already connected
    if (socket.connected) {
      handleJoinRoom();
    }

    // Listen for connect event (handles reconnection after refresh)
    socket.on("connect", () => {
      handleJoinRoom();
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

  return <>{children}</>;
};