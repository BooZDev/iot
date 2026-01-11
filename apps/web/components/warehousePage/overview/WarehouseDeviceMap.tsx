"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Chip,
  Tabs,
  Tab,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  SelectItem,
  useDisclosure,
  Textarea,
} from "@heroui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../app/api/api";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Device,
  DeviceWithSubDevices,
  SubDevice,
  Warehouse,
  DeviceType,
  DeviceState,
  SubDeviceStatus,
  CreateDeviceDto,
  CreateSubDeviceDto,
} from "../../../types/device";
import WarehouseInfo from "./components/WarehouseInfo"
import DeviceMapView from "./components/DeviceMapView";
import DeviceListView from "./components/DeviceListView";
import InventoryView from "./components/InventoryView";

interface WarehouseDeviceMapProps {
  warehouseId: string;
}

export default function WarehouseDeviceMap({
  warehouseId,
}: WarehouseDeviceMapProps) {
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [mapRef, setMapRef] = useState<L.Map | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("info");
  const [isAddingDevice, setIsAddingDevice] = useState(false);
  const [newDeviceLocation, setNewDeviceLocation] = useState<
    [number, number] | null
  >(null);
  const [tempMarker, setTempMarker] = useState<[number, number] | null>(null);

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
    isOpen: isWarehouseModalOpen,
    onOpen: onWarehouseModalOpen,
    onClose: onWarehouseModalClose,
  } = useDisclosure();

  const {
    isOpen: isEditDeviceModalOpen,
    onOpen: onEditDeviceModalOpen,
    onClose: onEditDeviceModalClose,
  } = useDisclosure();

  const {
    isOpen: isEditSubDeviceModalOpen,
    onOpen: onEditSubDeviceModalOpen,
    onClose: onEditSubDeviceModalClose,
  } = useDisclosure();

  const [selectedDeviceForSub, setSelectedDeviceForSub] = useState<string>("");

  // Form states
  const [newDevice, setNewDevice] = useState<CreateDeviceDto>({
    deviceCode: "",
    name: "",
    type: DeviceType.ENV_SENSOR,
    mac: "",
    warehouseId: warehouseId,
    gatewayId: null,
  });

  const [newSubDevice, setNewSubDevice] = useState<CreateSubDeviceDto>({
    code: "",
    name: "",
    type: 1,
    deviceId: "",
  });

  const [warehouseForm, setWarehouseForm] = useState({
    name: "",
    address: "",
    description: "",
  });

  // Use separate state for editing to avoid mutation issues
  const [editDeviceForm, setEditDeviceForm] = useState({
    _id: "",
    deviceCode: "",
    name: "",
    mac: "",
    state: DeviceState.ACTIVE,
    gatewayId: null as string | null,
    type: DeviceType.ENV_SENSOR,
  });

  const [editSubDeviceForm, setEditSubDeviceForm] = useState({
    _id: "",
    code: "",
    name: "",
    type: 1,
  });

  // Fetch warehouse
  const { data: warehouse } = useQuery({
    queryKey: ["warehouse", warehouseId],
    queryFn: async () => {
      const response = await api.get(`/warehouses/${warehouseId}`);
      return response.data as Warehouse;
    },
  });

  // Initialize warehouse form when data loads
  useEffect(() => {
    if (warehouse) {
      setWarehouseForm({
        name: warehouse.name || "",
        address: warehouse.address || "",
        description: (warehouse.description || "") as string,
      });
    }
  }, [warehouse]);

  // Fetch devices
  const { data: devices = [] } = useQuery({
    queryKey: ["devices", warehouseId],
    queryFn: async () => {
      const response = await api.get(`/warehouses/${warehouseId}/devices`);
      return response.data as Device[];
    },
  });

  // Fetch sub-devices for each device
  const { data: devicesWithSubs = [] } = useQuery({
    queryKey: ["devices-with-subs", warehouseId],
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

  // Update warehouse mutation
  const updateWarehouseMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      address: string;
      description: string;
    }) => {
      const response = await api.patch(`/warehouses/${warehouseId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouse", warehouseId] });
      onWarehouseModalClose();
    },
  });

  // Create device mutation
  const createDeviceMutation = useMutation({
    mutationFn: async (
      data: CreateDeviceDto & { locationsInWarehouse: [number, number] }
    ) => {
      const response = await api.post("/devices", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices", warehouseId] });
      queryClient.invalidateQueries({
        queryKey: ["devices-with-subs", warehouseId],
      });
      onDeviceModalClose();
      setIsAddingDevice(false);
      setTempMarker(null);
      setNewDevice({
        deviceCode: "",
        name: "",
        type: DeviceType.ENV_SENSOR,
        mac: "",
        warehouseId: warehouseId,
        gatewayId: null,
      });
    },
  });

  // Update device mutation
  const updateDeviceMutation = useMutation({
    mutationFn: async (data: {
      deviceId: string;
      updates: {
        name: string;
        deviceCode: string;
        mac: string;
        state: DeviceState;
        gatewayId: string | null;
      };
    }) => {
      const response = await api.patch(`/devices/${data.deviceId}`, data.updates);
      return response.data;
    },
    onSuccess: (updatedDevice) => {
      queryClient.setQueryData<Device[]>(
        ["devices", warehouseId],
        (old = []) =>
          old.map(d =>
            d._id === updatedDevice._id ? updatedDevice : d
          )
      );

      // update devicesWithSubs
      queryClient.setQueryData<DeviceWithSubDevices[]>(
        ["devices-with-subs", warehouseId],
        (old = []) =>
          old.map(d =>
            d._id === updatedDevice._id
              ? { ...d, ...updatedDevice }
              : d
          )
      );
      onEditDeviceModalClose();
    },
  });

  // Create sub-device mutation
  const createSubDeviceMutation = useMutation({
    mutationFn: async (data: CreateSubDeviceDto) => {
      const response = await api.post("/sub-devices", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["devices-with-subs", warehouseId],
      });
      onSubDeviceModalClose();
      setNewSubDevice({
        code: "",
        name: "",
        type: 1,
        deviceId: "",
      });
    },
  });

  // Update sub-device mutation
  const updateSubDeviceMutation = useMutation({
    mutationFn: async (data: {
      subDeviceId: string;
      updates: { name: string; code: string; type: number };
    }) => {
      const response = await api.patch(
        `/sub-devices/${data.subDeviceId}`,
        data.updates
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["devices-with-subs", warehouseId],
      });
      onEditSubDeviceModalClose();
    },
  });

  // Toggle sub-device mutation
  const toggleSubDeviceMutation = useMutation({
    mutationFn: async ({
      subDeviceId,
      status,
    }: {
      subDeviceId: string;
      status: SubDeviceStatus;
    }) => {
      const response = await api.patch(`/sub-devices/${subDeviceId}`, {
        status,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["devices-with-subs", warehouseId],
      });
    },
  });

  const handleDeviceClick = (device: Device) => {
    setSelectedDevice(device._id);
    if (mapRef && device.locationsInWarehouse?.length === 2) {
      const [lng, lat] = device.locationsInWarehouse;
      mapRef.flyTo([lat, lng], 18, { duration: 1.5 });
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    if (isAddingDevice) {
      setNewDeviceLocation([lng, lat]);
      setTempMarker([lat, lng]);
      onDeviceModalOpen();
    }
  };

  const handleCreateDevice = () => {
    if (newDeviceLocation) {
      createDeviceMutation.mutate({
        ...newDevice,
        locationsInWarehouse: newDeviceLocation,
      });
    }
  };

  const handleUpdateWarehouse = () => {
    updateWarehouseMutation.mutate(warehouseForm);
  };

  const handleEditDevice = (device: Device) => {
    // Copy device data to edit form
    setEditDeviceForm({
      _id: device._id,
      deviceCode: device.deviceCode as string,
      name: device.name,
      mac: device.mac,
      state: device.state,
      gatewayId: device.gatewayId || null,
      type: device.type,
    });
    onEditDeviceModalOpen();
  };

  const handleUpdateDevice = () => {
    updateDeviceMutation.mutate({
      deviceId: editDeviceForm._id,
      updates: {
        name: editDeviceForm.name,
        deviceCode: editDeviceForm.deviceCode,
        mac: editDeviceForm.mac,
        state: editDeviceForm.state,
        gatewayId: editDeviceForm.gatewayId,
      },
    });
  };

  const handleEditSubDevice = (subDevice: SubDevice) => {
    // Copy sub-device data to edit form
    setEditSubDeviceForm({
      _id: subDevice._id,
      code: subDevice.code,
      name: subDevice.name,
      type: subDevice.type,
    });
    onEditSubDeviceModalOpen();
  };

  const handleUpdateSubDevice = () => {
    updateSubDeviceMutation.mutate({
      subDeviceId: editSubDeviceForm._id,
      updates: {
        name: editSubDeviceForm.name,
        code: editSubDeviceForm.code,
        type: editSubDeviceForm.type,
      },
    });
  };

  const handleCreateSubDevice = () => {
    createSubDeviceMutation.mutate(newSubDevice);
  };

  const handleToggleSubDevice = (
    subDeviceId: string,
    currentStatus: SubDeviceStatus
  ) => {
    toggleSubDeviceMutation.mutate({
      subDeviceId,
      status:
        currentStatus === SubDeviceStatus.ON
          ? SubDeviceStatus.OFF
          : SubDeviceStatus.ON,
    });
  };

  const handleStartAddingDevice = () => {
    setIsAddingDevice(true);
    setSelectedTab("map");
  };

  const handleCancelAddingDevice = () => {
    setIsAddingDevice(false);
    setTempMarker(null);
    onDeviceModalClose();
  };

  const handleOpenSubDeviceModal = (deviceId: string) => {
    setSelectedDeviceForSub(deviceId);
    setNewSubDevice({ ...newSubDevice, deviceId });
    onSubDeviceModalOpen();
  };

  // Get gateways for select
  const gateways = devices.filter((d) => d.type === DeviceType.GATEWAY);

  return (
    <>
      <Card className="border border-divider">
        <CardHeader className="flex flex-col items-start gap-2 pb-0">
          <div className="flex w-full justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">
                🏭 {warehouse?.name || "Nhà kho"}
              </h2>
              <p className="text-sm text-default-500">
                {warehouse?.address || "Chưa có địa chỉ"}
              </p>
            </div>
            <div className="flex gap-2">
              <Chip size="sm" color="primary" variant="flat">
                {devices.filter((d) => d.type === DeviceType.GATEWAY).length}{" "}
                Gateway
              </Chip>
              <Chip size="sm" color="success" variant="flat">
                {devices.filter((d) => d.type === DeviceType.ENV_SENSOR).length}{" "}
                Sensor
              </Chip>
              <Chip size="sm" color="secondary" variant="flat">
                {devices.filter((d) => d.type === DeviceType.OTHER).length} Node
              </Chip>
              <Chip size="sm" color="warning" variant="flat">
                {devices.filter((d) => d.type === DeviceType.RFID_READER).length}{" "}
                RFID
              </Chip>
            </div>
          </div>
          <div className="flex w-full justify-between items-center">
            <Tabs
              selectedKey={selectedTab}
              onSelectionChange={(key) => setSelectedTab(key as string)}
              variant="underlined"
            >
              <Tab key="info" title="ℹ️ Thông tin" />
              <Tab key="map" title="🗺️ Bản đồ" />
              <Tab key="list" title="📋 Danh sách" />
              <Tab key="inventory" title="📦 Tồn kho" />
            </Tabs>
            <div className="flex gap-2">
              {isAddingDevice ? (
                <Button
                  color="danger"
                  size="sm"
                  onPress={handleCancelAddingDevice}
                >
                  ❌ Hủy
                </Button>
              ) : (
                <Button color="primary" size="sm" onPress={handleStartAddingDevice}>
                  ➕ Thêm thiết bị
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          {selectedTab === "info" ? (
            <WarehouseInfo
              warehouse={warehouse}
              devices={devices}
              devicesWithSubs={devicesWithSubs}
              onEditWarehouse={onWarehouseModalOpen}
              onEditDevice={handleEditDevice}
            />
          ) : selectedTab === "map" ? (
            <DeviceMapView
              warehouse={warehouse}
              devices={devicesWithSubs}
              selectedDevice={selectedDevice}
              isAddingDevice={isAddingDevice}
              tempMarker={tempMarker}
              onDeviceClick={handleDeviceClick}
              onMapClick={handleMapClick}
              onEditDevice={handleEditDevice}
              onEditSubDevice={handleEditSubDevice}
              onOpenSubDeviceModal={handleOpenSubDeviceModal}
              onToggleSubDevice={handleToggleSubDevice}
              toggleSubDeviceMutation={toggleSubDeviceMutation}
              setMapRef={setMapRef}
            />
          ) : selectedTab === "list" ? (
            <DeviceListView
              devices={devicesWithSubs}
              onStartAddingDevice={() => {
                setSelectedTab("map");
                handleStartAddingDevice();
              }}
              onEditDevice={handleEditDevice}
              onEditSubDevice={handleEditSubDevice}
              onOpenSubDeviceModal={handleOpenSubDeviceModal}
            />
          ) : (
            <InventoryView warehouseId={warehouseId} />
          )}
        </CardBody>
      </Card>

      {/* Edit Warehouse Modal */}
      <Modal
        isOpen={isWarehouseModalOpen}
        onClose={onWarehouseModalClose}
        size="2xl"
      >
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-bold">✏️ Sửa thông tin nhà kho</h3>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Tên nhà kho"
                placeholder="Nhập tên nhà kho"
                value={warehouseForm.name}
                onValueChange={(value) =>
                  setWarehouseForm({ ...warehouseForm, name: value })
                }
                isRequired
              />
              <Input
                label="Địa chỉ"
                placeholder="Nhập địa chỉ nhà kho"
                value={warehouseForm.address}
                onValueChange={(value) =>
                  setWarehouseForm({ ...warehouseForm, address: value })
                }
              />
              <Textarea
                label="Mô tả"
                placeholder="Nhập mô tả về nhà kho"
                value={warehouseForm.description}
                onValueChange={(value) =>
                  setWarehouseForm({ ...warehouseForm, description: value })
                }
                minRows={3}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={onWarehouseModalClose}
            >
              Hủy
            </Button>
            <Button
              color="primary"
              onPress={handleUpdateWarehouse}
              isLoading={updateWarehouseMutation.isPending}
              isDisabled={!warehouseForm.name}
            >
              Cập nhật
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Create Device Modal */}
      <Modal
        isOpen={isDeviceModalOpen}
        onClose={handleCancelAddingDevice}
        size="2xl"
      >
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-bold">➕ Thêm thiết bị mới</h3>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Mã thiết bị"
                placeholder="Nhập mã thiết bị"
                value={newDevice.deviceCode}
                onValueChange={(value) =>
                  setNewDevice({ ...newDevice, deviceCode: value })
                }
                isRequired
              />
              <Input
                label="Tên thiết bị"
                placeholder="Nhập tên thiết bị"
                value={newDevice.name}
                onValueChange={(value) =>
                  setNewDevice({ ...newDevice, name: value })
                }
                isRequired
              />
              <Input
                label="Địa chỉ MAC"
                placeholder="Nhập địa chỉ MAC"
                value={newDevice.mac}
                onValueChange={(value) =>
                  setNewDevice({ ...newDevice, mac: value })
                }
                isRequired
              />
              <Select
                label="Loại thiết bị"
                placeholder="Chọn loại thiết bị"
                selectedKeys={[newDevice.type]}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as DeviceType;
                  setNewDevice({ ...newDevice, type: selected });
                }}
              >
                <SelectItem key={DeviceType.GATEWAY} value={DeviceType.GATEWAY}>
                  Gateway
                </SelectItem>
                <SelectItem
                  key={DeviceType.ENV_SENSOR}
                  value={DeviceType.ENV_SENSOR}
                >
                  Cảm biến môi trường
                </SelectItem>
                <SelectItem
                  key={DeviceType.RFID_READER}
                  value={DeviceType.RFID_READER}
                >
                  Đầu đọc RFID
                </SelectItem>
                <SelectItem key={DeviceType.OTHER} value={DeviceType.OTHER}>
                  Node điều khiển
                </SelectItem>
              </Select>

              {newDevice.type !== DeviceType.GATEWAY && gateways.length > 0 && (
                <Select
                  label="Gateway kết nối"
                  placeholder="Chọn gateway"
                  selectedKeys={newDevice.gatewayId ? [newDevice.gatewayId] : []}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    setNewDevice({ ...newDevice, gatewayId: selected || null });
                  }}
                >
                  {gateways.map((gateway) => (
                    <SelectItem key={gateway._id} value={gateway._id}>
                      {gateway.name}
                    </SelectItem>
                  ))}
                </Select>
              )}

              {newDeviceLocation && (
                <div className="p-3 bg-default-100 rounded">
                  <p className="text-sm font-semibold mb-1">📍 Vị trí đã chọn:</p>
                  <p className="text-xs font-mono">
                    Lng: {newDeviceLocation[0].toFixed(6)}, Lat:{" "}
                    {newDeviceLocation[1].toFixed(6)}
                  </p>
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={handleCancelAddingDevice}
            >
              Hủy
            </Button>
            <Button
              color="primary"
              onPress={handleCreateDevice}
              isLoading={createDeviceMutation.isPending}
              isDisabled={
                !newDevice.deviceCode ||
                !newDevice.name ||
                !newDevice.mac ||
                !newDeviceLocation
              }
            >
              Tạo thiết bị
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Device Modal */}
      <Modal
        isOpen={isEditDeviceModalOpen}
        onClose={onEditDeviceModalClose}
        size="2xl"
      >
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-bold">✏️ Sửa thông tin thiết bị</h3>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Mã thiết bị"
                placeholder="Nhập mã thiết bị"
                value={editDeviceForm.deviceCode}
                onValueChange={(value) =>
                  setEditDeviceForm({ ...editDeviceForm, deviceCode: value })
                }
              />
              <Input
                label="Tên thiết bị"
                placeholder="Nhập tên thiết bị"
                value={editDeviceForm.name}
                onValueChange={(value) =>
                  setEditDeviceForm({ ...editDeviceForm, name: value })
                }
                isRequired
              />
              <Input
                label="Địa chỉ MAC"
                placeholder="Nhập địa chỉ MAC"
                value={editDeviceForm.mac}
                onValueChange={(value) =>
                  setEditDeviceForm({ ...editDeviceForm, mac: value })
                }
                isRequired
              />
              <Select
                label="Trạng thái"
                placeholder="Chọn trạng thái"
                selectedKeys={[editDeviceForm.state]}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as DeviceState;
                  setEditDeviceForm({ ...editDeviceForm, state: selected });
                }}
              >
                <SelectItem key={DeviceState.ACTIVE} value={DeviceState.ACTIVE}>
                  Hoạt động
                </SelectItem>
                <SelectItem
                  key={DeviceState.INACTIVE}
                  value={DeviceState.INACTIVE}
                >
                  Không hoạt động
                </SelectItem>
                <SelectItem
                  key={DeviceState.MAINTENANCE}
                  value={DeviceState.MAINTENANCE}
                >
                  Bảo trì
                </SelectItem>
                <SelectItem
                  key={DeviceState.UNAUTHORIZED}
                  value={DeviceState.UNAUTHORIZED}
                >
                  Chưa xác thực
                </SelectItem>
              </Select>

              {editDeviceForm.type !== DeviceType.GATEWAY &&
                gateways.length > 0 && (
                  <Select
                    label="Gateway kết nối"
                    placeholder="Chọn gateway"
                    selectedKeys={
                      editDeviceForm.gatewayId ? [editDeviceForm.gatewayId] : []
                    }
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] as string;
                      setEditDeviceForm({
                        ...editDeviceForm,
                        gatewayId: selected || null,
                      });
                    }}
                  >
                    {gateways.map((gateway) => (
                      <SelectItem key={gateway._id} value={gateway._id}>
                        {gateway.name}
                      </SelectItem>
                    ))}
                  </Select>
                )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={onEditDeviceModalClose}
            >
              Hủy
            </Button>
            <Button
              color="primary"
              onPress={handleUpdateDevice}
              isLoading={updateDeviceMutation.isPending}
              isDisabled={!editDeviceForm.name || !editDeviceForm.mac}
            >
              Cập nhật
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Create Sub-Device Modal */}
      <Modal
        isOpen={isSubDeviceModalOpen}
        onClose={onSubDeviceModalClose}
        size="lg"
      >
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-bold">➕ Thêm thiết bị con</h3>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Mã thiết bị"
                placeholder="Nhập mã thiết bị"
                value={newSubDevice.code}
                onValueChange={(value) =>
                  setNewSubDevice({ ...newSubDevice, code: value })
                }
                isRequired
              />
              <Input
                label="Tên thiết bị"
                placeholder="Nhập tên thiết bị"
                value={newSubDevice.name}
                onValueChange={(value) =>
                  setNewSubDevice({ ...newSubDevice, name: value })
                }
                isRequired
              />
              <Select
                label="Loại thiết bị"
                placeholder="Chọn loại thiết bị"
                selectedKeys={[newSubDevice.type.toString()]}
                onSelectionChange={(keys) => {
                  const selected = parseInt(Array.from(keys)[0] as string);
                  setNewSubDevice({ ...newSubDevice, type: selected });
                }}
              >
                <SelectItem key="1" value="1">
                  🌀 Quạt thông gió
                </SelectItem>
                <SelectItem key="2" value="2">
                  💡 Đèn chiếu sáng
                </SelectItem>
                <SelectItem key="3" value="3">
                  ❄️ Điều hòa
                </SelectItem>
                <SelectItem key="4" value="4">
                  🔥 Máy sưởi
                </SelectItem>
                <SelectItem key="5" value="5">
                  💧 Máy tạo ẩm
                </SelectItem>
                <SelectItem key="6" value="6">
                  💨 Máy hút ẩm
                </SelectItem>
              </Select>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={onSubDeviceModalClose}
            >
              Hủy
            </Button>
            <Button
              color="primary"
              onPress={handleCreateSubDevice}
              isLoading={createSubDeviceMutation.isPending}
              isDisabled={
                !newSubDevice.code || !newSubDevice.name || !newSubDevice.deviceId
              }
            >
              Tạo thiết bị
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Sub-Device Modal */}
      <Modal
        isOpen={isEditSubDeviceModalOpen}
        onClose={onEditSubDeviceModalClose}
        size="lg"
      >
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-bold">✏️ Sửa thông tin thiết bị con</h3>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Mã thiết bị"
                placeholder="Nhập mã thiết bị"
                value={editSubDeviceForm.code}
                onValueChange={(value) =>
                  setEditSubDeviceForm({ ...editSubDeviceForm, code: value })
                }
                isRequired
              />
              <Input
                label="Tên thiết bị"
                placeholder="Nhập tên thiết bị"
                value={editSubDeviceForm.name}
                onValueChange={(value) =>
                  setEditSubDeviceForm({ ...editSubDeviceForm, name: value })
                }
                isRequired
              />
              <Select
                label="Loại thiết bị"
                placeholder="Chọn loại thiết bị"
                selectedKeys={[editSubDeviceForm.type.toString()]}
                onSelectionChange={(keys) => {
                  const selected = parseInt(Array.from(keys)[0] as string);
                  setEditSubDeviceForm({ ...editSubDeviceForm, type: selected });
                }}
              >
                <SelectItem key="1" value="1">
                  🌀 Quạt thông gió
                </SelectItem>
                <SelectItem key="2" value="2">
                  💡 Đèn chiếu sáng
                </SelectItem>
                <SelectItem key="3" value="3">
                  ❄️ Điều hòa
                </SelectItem>
                <SelectItem key="4" value="4">
                  🔥 Máy sưởi
                </SelectItem>
                <SelectItem key="5" value="5">
                  💧 Máy tạo ẩm
                </SelectItem>
                <SelectItem key="6" value="6">
                  💨 Máy hút ẩm
                </SelectItem>
              </Select>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={onEditSubDeviceModalClose}
            >
              Hủy
            </Button>
            <Button
              color="primary"
              onPress={handleUpdateSubDevice}
              isLoading={updateSubDeviceMutation.isPending}
              isDisabled={!editSubDeviceForm.code || !editSubDeviceForm.name}
            >
              Cập nhật
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}