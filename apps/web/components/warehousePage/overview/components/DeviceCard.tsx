import {
  Card,
  CardBody,
  Chip,
  Divider,
  Button,
} from "@heroui/react";
import {
  Device,
  DeviceWithSubDevices,
  DeviceType,
  DeviceState,
  SubDeviceStatus,
} from "../../../../types/device";

interface DeviceCardProps {
  device: DeviceWithSubDevices;
  isSelected: boolean;
  onDeviceClick: (device: Device) => void;
  onEditDevice: (device: Device) => void;
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

export default function DeviceCard({
  device,
  isSelected,
  onDeviceClick,
  onEditDevice,
  onEditSubDevice,
  onOpenSubDeviceModal,
}: DeviceCardProps) {
  return (
    <Card
      isPressable
      className={`border transition-all w-full ${isSelected
        ? "border-primary bg-primary-50 shadow-md"
        : "border-divider hover:border-primary/50"
        }`}
      onPress={() => onDeviceClick(device)}
    >
      <CardBody className="p-3">
        <div className="flex items-start justify-between mb-2">
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
              <h4 className="font-semibold text-sm line-clamp-1">
                {device.name}
              </h4>
            </div>
            <p className="text-xs text-default-500">
              {getDeviceTypeLabel(device.type)}
            </p>
          </div>
          <div className="flex gap-1">
            <Button
              size="sm"
              color="primary"
              variant="light"
              isIconOnly
              onPress={(e) => {
                onEditDevice(device);
              }}
            >
              ✏️
            </Button>
            <Chip
              size="sm"
              color={getDeviceStateColor(device.state)}
              variant="flat"
              className="text-xs"
            >
              {getDeviceStateLabel(device.state)}
            </Chip>
          </div>
        </div>

        {device.subDevices && device.subDevices.length > 0 && (
          <>
            <Divider className="my-2" />
            <div className="space-y-1.5">
              {device.subDevices.slice(0, 3).map((sub) => {
                const info = getSubDeviceInfo(sub.type);
                return (
                  <div
                    key={sub._id}
                    className="flex items-center justify-between p-2 bg-default-100 rounded text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span>{info.icon}</span>
                      <span className="font-medium line-clamp-1">
                        {sub.name}
                      </span>
                    </div>
                    <Chip
                      size="sm"
                      color={
                        sub.status === SubDeviceStatus.ON ? "success" : "default"
                      }
                      variant="flat"
                      className="text-xs min-w-[40px]"
                    >
                      {sub.status === SubDeviceStatus.ON ? "ON" : "OFF"}
                    </Chip>
                  </div>
                );
              })}
              {device.subDevices.length > 3 && (
                <p className="text-xs text-default-400 text-center">
                  +{device.subDevices.length - 3} thiết bị khác
                </p>
              )}
            </div>
          </>
        )}

        {(device.type === DeviceType.OTHER ||
          device.type === DeviceType.RFID_READER) && (
            <>
              <Divider className="my-2" />
              <Button
                size="sm"
                color="primary"
                variant="flat"
                className="w-full"
                onPress={(e) => {
                  onOpenSubDeviceModal(device._id);
                }}
              >
                ➕ Thêm thiết bị con
              </Button>
            </>
          )}
      </CardBody>
    </Card>
  );
}