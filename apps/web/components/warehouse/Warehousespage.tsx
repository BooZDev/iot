"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  useDisclosure,
  Tabs,
  Tab,
} from "@heroui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import WarehouseGrid from "./components/WarehouseGrid";
import WarehouseTable from "./components/WarehouseTable";
import WarehouseFormModal from "./components/WarehouseFormModal";
import WarehouseDetailModal from "./components/WarehouseDetailModal";
import WarehouseStatsCards from "./components/WarehouseStatsCards";
import api from "../../libs/api";
import DeleteConfirmModal from "../user/components/DeleteConfirmModal";

export interface Warehouse {
  _id: string;
  warehouseCode: string;
  name: string;
  type: string;
  locations?: number[][]; // Array of [longitude, latitude] coordinates
  address: string;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export default function WarehousesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("grid");
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(
    null
  );
  const [viewingWarehouse, setViewingWarehouse] = useState<Warehouse | null>(
    null
  );
  const [deletingWarehouse, setDeletingWarehouse] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const queryClient = useQueryClient();

  // Modals
  const {
    isOpen: isFormModalOpen,
    onOpen: onFormModalOpen,
    onClose: onFormModalClose,
  } = useDisclosure();

  const {
    isOpen: isDetailModalOpen,
    onOpen: onDetailModalOpen,
    onClose: onDetailModalClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  // Fetch all warehouses
  const { data: warehouses = [], isLoading } = useQuery({
    queryKey: ["warehouses"],
    queryFn: async () => {
      const response = await api.get("/warehouses");
      return response.data as Warehouse[];
    },
  });

  // Create warehouse mutation
  const createWarehouseMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/warehouses", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      onFormModalClose();
      setEditingWarehouse(null);
    },
  });

  // Update warehouse mutation
  const updateWarehouseMutation = useMutation({
    mutationFn: async (data: { warehouseId: string; updates: any }) => {
      const response = await api.patch(
        `/warehouses/${data.warehouseId}`,
        data.updates
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      onFormModalClose();
      onDetailModalClose();
      setEditingWarehouse(null);
    },
  });

  // Delete warehouse mutation
  const deleteWarehouseMutation = useMutation({
    mutationFn: async (warehouseId: string) => {
      await api.delete(`/warehouses/${warehouseId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      onDeleteModalClose();
      setDeletingWarehouse(null);
    },
  });

  // Handlers
  const handleAddWarehouse = () => {
    setEditingWarehouse(null);
    onFormModalOpen();
  };

  const handleEditWarehouse = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
    onFormModalOpen();
  };

  const handleViewWarehouse = (warehouse: Warehouse) => {
    setViewingWarehouse(warehouse);
    onDetailModalOpen();
  };

  const handleDeleteWarehouse = (warehouse: Warehouse) => {
    setDeletingWarehouse({
      id: warehouse._id,
      name: warehouse.name,
    });
    onDeleteModalOpen();
  };

  const handleSaveWarehouse = (data: any) => {
    if (editingWarehouse) {
      updateWarehouseMutation.mutate({
        warehouseId: editingWarehouse._id,
        updates: data,
      });
    } else {
      createWarehouseMutation.mutate(data);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingWarehouse) {
      deleteWarehouseMutation.mutate(deletingWarehouse.id);
    }
  };

  // Filter warehouses
  const filteredWarehouses = warehouses.filter(
    (warehouse) =>
      warehouse.warehouseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      warehouse.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      warehouse.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      warehouse.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate statistics
  const stats = {
    total: warehouses.length,
    withLocations: warehouses.filter(
      (w) => w.locations && w.locations.length > 0
    ).length,
    withoutLocations: warehouses.filter(
      (w) => !w.locations || w.locations.length === 0
    ).length,
    active: warehouses.filter((w) => w.isActive !== false).length,
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            🏭 Quản lý nhà kho
          </h1>
          <p className="text-default-500 mt-1">
            Quản lý thông tin nhà kho - Cập nhật tọa độ tại trang Bản đồ
          </p>
        </div>
        <Button
          color="primary"
          size="lg"
          onPress={handleAddWarehouse}
          className="font-semibold"
        >
          ➕ Thêm nhà kho mới
        </Button>
      </div>

      {/* Statistics */}
      <WarehouseStatsCards stats={stats} />

      {/* Main Content */}
      <Card className="border border-divider">
        <CardHeader className="flex flex-col items-start gap-3 pb-0">
          <div className="flex w-full justify-between items-center">
            <Tabs
              selectedKey={viewMode}
              onSelectionChange={(key) => setViewMode(key as "table" | "grid")}
              variant="underlined"
              size="lg"
            >
              <Tab
                key="grid"
                title={
                  <div className="flex items-center gap-2">
                    <span>🎴</span>
                    <span>Lưới</span>
                  </div>
                }
              />
              <Tab
                key="table"
                title={
                  <div className="flex items-center gap-2">
                    <span>📋</span>
                    <span>Bảng</span>
                  </div>
                }
              />
            </Tabs>

            <Input
              placeholder="Tìm kiếm nhà kho..."
              startContent={<span>🔍</span>}
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="w-80"
              size="sm"
            />
          </div>
        </CardHeader>
        <CardBody>
          {viewMode === "table" ? (
            <WarehouseTable
              warehouses={filteredWarehouses}
              isLoading={isLoading}
              onView={handleViewWarehouse}
              onEdit={handleEditWarehouse}
              onDelete={handleDeleteWarehouse}
            />
          ) : (
            <WarehouseGrid
              warehouses={filteredWarehouses}
              isLoading={isLoading}
              onView={handleViewWarehouse}
              onEdit={handleEditWarehouse}
              onDelete={handleDeleteWarehouse}
            />
          )}
        </CardBody>
      </Card>

      {/* Warehouse Form Modal */}
      <WarehouseFormModal
        isOpen={isFormModalOpen}
        onClose={onFormModalClose}
        warehouse={editingWarehouse}
        onSave={handleSaveWarehouse}
        isLoading={
          createWarehouseMutation.isPending ||
          updateWarehouseMutation.isPending
        }
      />

      {/* Warehouse Detail Modal */}
      <WarehouseDetailModal
        isOpen={isDetailModalOpen}
        onClose={onDetailModalClose}
        warehouse={viewingWarehouse}
        onEdit={() => {
          onDetailModalClose();
          if (viewingWarehouse) {
            handleEditWarehouse(viewingWarehouse);
          }
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        itemName={deletingWarehouse?.name || ""}
        itemType="nhà kho"
        onConfirm={handleConfirmDelete}
        isLoading={deleteWarehouseMutation.isPending}
      />
    </div>
  );
}