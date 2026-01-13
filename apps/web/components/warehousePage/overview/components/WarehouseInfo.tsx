import {
  Card,
  CardHeader,
  CardBody,
  Chip,
  Divider,
  Button,
} from "@heroui/react";
import {
  Device,
  DeviceWithSubDevices,
  Warehouse,
  DeviceType,
  DeviceState,
  SubDeviceStatus,
} from "../../../../types/device";

interface WarehouseInfoProps {
  warehouse: Warehouse | undefined;
  devices: Device[];
  devicesWithSubs: DeviceWithSubDevices[];
  onEditWarehouse: () => void;
  onEditDevice: (device: Device) => void;
}

const getDeviceTypeLabel = (type: DeviceType) => {
  const labels: Record<DeviceType, string> = {
    [DeviceType.GATEWAY]: "Gateway",
    [DeviceType.ENV_SENSOR]: "Cảm biến môi trường",
    [DeviceType.RFID_READER]: "Đầu đọc RFID",
    [DeviceType.OTHER]: "Node điều khiển"
  };
  return labels[type];
};

const getDeviceStateColor = (state: DeviceState) => {
  const colors: Record<DeviceState, "success" | "danger" | "warning" | "default"> = {
    [DeviceState.ACTIVE]: "success",
    [DeviceState.INACTIVE]: "danger",
    [DeviceState.MAINTENANCE]: "warning",
    [DeviceState.UNAUTHORIZED]: "default"
  };
  return colors[state];
};

const getDeviceStateLabel = (state: DeviceState) => {
  const labels: Record<DeviceState, string> = {
    [DeviceState.ACTIVE]: "Hoạt động",
    [DeviceState.INACTIVE]: "Không hoạt động",
    [DeviceState.MAINTENANCE]: "Bảo trì",
    [DeviceState.UNAUTHORIZED]: "Chưa xác thực"
  };
  return labels[state];
};

export default function WarehouseInfo({
  warehouse,
  devices,
  devicesWithSubs,
  onEditWarehouse,
  onEditDevice,
}: WarehouseInfoProps) {
  const activeDevices = devices.filter((d) => d.state === DeviceState.ACTIVE).length;
  const totalSubDevices = devicesWithSubs.reduce(
    (acc, d) => acc + (d.subDevices?.length || 0),
    0
  );
  const activeSubDevices: number = devicesWithSubs.reduce(
    (acc: number, d: DeviceWithSubDevices) =>
      acc + (d.subDevices?.filter((s: { status: SubDeviceStatus }) => s.status === SubDeviceStatus.ON).length || 0),
    0
  );

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Warehouse Information Card */}
        <Card className="border border-divider">
          <CardHeader className="flex justify-between">
            <h3 className="text-lg font-semibold">📦 Thông tin nhà kho</h3>
            <Button
              size="sm"
              color="primary"
              variant="flat"
              onPress={onEditWarehouse}
            >
              ✏️ Sửa
            </Button>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <p className="text-sm text-default-500 mb-1">Tên nhà kho</p>
              <p className="font-semibold">{warehouse?.name || "—"}</p>
            </div>
            <Divider />
            <div>
              <p className="text-sm text-default-500 mb-1">Địa chỉ</p>
              <p className="font-medium">{warehouse?.address || "—"}</p>
            </div>
            <Divider />
            <div>
              <p className="text-sm text-default-500 mb-1">Mô tả</p>
              <p className="text-sm">
                {warehouse?.description || "Chưa có mô tả"}
              </p>
            </div>
            <Divider />
          </CardBody>
        </Card>

        {/* Statistics Card */}
        <Card className="border border-divider">
          <CardHeader>
            <h3 className="text-lg font-semibold">📊 Thống kê</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-primary-50 rounded-lg">
                <p className="text-sm text-default-500 mb-1">Tổng thiết bị</p>
                <p className="text-2xl font-bold text-primary">
                  {devices.length}
                </p>
              </div>
              <div className="p-4 bg-success-50 rounded-lg">
                <p className="text-sm text-default-500 mb-1">Đang hoạt động</p>
                <p className="text-2xl font-bold text-success">
                  {activeDevices}
                </p>
              </div>
              <div className="p-4 bg-secondary-50 rounded-lg">
                <p className="text-sm text-default-500 mb-1">Thiết bị con</p>
                <p className="text-2xl font-bold text-secondary">
                  {totalSubDevices}
                </p>
              </div>
              <div className="p-4 bg-warning-50 rounded-lg">
                <p className="text-sm text-default-500 mb-1">TB con đang bật</p>
                <p className="text-2xl font-bold text-warning">
                  {activeSubDevices}
                </p>
              </div>
            </div>
            <Divider />
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Gateway</span>
                <Chip size="sm" color="primary" variant="flat">
                  {devices.filter((d) => d.type === DeviceType.GATEWAY).length}
                </Chip>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Cảm biến môi trường</span>
                <Chip size="sm" color="success" variant="flat">
                  {devices.filter((d) => d.type === DeviceType.ENV_SENSOR).length}
                </Chip>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Node điều khiển</span>
                <Chip size="sm" color="secondary" variant="flat">
                  {devices.filter((d) => d.type === DeviceType.OTHER).length}
                </Chip>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Đầu đọc RFID</span>
                <Chip size="sm" color="warning" variant="flat">
                  {devices.filter((d) => d.type === DeviceType.RFID_READER).length}
                </Chip>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recent Devices */}
      <Card className="border border-divider mt-6">
        <CardHeader>
          <h3 className="text-lg font-semibold">🔧 Thiết bị gần đây</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            {devicesWithSubs.slice(0, 5).map((device) => (
              <div
                key={device._id}
                className="flex items-center justify-between p-3 bg-default-50 rounded-lg hover:bg-default-100 transition-colors"
              >
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
                    <p className="font-semibold">{device.name}</p>
                    <p className="text-xs text-default-500">
                      {getDeviceTypeLabel(device.type)} • {device.mac}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {device.subDevices && device.subDevices.length > 0 && (
                    <Chip size="sm" variant="flat" color="secondary">
                      {device.subDevices.length} TB con
                    </Chip>
                  )}
                  <Chip
                    size="sm"
                    color={getDeviceStateColor(device.state)}
                    variant="flat"
                  >
                    {getDeviceStateLabel(device.state)}
                  </Chip>
                  <Button
                    size="sm"
                    color="primary"
                    variant="light"
                    onPress={() => onEditDevice(device)}
                  >
                    ✏️
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}