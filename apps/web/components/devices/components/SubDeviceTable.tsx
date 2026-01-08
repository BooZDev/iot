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
import { SubDeviceStatus } from "../../../types/device";

interface SubDeviceTableProps {
  subDevices: any[];
  devices: any[];
  isLoading: boolean;
  onEdit: (subDevice: any) => void;
  onDelete: (subDevice: any) => void;
}

const getSubDeviceInfo = (type: number) => {
  const info: Record<number, { name: string; icon: string; color: string }> = {
    1: { name: "Quạt thông gió", icon: "🌀", color: "primary" },
    2: { name: "Đèn chiếu sáng", icon: "💡", color: "warning" },
    3: { name: "Điều hòa", icon: "❄️", color: "secondary" },
    4: { name: "Máy sưởi", icon: "🔥", color: "danger" },
    5: { name: "Máy tạo ẩm", icon: "💧", color: "success" },
    6: { name: "Máy hút ẩm", icon: "💨", color: "default" },
  };
  return info[type] || { name: "Unknown", icon: "❓", color: "default" };
};

export default function SubDeviceTable({
  subDevices,
  devices,
  isLoading,
  onEdit,
  onDelete,
}: SubDeviceTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" label="Đang tải thiết bị con..." />
      </div>
    );
  }

  if (subDevices.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-default-500">Không có thiết bị con nào</p>
        <p className="text-sm text-default-400 mt-2">
          Thêm thiết bị con vào các node điều khiển hoặc RFID
        </p>
      </div>
    );
  }

  return (
    <Table aria-label="Bảng thiết bị con">
      <TableHeader>
        <TableColumn>THIẾT BỊ CON</TableColumn>
        <TableColumn>MÃ THIẾT BỊ</TableColumn>
        <TableColumn>LOẠI</TableColumn>
        <TableColumn>TRẠNG THÁI</TableColumn>
        <TableColumn>THIẾT BỊ CHÍNH</TableColumn>
        <TableColumn align="center">THAO TÁC</TableColumn>
      </TableHeader>
      <TableBody>
        {subDevices.map((subDevice) => {
          const info = getSubDeviceInfo(subDevice.type);
          return (
            <TableRow key={subDevice._id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{info.icon}</span>
                  <span className="font-semibold">{subDevice.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm font-mono">{subDevice.code}</span>
              </TableCell>
              <TableCell>
                <Chip
                  size="sm"
                  variant="flat"
                  color={info.color as any}
                >
                  {info.name}
                </Chip>
              </TableCell>
              <TableCell>
                <Chip
                  size="sm"
                  variant="flat"
                  color={
                    subDevice.status === SubDeviceStatus.ON
                      ? "success"
                      : "default"
                  }
                >
                  {subDevice.status === SubDeviceStatus.ON ? "ON" : "OFF"}
                </Chip>
              </TableCell>
              <TableCell>
                <span className="text-sm">{subDevice.deviceName}</span>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-1">
                  <Tooltip content="Sửa">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      color="primary"
                      onPress={() => onEdit(subDevice)}
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
                      onPress={() => onDelete(subDevice)}
                    >
                      🗑️
                    </Button>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}