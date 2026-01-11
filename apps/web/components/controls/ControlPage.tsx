"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Select,
  SelectItem,
  Chip,
  Spinner,
} from "@heroui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../app/api/api";
import {
  Device,
  DeviceWithSubDevices,
  DeviceType,
  DeviceState,
  SubDeviceStatus,
} from "../../types/device";
import SubDeviceControlCard from "./components/SubDeviceControlCard";
import ThresholdControlPanel from "./components/ThresholdControlPanel";
import ControlStatsCards from "./components/ControlStatsCards";

export default function ControlPage() {
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("all");
  const [selectedDevice, setSelectedDevice] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const queryClient = useQueryClient();

  // Fetch all warehouses
  const { data: warehouses = [] } = useQuery({
    queryKey: ["warehouses"],
    queryFn: async () => {
      const response = await api.get("/warehouses");
      return response.data;
    },
  });

  // Fetch all devices
  const { data: devices = [], isLoading: devicesLoading } = useQuery({
    queryKey: ["all-devices"],
    queryFn: async () => {
      const response = await api.get("/devices");
      return response.data as Device[];
    },
  });

  // Fetch devices with sub-devices
  const { data: devicesWithSubs = [], isLoading: subsLoading } = useQuery({
    queryKey: ["all-devices-with-subs"],
    queryFn: async () => {
      const devicesWithSubDevices: DeviceWithSubDevices[] = await Promise.all(
        devices.map(async (device) => {
          if (
            device.type === DeviceType.OTHER ||
            device.type === DeviceType.RFID_READER
          ) {
            try {
              const response = await api.get(`/sub-devices/device/${device._id}`);
              return { ...device, subDevices: response.data };
            } catch (error) {
              return { ...device, subDevices: [] };
            }
          }
          return device;
        })
      );
      return devicesWithSubDevices;
    },
    enabled: devices.length > 0,
    refetchInterval: 5000, // Auto refresh every 5 seconds
  });

  // Update sub-device status
  const updateStatusMutation = useMutation({
    mutationFn: async ({
      subDeviceId,
      type,
      status,
    }: {
      subDeviceId: string;
      type : number,
      status: SubDeviceStatus;
    }) => {
      const response = await api.post(`/control/${subDeviceId}`, {
        kind:1,
        actuator: type,
        on: status,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-devices-with-subs"] });
    },
  });

  // Control sub-device value with proper packet format
  const controlValueMutation = useMutation({
    mutationFn: async ({
      deviceId,
      actuatorType,
      status,
      value,
    }: {
      deviceId: string;
      actuatorType: number;
      status: SubDeviceStatus;
      value: number;
    }) => {
      const controlPacket = {
        kind: 2,
        actuator: actuatorType,
        on: status === SubDeviceStatus.ON ? 1 : 0,
        value: value,
      };
      const response = await api.post(`/control/${deviceId}`, controlPacket);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-devices-with-subs"] });
    },
  });

  // Update device state
  const updateDeviceStateMutation = useMutation({
    mutationFn: async ({
      deviceId,
      state,
    }: {
      deviceId: string;
      state: DeviceState;
    }) => {
      const response = await api.patch(`/devices/${deviceId}`, { state });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-devices"] });
      queryClient.invalidateQueries({ queryKey: ["all-devices-with-subs"] });
    },
  });

  // Update threshold with proper packet format
  const updateThresholdMutation = useMutation({
    mutationFn: async ({
      deviceId,
      threshold,
    }: {
      deviceId: string;
      threshold: {
        temp_lo: number;
        temp_hi: number;
        hum_lo: number;
        hum_hi: number;
        gas_hi: number;
        light_lo: number;
        light_hi: number;
      };
    }) => {
      const response = await api.post(`/control/${deviceId}/threshold`, threshold);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-devices-with-subs"] });
    },
  });

  // Handlers
  const handleToggleStatus = (subDeviceId: string, currentStatus: SubDeviceStatus, currentType) => {
    updateStatusMutation.mutate({
      subDeviceId,
      currentType,
      status:
        currentStatus === SubDeviceStatus.ON
          ? SubDeviceStatus.OFF
          : SubDeviceStatus.ON,
    });
  };

  const handleControlValue = (
    deviceId: string,
    actuatorType: number,
    status: SubDeviceStatus,
    value: number
  ) => {
    controlValueMutation.mutate({
      deviceId,
      actuatorType,
      status,
      value,
    });
  };

  const handleUpdateDeviceState = (deviceId: string, state: DeviceState) => {
    updateDeviceStateMutation.mutate({
      deviceId,
      state,
    });
  };

  const handleUpdateThreshold = (deviceId: string, threshold: any) => {
    updateThresholdMutation.mutate({
      deviceId,
      threshold,
    });
  };

  // Filter devices with sub-devices
  const devicesWithSubDevices = devicesWithSubs.filter(
    (d) => d.subDevices && d.subDevices.length > 0
  );

  // Apply filters
  let filteredDevices = devicesWithSubDevices;

  if (selectedWarehouse !== "all") {
    filteredDevices = filteredDevices.filter(
      (d) => d.warehouseId === selectedWarehouse
    );
  }

  if (selectedDevice !== "all") {
    filteredDevices = filteredDevices.filter((d) => d._id === selectedDevice);
  }

  if (searchQuery) {
    filteredDevices = filteredDevices.filter(
      (d) =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.subDevices?.some((sub) =>
          sub.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }

  // Calculate statistics
  const allSubDevices = devicesWithSubDevices.flatMap((d) => d.subDevices || []);
  const stats = {
    totalDevices: devicesWithSubDevices.length,
    totalSubDevices: allSubDevices.length,
    activeSubDevices: allSubDevices.filter((s) => s.status === SubDeviceStatus.ON)
      .length,
    inactiveSubDevices: allSubDevices.filter(
      (s) => s.status === SubDeviceStatus.OFF
    ).length,
    activeDevices: devicesWithSubDevices.filter(
      (d) => d.state === DeviceState.ACTIVE
    ).length,
  };

  const isLoading = devicesLoading || subsLoading;

  return (
    <div className="p-6 mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">🎮 Điều khiển thiết bị</h1>
          <p className="text-default-500 mt-1">
            Điều khiển và giám sát thiết bị theo thời gian thực
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-success-50 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm text-success font-medium">
              Đang kết nối
            </span>
          </div>
          <Button
            color="primary"
            variant="flat"
            size="sm"
            onPress={() => {
              queryClient.invalidateQueries({
                queryKey: ["all-devices-with-subs"],
              });
            }}
          >
            🔄 Làm mới
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <ControlStatsCards stats={stats} />

      {/* Filters */}
      <Card className="border border-divider">
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Nhà kho"
              placeholder="Tất cả nhà kho"
              selectedKeys={selectedWarehouse ? [selectedWarehouse] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                setSelectedWarehouse(selected || "all");
                setSelectedDevice("all");
              }}
            >
              <SelectItem key="all" value="all">
                Tất cả nhà kho
              </SelectItem>
              {warehouses.map((warehouse: any) => (
                <SelectItem key={warehouse._id} value={warehouse._id}>
                  {warehouse.name}
                </SelectItem>
              ))}
            </Select>

            <Select
              label="Thiết bị"
              placeholder="Tất cả thiết bị"
              selectedKeys={selectedDevice ? [selectedDevice] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                setSelectedDevice(selected || "all");
              }}
            >
              <SelectItem key="all" value="all">
                Tất cả thiết bị
              </SelectItem>
              {devicesWithSubDevices
                .filter(
                  (d) =>
                    selectedWarehouse === "all" ||
                    d.warehouseId === selectedWarehouse
                )
                .map((device) => (
                  <SelectItem key={device._id} value={device._id}>
                    {device.name} ({device.subDevices?.length || 0} TB con)
                  </SelectItem>
                ))}
            </Select>

            <Input
              placeholder="Tìm kiếm thiết bị..."
              startContent={<span>🔍</span>}
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
          </div>
        </CardBody>
      </Card>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Spinner size="lg" label="Đang tải thiết bị..." />
        </div>
      ) : filteredDevices.length === 0 ? (
        <Card className="border border-divider">
          <CardBody className="text-center py-20">
            <p className="text-lg text-default-500">
              Không tìm thấy thiết bị nào
            </p>
            <p className="text-sm text-default-400 mt-2">
              Thử thay đổi bộ lọc hoặc thêm thiết bị mới
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredDevices.map((device) => (
            <Card key={device._id} className="border border-divider">
              <CardHeader className="flex justify-between items-center pb-0">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${device.state === DeviceState.ACTIVE
                        ? "bg-success animate-pulse"
                        : device.state === DeviceState.UNAUTHORIZED
                          ? "bg-default-400"
                          : "bg-danger"
                      }`}
                  />
                  <div>
                    <h3 className="text-xl font-bold">{device.name}</h3>
                    <p className="text-sm text-default-500">
                      {device.mac} •{" "}
                      {warehouses.find((w: any) => w._id === device.warehouseId)
                        ?.name || "—"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Chip size="sm" variant="flat" color="secondary">
                    {device.subDevices?.length || 0} thiết bị con
                  </Chip>
                  <Select
                    size="sm"
                    selectedKeys={[device.state]}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] as DeviceState;
                      handleUpdateDeviceState(device._id, selected);
                    }}
                    className="w-40"
                    isDisabled={updateDeviceStateMutation.isPending}
                  >
                    <SelectItem key={DeviceState.ACTIVE} value={DeviceState.ACTIVE}>
                      Hoạt động
                    </SelectItem>
                    <SelectItem
                      key={DeviceState.INACTIVE}
                      value={DeviceState.INACTIVE}
                    >
                      Tắt
                    </SelectItem>
                    <SelectItem
                      key={DeviceState.MAINTENANCE}
                      value={DeviceState.MAINTENANCE}
                    >
                      Bảo trì
                    </SelectItem>
                  </Select>
                </div>
              </CardHeader>
              <CardBody>
                {/* Threshold Control */}
                <ThresholdControlPanel
                  device={device}
                  onUpdateThreshold={handleUpdateThreshold}
                  isLoading={updateThresholdMutation.isPending}
                />

                {/* Sub-devices Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  {device.subDevices?.map((subDevice) => (
                    <SubDeviceControlCard
                      key={subDevice._id}
                      subDevice={subDevice}
                      deviceId={device._id}
                      onToggleStatus={handleToggleStatus}
                      onControlValue={handleControlValue}
                      isUpdating={
                        updateStatusMutation.isPending ||
                        controlValueMutation.isPending
                      }
                    />
                  ))}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}