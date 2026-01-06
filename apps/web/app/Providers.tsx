"use client";

import { HeroUIProvider } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, ThemeProviderProps } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { SocketProvider, useSocket } from "../context/SocketContext";

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


  return (
    <QueryClientProvider client={queryClient}>
      <HeroUIProvider navigate={router.push} useHref={useHref}>
        <SocketProvider>
          <ThemeProvider {...themeProps}>
            <JoinRoom>
              {children}
            </JoinRoom>
          </ThemeProvider>
        </SocketProvider>
      </HeroUIProvider>
    </QueryClientProvider>
  );
}

interface JoinRoomProps {
  children: React.ReactNode;
}

const JoinRoom = ({ children }: JoinRoomProps) => {
  const { joinRoom } = useSocket();

  const pathName: string | null = usePathname();
  if (pathName) {
    const segments: string[] = pathName.split("/").filter(Boolean);
    const firstSegment: string | undefined = segments[0];
    
    if (firstSegment && isMongoId(firstSegment)) {
      joinRoom(firstSegment);
    }
  }

  return <>{children}</>;
};