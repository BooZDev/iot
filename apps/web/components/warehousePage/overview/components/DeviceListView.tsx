import {
  Card,
  CardBody,
  Chip,
  Divider,
  Button,
} from "@heroui/react";
import {
  DeviceWithSubDevices,
  DeviceType,
  DeviceState,
  SubDeviceStatus,
} from "../../../../types/device";

interface DeviceListViewProps {
  devices: DeviceWithSubDevices[];
  onStartAddingDevice: () => void;
  onEditDevice: (device: DeviceWithSubDevices) => void;
  onEditSubDevice: (subDevice: any) => void;
  onOpenSubDeviceModal: (deviceId: string) => void;
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

const getSubDeviceInfo = (type: number) => {
  const info: Record<number, { name: string; icon: string; color: string }> = {
    1: { name: "Quạt thông gió", icon: "🌀", color: "primary" },
    2: { name: "Đèn chiếu sáng", icon: "💡", color: "warning" },
    3: { name: "Điều hòa", icon: "❄️", color: "secondary" },
    4: { name: "Máy sưởi", icon: "🔥", color: "danger" },
    5: { name: "Máy tạo ẩm", icon: "💧", color: "success" },
    6: { name: "Máy hút ẩm", icon: "💨", color: "default" }
  };
  return info[type] || { name: "Unknown", icon: "❓", color: "default" };
};

export default function DeviceListView({
  devices,
  onStartAddingDevice,
  onEditDevice,
  onEditSubDevice,
  onOpenSubDeviceModal,
}: DeviceListViewProps) {
  return (
    <div className="p-4">
      <div className="mb-4">
        <Button color="primary" onPress={onStartAddingDevice}>
          ➕ Thêm thiết bị mới
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices.map((device) => (
          <Card key={device._id} className="border border-divider">
            <CardBody className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className={`w-2 h-2 rounded-full ${device.state === DeviceState.ACTIVE
                        ? "bg-success animate-pulse"
                        : device.state === DeviceState.UNAUTHORIZED
                          ? "bg-default-400"
                          : "bg-danger"
                        }`}
                    />
                    <h4 className="font-semibold">{device.name}</h4>
                  </div>
                  <p className="text-sm text-default-500">
                    {getDeviceTypeLabel(device.type)}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    color="primary"
                    variant="light"
                    isIconOnly
                    onPress={() => onEditDevice(device)}
                  >
                    ✏️
                  </Button>
                  <Chip
                    size="sm"
                    color={getDeviceStateColor(device.state)}
                    variant="flat"
                  >
                    {getDeviceStateLabel(device.state)}
                  </Chip>
                </div>
              </div>

              <Divider className="my-2" />

              <div className="space-y-1 text-xs mb-3">
                <div className="flex justify-between">
                  <span className="text-default-500">MAC:</span>
                  <span className="font-mono">{device.mac}</span>
                </div>
                {device.deviceCode && (
                  <div className="flex justify-between">
                    <span className="text-default-500">Mã:</span>
                    <span className="font-medium">{device.deviceCode}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-default-500">Vị trí:</span>
                  <span>
                    {device.locationsInWarehouse.length === 2
                      ? "✅ Có tọa độ"
                      : "❌ Chưa có"}
                  </span>
                </div>
              </div>

              {(device.type === DeviceType.OTHER ||
                device.type === DeviceType.RFID_READER) && (
                  <>
                    <Divider className="my-2" />
                    <Button
                      size="sm"
                      color="primary"
                      variant="flat"
                      className="w-full"
                      onPress={() => onOpenSubDeviceModal(device._id)}
                    >
                      ➕ Thêm thiết bị con
                    </Button>
                  </>
                )}

              {device.subDevices && device.subDevices.length > 0 && (
                <>
                  <Divider className="my-2" />
                  <div>
                    <p className="text-xs font-semibold mb-2">
                      Thiết bị con ({device.subDevices.length})
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {device.subDevices.map((sub) => {
                        const info = getSubDeviceInfo(sub.type);
                        return (
                          <div
                            key={sub._id}
                            className={`p-2 rounded border text-center relative ${sub.status === SubDeviceStatus.ON
                              ? "border-success bg-success-50"
                              : "border-default-200 bg-default-50"
                              }`}
                          >
                            <Button
                              size="sm"
                              color="primary"
                              variant="light"
                              isIconOnly
                              className="absolute top-1 right-1 min-w-6 h-6"
                              onPress={() => onEditSubDevice(sub)}
                            >
                              ✏️
                            </Button>
                            <div className="text-lg mb-1">{info.icon}</div>
                            <p className="text-xs font-medium line-clamp-1">
                              {sub.name}
                            </p>
                            <Chip
                              size="sm"
                              color={
                                sub.status === SubDeviceStatus.ON
                                  ? "success"
                                  : "default"
                              }
                              variant="flat"
                              className="mt-1 text-xs"
                            >
                              {sub.status === SubDeviceStatus.ON ? "ON" : "OFF"}
                            </Chip>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}