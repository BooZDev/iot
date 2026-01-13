/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Tabs,
  Tab,
  Chip,
} from "@heroui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import WarehouseBoundsEditor from "./components/WarehouseBoundsEditor";
import api from "../../libs/api";

interface Warehouse {
  _id: string;
  name: string;
  type: string;
  locations?: number[][];
  address: string;
  description?: string;
  isActive?: boolean;
}

interface WarehouseDeviceMapProps {
  warehouseId?: string;
}

export default function WarehouseDeviceMap({
  warehouseId,
}: WarehouseDeviceMapProps) {
  const [selectedTab, setSelectedTab] = useState<string>("warehouses");
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(
    warehouseId || null
  );
  const [mapRef, setMapRef] = useState<L.Map | null>(null);

  const queryClient = useQueryClient();

  // Fetch all warehouses
  const { data: warehouses = [] } = useQuery({
    queryKey: ["warehouses"],
    queryFn: async () => {
      const response = await api.get("/warehouses");
      return response.data as Warehouse[];
    },
  });

  // Fetch devices for selected warehouse
  const { data: devices = [] } = useQuery({
    queryKey: ["devices", selectedWarehouse],
    queryFn: async () => {
      if (!selectedWarehouse) return [];
      const response = await api.get(`/warehouses/${selectedWarehouse}/devices`);
      return response.data;
    },
    enabled: !!selectedWarehouse,
  });

  // Update warehouse locations mutation
  const updateLocationsMutation = useMutation({
    mutationFn: async (data: { warehouseId: string; locations: number[][] }) => {
      const response = await api.patch(`/warehouses/${data.warehouseId}`, {
        locations: data.locations,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
    },
  });

  // Initialize map
  useEffect(() => {
    if (!mapRef) {
      const map = L.map("warehouse-map").setView([21.0285, 105.8542], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      setMapRef(map);

      return () => {
        map.remove();
      };
    }
  }, []);

  const handleUpdateLocations = async (
    warehouseId: string,
    locations: number[][]
  ) => {
    await updateLocationsMutation.mutateAsync({ warehouseId, locations });
  };

  const selectedWarehouseData = warehouses.find(
    (w) => w._id === selectedWarehouse
  );

  return (
    <div className="p-6 mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          🗺️ Bản đồ nhà kho
        </h1>
        <p className="text-default-500 mt-1">
          Quản lý vị trí nhà kho trên bản đồ
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="border border-divider">
            <CardHeader className="border-b border-divider">
              <Tabs
                selectedKey={selectedTab}
                onSelectionChange={(key) => setSelectedTab(key as string)}
                variant="underlined"
                fullWidth
              >
                <Tab
                  key="warehouses"
                  title={
                    <div className="flex items-center gap-2">
                      <span>🏭</span>
                      <span>Nhà kho</span>
                    </div>
                  }
                />
                <Tab
                  key="devices"
                  title={
                    <div className="flex items-center gap-2">
                      <span>📡</span>
                      <span>Thiết bị</span>
                    </div>
                  }
                />
              </Tabs>
            </CardHeader>
            <CardBody className="p-4 max-h-[calc(100vh-300px)] overflow-y-auto">
              {selectedTab === "warehouses" ? (
                <div className="space-y-2">
                  {warehouses.map((warehouse) => {
                    const hasLocations =
                      warehouse.locations && warehouse.locations.length > 0;
                    const isSelected = selectedWarehouse === warehouse._id;

                    return (
                      <Card
                        key={warehouse._id}
                        isPressable
                        onPress={() => {
                          setSelectedWarehouse(warehouse._id);
                          if (mapRef && hasLocations) {
                            const bounds = L.latLngBounds(
                              warehouse.locations!
                                .filter((coord) => coord[0] !== undefined && coord[1] !== undefined)
                                .map((coord) => [coord[1] as number, coord[0] as number])
                            );
                            mapRef.fitBounds(bounds, { padding: [50, 50] });
                          }
                        }}
                        className={`border w-full ${isSelected
                          ? "border-primary bg-primary-50"
                          : "border-divider"
                          }`}
                      >
                        <CardBody className="p-3">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
                              <span className="text-xl">🏭</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm truncate">
                                {warehouse.name}
                              </p>
                              <p className="text-xs text-default-500 truncate">
                                {warehouse.type}
                              </p>
                              <div className="flex gap-1 mt-2">
                                {hasLocations ? (
                                  <Chip size="sm" color="success" variant="flat">
                                    ✅ {warehouse.locations!.length} điểm
                                  </Chip>
                                ) : (
                                  <Chip size="sm" color="warning" variant="flat">
                                    ⚠️ Chưa vẽ
                                  </Chip>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedWarehouse ? (
                    devices.length > 0 ? (
                      devices.map((device: any) => (
                        <Card
                          key={device._id}
                          className="border border-divider"
                        >
                          <CardBody className="p-3">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center shrink-0">
                                <span className="text-xl">📡</span>
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-sm">
                                  {device.name}
                                </p>
                                <p className="text-xs text-default-500">
                                  {device.deviceCode}
                                </p>
                                <Chip
                                  size="sm"
                                  color="primary"
                                  variant="flat"
                                  className="mt-2"
                                >
                                  {device.type}
                                </Chip>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-default-500 text-sm">
                          Không có thiết bị nào
                        </p>
                      </div>
                    )
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-default-500 text-sm">
                        Chọn nhà kho để xem thiết bị
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Info Card */}
          {selectedWarehouseData && (
            <Card className="border border-divider bg-linear-to-br from-primary-50 to-primary-100">
              <CardBody className="p-4">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <span>🏭</span>
                  <span>{selectedWarehouseData.name}</span>
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-xs text-default-500">Loại</p>
                    <p className="font-medium">{selectedWarehouseData.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-default-500">Địa chỉ</p>
                    <p className="text-xs">{selectedWarehouseData.address}</p>
                  </div>
                  {selectedWarehouseData.locations &&
                    selectedWarehouseData.locations.length > 0 && (
                      <div>
                        <p className="text-xs text-default-500">Tọa độ</p>
                        <Chip size="sm" color="success" variant="flat">
                          {selectedWarehouseData.locations.length} điểm
                        </Chip>
                      </div>
                    )}
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Map */}
        <div className="lg:col-span-2">
          <Card className="border border-divider">
            <CardHeader className="border-b border-divider">
              <div className="flex justify-between items-center w-full">
                <h3 className="font-bold">Bản đồ</h3>
                {selectedWarehouseData && (
                  <div className="flex gap-2">
                    <Chip
                      size="sm"
                      color={
                        selectedWarehouseData.locations &&
                          selectedWarehouseData.locations.length > 0
                          ? "success"
                          : "warning"
                      }
                    >
                      {selectedWarehouseData.locations &&
                        selectedWarehouseData.locations.length > 0
                        ? `✅ Đã vẽ ${selectedWarehouseData.locations.length} điểm`
                        : "⚠️ Chưa vẽ polygon"}
                    </Chip>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardBody className="p-0">
              <div className="relative">
                <div
                  id="warehouse-map"
                  style={{ height: "calc(100vh - 250px)", width: "100%" }}
                />
                {mapRef && selectedWarehouse && (
                  <WarehouseBoundsEditor
                    map={mapRef}
                    warehouse={selectedWarehouseData || null}
                    onSave={handleUpdateLocations}
                    isLoading={updateLocationsMutation.isPending}
                  />
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}