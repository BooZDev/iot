import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar";
import { SocketProvider } from "../../context/SocketContext";

export default function Pagelayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="flex min-h-screen bg-background">
      <SocketProvider>
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Navbar />
          <main className="flex flex-1 overflow-auto p-4 justify-center">
            <div className="container">
              {children}
            </div>
          </main>
        </div >
      </SocketProvider>
    </div >
  )
}