/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Tabs,
  Tab,
} from "@heroui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../libs/api";
import InboundTransactionForm from "./components/InboundTransactionForm";
import OutboundTransactionForm from "./components/OutboundTransactionForm";
import TransactionHistory from "./components/TransactionHistory";
import TransactionStatsCards from "./components/TransactionStatsCards";
import useUserStore from "../../stores/UseUserStore";

export enum InventoryTransactionType {
  IN = "IN",
  OUT = "OUT",
}

export enum InventoryTransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface InventoryTransaction {
  _id: string;
  productId: string;
  warehouseId: string;
  transactionType: InventoryTransactionType;
  quantity: number;
  operatorId: string;
  status: InventoryTransactionStatus;
  rfidTagId: string;
  requestTime: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export default function InventoryTransactionsPage() {
  const [selectedTab, setSelectedTab] = useState("inbound");
  const queryClient = useQueryClient();

  // Fetch products with READY_IN state
  const { data: readyInProducts = [] } = useQuery({
    queryKey: ["products-ready-in"],
    queryFn: async () => {
      const response = await api.get("/products/flow-state/READY_IN");
      return response.data;
    },
  });

  // Fetch products with READY_OUT state
  const { data: readyOutProducts = [] } = useQuery({
    queryKey: ["products-ready-out"],
    queryFn: async () => {
      const response = await api.get("/products/flow-state/READY_OUT");
      return response.data;
    },
  });

  // Fetch all products
  const { data: allProducts = [] } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await api.get("/products");
      return response.data;
    },
  });

  // Fetch warehouses
  const { data: warehouses = [] } = useQuery({
    queryKey: ["warehouses"],
    queryFn: async () => {
      const response = await api.get("/warehouses");
      return response.data;
    },
  });

  // Fetch outbound schedules
  const { data: schedules = [] } = useQuery({
    queryKey: ["outbound-schedules"],
    queryFn: async () => {
      const response = await api.get("/outbound-schedule");
      return response.data;
    },
  });

  // Fetch devices (RFID readers)
  const { data: devices = [] } = useQuery({
    queryKey: ["devices"],
    queryFn: async () => {
      const response = await api.get("/devices");
      return response.data;
    },
  });

  // Fetch all transactions for history
  const { data: allTransactions = [], isLoading: transactionsLoading } =
    useQuery({
      queryKey: ["all-transactions"],
      queryFn: async () => {
        // Get transactions from all warehouses
        const transactionsPromises = warehouses.map(async (warehouse: any) => {
          try {
            const [inbound, outbound] = await Promise.all([
              api.get(`/inventories/in/${warehouse._id}`),
              api.get(`/inventories/out/${warehouse._id}`),
            ]);
            return [
              ...inbound.data.map((t: any) => ({
                ...t,
                transactionType: "IN",
              })),
              ...outbound.data.map((t: any) => ({
                ...t,
                transactionType: "OUT",
              })),
            ];
          } catch {
            return [];
          }
        });
        const results = await Promise.all(transactionsPromises);
        return results.flat();
      },
      enabled: warehouses.length > 0,
    });

  const { user } = useUserStore()
  const currentUserId = user?.id || "";

  console.log("Current User ID:", currentUserId);

  // Create inbound transaction mutation
  const createInboundMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/inventories/in/request", {
        ...data,
        operatorId: currentUserId,
        requestTime: new Date().toISOString(),
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products-ready-in"] });
      queryClient.invalidateQueries({ queryKey: ["all-transactions"] });
    },
  });

  // Create outbound transaction mutation
  const createOutboundMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/inventories/out/request", {
        ...data,
        operatorId: currentUserId,
        requestTime: new Date().toISOString(),
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products-ready-out"] });
      queryClient.invalidateQueries({ queryKey: ["all-transactions"] });
    },
  });

  const handleInboundSubmit = async (data: any) => {
    await createInboundMutation.mutateAsync(data);
  };

  const handleOutboundSubmit = async (data: any) => {
    await createOutboundMutation.mutateAsync(data);
  };

  // Calculate statistics
  const stats = {
    totalInbound: allTransactions.filter((t: any) => t.transactionType === "IN")
      .length,
    totalOutbound: allTransactions.filter(
      (t: any) => t.transactionType === "OUT"
    ).length,
    readyInProducts: readyInProducts.length,
    readyOutProducts: readyOutProducts.length,
    totalTransactions: allTransactions.length,
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          📦 Nhập/Xuất kho
        </h1>
        <p className="text-default-500 mt-1">
          Quản lý giao dịch nhập và xuất sản phẩm khỏi kho
        </p>
      </div>

      {/* Statistics */}
      <TransactionStatsCards stats={stats} />

      {/* Main Content */}
      <Card className="border border-divider">
        <CardHeader className="border-b border-divider">
          <Tabs
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as string)}
            variant="underlined"
            size="lg"
            fullWidth
          >
            <Tab
              key="inbound"
              title={
                <div className="flex items-center gap-2">
                  <span>📥</span>
                  <span>Nhập kho</span>
                </div>
              }
            />
            <Tab
              key="outbound"
              title={
                <div className="flex items-center gap-2">
                  <span>📤</span>
                  <span>Xuất kho</span>
                </div>
              }
            />
            <Tab
              key="history"
              title={
                <div className="flex items-center gap-2">
                  <span>📋</span>
                  <span>Lịch sử giao dịch</span>
                </div>
              }
            />
          </Tabs>
        </CardHeader>
        <CardBody className="p-6">
          {selectedTab === "inbound" && (
            <InboundTransactionForm
              products={readyInProducts}
              warehouses={warehouses}
              devices={devices}
              onSubmit={handleInboundSubmit}
              isLoading={createInboundMutation.isPending}
            />
          )}

          {selectedTab === "outbound" && (
            <OutboundTransactionForm
              products={readyOutProducts}
              warehouses={warehouses}
              devices={devices}
              schedules={schedules}
              onSubmit={handleOutboundSubmit}
              isLoading={createOutboundMutation.isPending}
            />
          )}

          {selectedTab === "history" && (
            <TransactionHistory
              transactions={allTransactions}
              products={allProducts}
              warehouses={warehouses}
              isLoading={transactionsLoading}
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
}