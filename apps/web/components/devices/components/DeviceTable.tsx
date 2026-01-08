import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  Tooltip,
  Spinner,
} from "@heroui/react";
import {
  Device,
  DeviceType,
  DeviceState,
} from "../../../types/device";

interface DeviceTableProps {
  devices: Device[];
  warehouses: any[];
  isLoading: boolean;
  onEdit: (device: Device) => void;
  onDelete: (device: Device) => void;
  onAddSubDevice: (deviceId: string) => void;
}

const getDeviceTypeLabel = (type: DeviceType) => {
  const labels: Record<DeviceType, string> = {
    [DeviceType.GATEWAY]: "Gateway",
    [DeviceType.ENV_SENSOR]: "Cảm biến môi trường",
    [DeviceType.RFID_READER]: "Đầu đọc RFID",
    [DeviceType.OTHER]: "Node điều khiển",
  };
  return labels[type];
};

const getDeviceTypeColor = (type: DeviceType) => {
  const colors: Record<DeviceType, "primary" | "success" | "warning" | "secondary"> = {
    [DeviceType.GATEWAY]: "primary",
    [DeviceType.ENV_SENSOR]: "success",
    [DeviceType.RFID_READER]: "warning",
    [DeviceType.OTHER]: "secondary",
  };
  return colors[type];
};

const getDeviceStateColor = (state: DeviceState) => {
  const colors: Record<DeviceState, "success" | "danger" | "warning" | "default"> = {
    [DeviceState.ACTIVE]: "success",
    [DeviceState.INACTIVE]: "danger",
    [DeviceState.MAINTENANCE]: "warning",
    [DeviceState.UNAUTHORIZED]: "default",
  };
  return colors[state];
};

const getDeviceStateLabel = (state: DeviceState) => {
  const labels: Record<DeviceState, string> = {
    [DeviceState.ACTIVE]: "Hoạt động",
    [DeviceState.INACTIVE]: "Không hoạt động",
    [DeviceState.MAINTENANCE]: "Bảo trì",
    [DeviceState.UNAUTHORIZED]: "Chưa xác thực",
  };
  return labels[state];
};

export default function DeviceTable({
  devices,
  warehouses,
  isLoading,
  onEdit,
  onDelete,
  onAddSubDevice,
}: DeviceTableProps) {
  const getWarehouseName = (warehouseId: string) => {
    const warehouse = warehouses.find((w) => w._id === warehouseId);
    return warehouse?.name || "—";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" label="Đang tải thiết bị..." />
      </div>
    );
  }

  if (devices.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-default-500">Không có thiết bị nào</p>
        <p className="text-sm text-default-400 mt-2">
          Thêm thiết bị mới để bắt đầu
        </p>
      </div>
    );
  }

  return (
    <Table aria-label="Bảng thiết bị">
      <TableHeader>
        <TableColumn>THIẾT BỊ</TableColumn>
        <TableColumn>MÃ THIẾT BỊ</TableColumn>
        <TableColumn>LOẠI</TableColumn>
        <TableColumn>TRẠNG THÁI</TableColumn>
        <TableColumn>NHÀ KHO</TableColumn>
        <TableColumn>MAC ADDRESS</TableColumn>
        <TableColumn align="center">THAO TÁC</TableColumn>
      </TableHeader>
      <TableBody>
        {devices.map((device) => (
          <TableRow key={device._id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${device.state === DeviceState.ACTIVE
                      ? "bg-success animate-pulse"
                      : device.state === DeviceState.UNAUTHORIZED
                        ? "bg-default-400"
                        : "bg-danger"
                    }`}
                />
                <span className="font-semibold">{device.name}</span>
              </div>
            </TableCell>
            <TableCell>
              <span className="text-sm font-mono">
                {device.deviceCode || "—"}
              </span>
            </TableCell>
            <TableCell>
              <Chip
                size="sm"
                variant="flat"
                color={getDeviceTypeColor(device.type)}
              >
                {getDeviceTypeLabel(device.type)}
              </Chip>
            </TableCell>
            <TableCell>
              <Chip
                size="sm"
                variant="flat"
                color={getDeviceStateColor(device.state)}
              >
                {getDeviceStateLabel(device.state)}
              </Chip>
            </TableCell>
            <TableCell>
              <span className="text-sm">
                {getWarehouseName(device.warehouseId)}
              </span>
            </TableCell>
            <TableCell>
              <span className="text-sm font-mono">{device.mac}</span>
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-center gap-1">
                {(device.type === DeviceType.OTHER ||
                  device.type === DeviceType.RFID_READER) && (
                    <Tooltip content="Thêm thiết bị con">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        color="success"
                        onPress={() => onAddSubDevice(device._id)}
                      >
                        ➕
                      </Button>
                    </Tooltip>
                  )}
                <Tooltip content="Sửa">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    color="primary"
                    onPress={() => onEdit(device)}
                  >
                    ✏️
                  </Button>
                </Tooltip>
                <Tooltip content="Xóa" color="danger">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    color="danger"
                    onPress={() => onDelete(device)}
                  >
                    🗑️
                  </Button>
                </Tooltip>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}