"use client";

import { useQuery } from "@tanstack/react-query";
import api from "../../../app/api/api";
import { Card } from "@heroui/react";
import Link from "next/link";
import { useSocket } from "../../../context/SocketContext";

export default function Home() {
  const { socket, joinRoom } = useSocket();

  const query = useQuery({
    queryKey: ['warehouses'],
    queryFn: async () => {
      const response = await api.get('/warehouses');
      return response.data;
    }
  })

  return (
    <>
      {query.isLoading && <p>Loading...</p>}
      {query.error && <p>Error loading warehouses.</p>}
      {query.data && (
        <div>
          {
            query.data.map((warehouse: any) => (
              <Card as={Link} href={`/${warehouse._id}`} onClick={() => joinRoom(warehouse._id)} key={warehouse.id} className="mb-4 p-4">
                <h2 className="text-xl font-bold mb-2">{warehouse.name}</h2>
                <p className="text-sm text-muted-foreground">{warehouse.address}</p>
              </Card>
            ))
          }
        </div>
      )}
    </>
  );
}