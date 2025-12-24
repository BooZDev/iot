import "@repo/ui/styles.css";
import "../public/styles/globals.css";
import type { Metadata } from "next";
import Providers from "./Providers";

export const metadata: Metadata = {
  title: "Project 1 - Web",
  description: "Web application for Project 1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
