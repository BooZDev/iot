"use client";

import { HeroUIProvider } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, ThemeProviderProps } from "next-themes";
import { useRouter } from "next/navigation";

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

  return (
    <QueryClientProvider client={queryClient}>
      <HeroUIProvider navigate={router.push} useHref={useHref}>
        <ThemeProvider {...themeProps}>{children}</ThemeProvider>
      </HeroUIProvider>
    </QueryClientProvider>
  );
}