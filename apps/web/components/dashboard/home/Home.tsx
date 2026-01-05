"use client";

import { useQuery } from "@tanstack/react-query";
import api from "../../../app/api/api";

export default function Home() {
  const query = useQuery({
    queryKey: ['warehouses'],
    queryFn: async () => {
      const response = await api.get('/warehouses');
      return response.data;
    }
  })

  return (
    <></>
  )
}