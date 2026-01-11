"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Tabs,
  Tab,
  Chip,
  useDisclosure,
} from "@heroui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../app/api/api";
import {
  Device,
  DeviceWithSubDevices,
  DeviceType,
  DeviceState,
} from "../../types/device";
import DeviceTable from "./components/DeviceTable";
import SubDeviceTable from "./components/SubDeviceTable";
import DeviceFormModal from "./components/DeviceFormModal";
import SubDeviceFormModal from "./components/SubDeviceFormModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";

export default function DevicesPage() {
  const [selectedTab, setSelectedTab] = useState<string>("devices");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [editingSubDevice, setEditingSubDevice] = useState<any | null>(null);
  const [deletingItem, setDeletingItem] = useState<{
    id: string;
    name: string;
    type: "device" | "subdevice";
  } | null>(null);
  const [selectedDeviceForSub, setSelectedDeviceForSub] = useState<string>("");

  const queryClient = useQueryClient();

  // Modals
  const {
    isOpen: isDeviceModalOpen,
    onOpen: onDeviceModalOpen,
    onClose: onDeviceModalClose,
  } = useDisclosure();

  const {
    isOpen: isSubDeviceModalOpen,
    onOpen: onSubDeviceModalOpen,
    onClose: onSubDeviceModalClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

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
  });

  // Fetch all warehouses for dropdown
  const { data: warehouses = [] } = useQuery({
    queryKey: ["warehouses"],
    queryFn: async () => {
      const response = await api.get("/warehouses");
      return response.data;
    },
  });

  // Create device mutation
  const createDeviceMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/devices", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-devices"] });
      queryClient.invalidateQueries({ queryKey: ["all-devices-with-subs"] });
      onDeviceModalClose();
      setEditingDevice(null);
    },
  });

  // Update device mutation
  const updateDeviceMutation = useMutation({
    mutationFn: async (data: { deviceId: string; updates: any }) => {
      const response = await api.patch(`/devices/${data.deviceId}`, data.updates);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-devices"] });
      queryClient.invalidateQueries({ queryKey: ["all-devices-with-subs"] });
      onDeviceModalClose();
      setEditingDevice(null);
    },
  });

  // Delete device mutation
  const deleteDeviceMutation = useMutation({
    mutationFn: async (deviceId: string) => {
      await api.delete(`/devices/${deviceId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-devices"] });
      queryClient.invalidateQueries({ queryKey: ["all-devices-with-subs"] });
      onDeleteModalClose();
      setDeletingItem(null);
    },
  });

  // Create sub-device mutation
  const createSubDeviceMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/sub-devices", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-devices-with-subs"] });
      onSubDeviceModalClose();
      setEditingSubDevice(null);
      setSelectedDeviceForSub("");
    },
  });

  // Update sub-device mutation
  const updateSubDeviceMutation = useMutation({
    mutationFn: async (data: { subDeviceId: string; updates: any }) => {
      const response = await api.patch(
        `/sub-devices/${data.subDeviceId}`,
        data.updates
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-devices-with-subs"] });
      onSubDeviceModalClose();
      setEditingSubDevice(null);
    },
  });

  // Delete sub-device mutation
  const deleteSubDeviceMutation = useMutation({
    mutationFn: async (subDeviceId: string) => {
      await api.delete(`/sub-devices/${subDeviceId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-devices-with-subs"] });
      onDeleteModalClose();
      setDeletingItem(null);
    },
  });

  // Handlers
  const handleAddDevice = () => {
    setEditingDevice(null);
    onDeviceModalOpen();
  };

  const handleEditDevice = (device: Device) => {
    setEditingDevice(device);
    onDeviceModalOpen();
  };

  const handleDeleteDevice = (device: Device) => {
    setDeletingItem({
      id: device._id,
      name: device.name,
      type: "device",
    });
    onDeleteModalOpen();
  };

  const handleAddSubDevice = (deviceId: string) => {
    setSelectedDeviceForSub(deviceId);
    setEditingSubDevice(null);
    onSubDeviceModalOpen();
  };

  const handleEditSubDevice = (subDevice: any) => {
    setEditingSubDevice(subDevice);
    onSubDeviceModalOpen();
  };

  const handleDeleteSubDevice = (subDevice: any) => {
    setDeletingItem({
      id: subDevice._id,
      name: subDevice.name,
      type: "subdevice",
    });
    onDeleteModalOpen();
  };

  const handleSaveDevice = (data: any) => {
    if (editingDevice) {
      updateDeviceMutation.mutate({
        deviceId: editingDevice._id,
        updates: data,
      });
    } else {
      createDeviceMutation.mutate(data);
    }
  };

  const handleSaveSubDevice = (data: any) => {
    if (editingSubDevice) {
      updateSubDeviceMutation.mutate({
        subDeviceId: editingSubDevice._id,
        updates: data,
      });
    } else {
      createSubDeviceMutation.mutate({
        ...data,
        deviceId: selectedDeviceForSub,
      });
    }
  };

  const handleConfirmDelete = () => {
    if (deletingItem) {
      if (deletingItem.type === "device") {
        deleteDeviceMutation.mutate(deletingItem.id);
      } else {
        deleteSubDeviceMutation.mutate(deletingItem.id);
      }
    }
  };

  // Get all sub-devices for the table
  const allSubDevices = devicesWithSubs
    .filter((d) => d.subDevices && d.subDevices.length > 0)
    .flatMap((d) =>
      d.subDevices!.map((sub) => ({
        ...sub,
        deviceName: d.name,
        deviceId: d._id,
      }))
    );

  // Filter devices
  const filteredDevices = devices.filter(
    (device) =>
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.mac.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.deviceCode?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter sub-devices
  const filteredSubDevices = allSubDevices.filter(
    (sub) =>
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.deviceName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate statistics
  const stats = {
    total: devices.length,
    active: devices.filter((d) => d.state === DeviceState.ACTIVE).length,
    gateways: devices.filter((d) => d.type === DeviceType.GATEWAY).length,
    sensors: devices.filter((d) => d.type === DeviceType.ENV_SENSOR).length,
    nodes: devices.filter((d) => d.type === DeviceType.OTHER).length,
    rfid: devices.filter((d) => d.type === DeviceType.RFID_READER).length,
    totalSubs: allSubDevices.length,
  };

  return (
    <div className="p-6 mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">🔧 Quản lý thiết bị</h1>
          <p className="text-default-500 mt-1">
            Quản lý tất cả thiết bị và thiết bị con trong hệ thống
          </p>
        </div>
        <Button
          color="primary"
          size="lg"
          onPress={handleAddDevice}
        >
          ➕ Thêm thiết bị mới
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card className="border border-divider">
          <CardBody className="p-4 text-center">
            <p className="text-sm text-default-500 mb-1">Tổng thiết bị</p>
            <p className="text-2xl font-bold text-primary">{stats.total}</p>
          </CardBody>
        </Card>
        <Card className="border border-divider">
          <CardBody className="p-4 text-center">
            <p className="text-sm text-default-500 mb-1">Hoạt động</p>
            <p className="text-2xl font-bold text-success">{stats.active}</p>
          </CardBody>
        </Card>
        <Card className="border border-divider">
          <CardBody className="p-4 text-center">
            <p className="text-sm text-default-500 mb-1">Gateway</p>
            <p className="text-2xl font-bold text-primary">{stats.gateways}</p>
          </CardBody>
        </Card>
        <Card className="border border-divider">
          <CardBody className="p-4 text-center">
            <p className="text-sm text-default-500 mb-1">Sensor</p>
            <p className="text-2xl font-bold text-success">{stats.sensors}</p>
          </CardBody>
        </Card>
        <Card className="border border-divider">
          <CardBody className="p-4 text-center">
            <p className="text-sm text-default-500 mb-1">Node</p>
            <p className="text-2xl font-bold text-secondary">{stats.nodes}</p>
          </CardBody>
        </Card>
        <Card className="border border-divider">
          <CardBody className="p-4 text-center">
            <p className="text-sm text-default-500 mb-1">RFID</p>
            <p className="text-2xl font-bold text-warning">{stats.rfid}</p>
          </CardBody>
        </Card>
        <Card className="border border-divider">
          <CardBody className="p-4 text-center">
            <p className="text-sm text-default-500 mb-1">TB con</p>
            <p className="text-2xl font-bold text-secondary">{stats.totalSubs}</p>
          </CardBody>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="border border-divider">
        <CardHeader className="flex flex-col items-start gap-3 pb-0">
          <div className="flex w-full justify-between items-center">
            <Tabs
              selectedKey={selectedTab}
              onSelectionChange={(key) => setSelectedTab(key as string)}
              variant="underlined"
              size="lg"
            >
              <Tab
                key="devices"
                title={
                  <div className="flex items-center gap-2">
                    <span>🔌 Thiết bị</span>
                    <Chip size="sm" variant="flat">
                      {devices.length}
                    </Chip>
                  </div>
                }
              />
              <Tab
                key="subdevices"
                title={
                  <div className="flex items-center gap-2">
                    <span>⚙️ Thiết bị con</span>
                    <Chip size="sm" variant="flat">
                      {allSubDevices.length}
                    </Chip>
                  </div>
                }
              />
            </Tabs>
            <Input
              placeholder="Tìm kiếm thiết bị..."
              startContent={<span>🔍</span>}
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="w-80"
              size="sm"
            />
          </div>
        </CardHeader>
        <CardBody>
          {selectedTab === "devices" ? (
            <DeviceTable
              devices={filteredDevices}
              warehouses={warehouses}
              isLoading={devicesLoading}
              onEdit={handleEditDevice}
              onDelete={handleDeleteDevice}
              onAddSubDevice={handleAddSubDevice}
            />
          ) : (
            <SubDeviceTable
              subDevices={filteredSubDevices}
              devices={devicesWithSubs}
              isLoading={subsLoading}
              onEdit={handleEditSubDevice}
              onDelete={handleDeleteSubDevice}
            />
          )}
        </CardBody>
      </Card>

      {/* Device Form Modal */}
      <DeviceFormModal
        isOpen={isDeviceModalOpen}
        onClose={onDeviceModalClose}
        device={editingDevice}
        warehouses={warehouses}
        gateways={devices.filter((d) => d.type === DeviceType.GATEWAY)}
        onSave={handleSaveDevice}
        isLoading={
          createDeviceMutation.isPending || updateDeviceMutation.isPending
        }
      />

      {/* Sub-Device Form Modal */}
      <SubDeviceFormModal
        isOpen={isSubDeviceModalOpen}
        onClose={onSubDeviceModalClose}
        subDevice={editingSubDevice}
        devices={devicesWithSubs.filter(
          (d) => d.type === DeviceType.OTHER || d.type === DeviceType.RFID_READER
        )}
        selectedDeviceId={selectedDeviceForSub}
        onSave={handleSaveSubDevice}
        isLoading={
          createSubDeviceMutation.isPending || updateSubDeviceMutation.isPending
        }
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        itemName={deletingItem?.name || ""}
        itemType={deletingItem?.type === "device" ? "thiết bị" : "thiết bị con"}
        onConfirm={handleConfirmDelete}
        isLoading={
          deleteDeviceMutation.isPending || deleteSubDeviceMutation.isPending
        }
      />
    </div>
  );
}