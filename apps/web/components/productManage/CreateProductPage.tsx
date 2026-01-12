"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Tabs,
  Tab,
  useDisclosure,
} from "@heroui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../libs/api";
import CreateProductForm from "./components/CreateProductForm";
import ScheduleOutboundForm from "./components/ScheduleOutboundForm";
import OutboundSchedulesList from "./components/OutboundSchedulesList";
import UpdateProductStateForm from "./components/UpdateProductStateForm";
import DeleteConfirmModal from "../user/components/DeleteConfirmModal";
import useUserStore from "../../stores/UseUserStore";

export interface Product {
  _id: string;
  skuCode: string;
  name: string;
  productTypeId: string;
  flowState: string;
  createdBy: string;
}

export interface OutboundSchedule {
  _id: string;
  productId: string;
  warehouseId: string;
  startAt: Date;
  endAt: Date;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default function CreateProductPage() {
  const [selectedTab, setSelectedTab] = useState("create-product");
  const [deletingSchedule, setDeletingSchedule] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const queryClient = useQueryClient();

  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  // Fetch products in warehouses (for scheduling)
  const { data: inventoryItems = [] } = useQuery({
    queryKey: ["inventory-items"],
    queryFn: async () => {
      // Get all warehouses
      const warehousesRes = await api.get("/warehouses");
      const warehouses = warehousesRes.data;

      // Get inventory for each warehouse
      const allInventory = await Promise.all(
        warehouses.map(async (warehouse: any) => {
          try {
            const response = await api.get(
              `/inventories/items/warehouse/${warehouse._id}`
            );
            return response.data.map((item: any) => ({
              ...item,
              warehouseName: warehouse.name,
            }));
          } catch (error) {
            return [];
          }
        })
      );

      return allInventory.flat();
    },
  });

  // Fetch outbound schedules
  const { data: schedules = [], isLoading: schedulesLoading } = useQuery({
    queryKey: ["outbound-schedules"],
    queryFn: async () => {
      const response = await api.get("/outbound-schedule");
      return response.data as OutboundSchedule[];
    },
  });

  // Fetch products
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await api.get("/products");
      return response.data as Product[];
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

  // Fetch product types
  const { data: productTypes = [] } = useQuery({
    queryKey: ["product-types"],
    queryFn: async () => {
      const response = await api.get("/product-types");
      return response.data;
    },
  });

  const { user } = useUserStore()
  const currentUserId = user.id; // Replace with actual user ID from auth

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/products", {
        ...data,
        createdBy: currentUserId,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  // Create product type mutation
  const createProductTypeMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/product-types", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-types"] });
    },
  });

  // Create outbound schedule mutation
  const createScheduleMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/outbound-schedule", {
        ...data,
        createdBy: currentUserId,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outbound-schedules"] });
    },
  });

  // Delete schedule mutation
  const deleteScheduleMutation = useMutation({
    mutationFn: async (scheduleId: string) => {
      await api.delete(`/outbound-schedule/${scheduleId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outbound-schedules"] });
      onDeleteModalClose();
      setDeletingSchedule(null);
    },
  });

  // Update product state mutation
  const updateProductStateMutation = useMutation({
    mutationFn: async (data: { productId: string; flowState: string }) => {
      const response = await api.patch(`/products/${data.productId}`, {
        flowState: data.flowState,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const handleCreateProduct = async (data: any) => {
    await createProductMutation.mutateAsync(data);
  };

  const handleCreateProductType = async (data: any) => {
    return await createProductTypeMutation.mutateAsync(data);
  };

  const handleCreateSchedule = async (data: any) => {
    await createScheduleMutation.mutateAsync(data);
  };

  const handleDeleteSchedule = (schedule: OutboundSchedule) => {
    const product = products.find((p) => p._id === schedule.productId);
    setDeletingSchedule({
      id: schedule._id,
      name: product?.name || "Lịch xuất kho",
    });
    onDeleteModalOpen();
  };

  const handleConfirmDelete = () => {
    if (deletingSchedule) {
      deleteScheduleMutation.mutate(deletingSchedule.id);
    }
  };

  const handleUpdateProductState = async (data: {
    productId: string;
    flowState: string;
  }) => {
    await updateProductStateMutation.mutateAsync(data);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          ➕ Tạo mới & Quản lý
        </h1>
        <p className="text-default-500 mt-1">
          Tạo sản phẩm, loại sản phẩm, lập lịch xuất kho và cập nhật trạng thái
        </p>
      </div>

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
              key="create-product"
              title={
                <div className="flex items-center gap-2">
                  <span>📦</span>
                  <span>Tạo sản phẩm</span>
                </div>
              }
            />
            <Tab
              key="update-state"
              title={
                <div className="flex items-center gap-2">
                  <span>🔄</span>
                  <span>Cập nhật trạng thái</span>
                </div>
              }
            />
            <Tab
              key="schedule-outbound"
              title={
                <div className="flex items-center gap-2">
                  <span>📅</span>
                  <span>Lập lịch xuất kho</span>
                </div>
              }
            />
            <Tab
              key="view-schedules"
              title={
                <div className="flex items-center gap-2">
                  <span>📋</span>
                  <span>Danh sách lịch xuất</span>
                </div>
              }
            />
          </Tabs>
        </CardHeader>
        <CardBody className="p-6">
          {selectedTab === "create-product" && (
            <CreateProductForm
              productTypes={productTypes}
              onSubmit={handleCreateProduct}
              onCreateProductType={handleCreateProductType}
              isLoading={createProductMutation.isPending}
              isCreatingType={createProductTypeMutation.isPending}
            />
          )}

          {selectedTab === "update-state" && (
            <UpdateProductStateForm
              products={products}
              inventoryItems={inventoryItems}
              onSubmit={handleUpdateProductState}
              isLoading={updateProductStateMutation.isPending}
            />
          )}

          {selectedTab === "schedule-outbound" && (
            <ScheduleOutboundForm
              inventoryItems={inventoryItems}
              products={products}
              warehouses={warehouses}
              onSubmit={handleCreateSchedule}
              isLoading={createScheduleMutation.isPending}
            />
          )}

          {selectedTab === "view-schedules" && (
            <OutboundSchedulesList
              schedules={schedules}
              products={products}
              warehouses={warehouses}
              isLoading={schedulesLoading}
              onDelete={handleDeleteSchedule}
            />
          )}
        </CardBody>
      </Card>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        itemName={deletingSchedule?.name || ""}
        itemType="lịch xuất kho"
        onConfirm={handleConfirmDelete}
        isLoading={deleteScheduleMutation.isPending}
      />
    </div>
  );
}