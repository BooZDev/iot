"use client";

import { useState } from "react";
import Navbar from "../../components/navbar.Navbar"
import Sidebar from "../../components/sidebar/Sidebar"

export default function Pagelayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar onMenuToggle={() => { toggleSidebar }} />
        <main className="flex flex-1 overflow-auto p-4 justify-center">
          <div className="container">
            {children}
          </div>
        </main>
      </div >
    </div >
  )
}