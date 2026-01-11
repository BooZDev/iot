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
  Card,
  CardBody,
} from "@heroui/react";
import { OutboundSchedule } from "../CreateProductPage";

interface OutboundSchedulesListProps {
  schedules: OutboundSchedule[];
  products: any[];
  warehouses: any[];
  isLoading: boolean;
  onDelete: (schedule: OutboundSchedule) => void;
}

export default function OutboundSchedulesList({
  schedules,
  products,
  warehouses,
  isLoading,
  onDelete,
}: OutboundSchedulesListProps) {
  const getProductName = (productId: string) => {
    const product = products.find((p) => p._id === productId);
    return product?.name || "—";
  };

  const getProductSKU = (productId: string) => {
    const product = products.find((p) => p._id === productId);
    return product?.skuCode || "—";
  };

  const getWarehouseName = (warehouseId: string) => {
    const warehouse = warehouses.find((w) => w._id === warehouseId);
    return warehouse?.name || "—";
  };

  const isScheduleActive = (schedule: OutboundSchedule) => {
    const now = new Date();
    const start = new Date(schedule.startAt);
    const end = new Date(schedule.endAt);
    return now >= start && now <= end;
  };

  const isScheduleUpcoming = (schedule: OutboundSchedule) => {
    const now = new Date();
    const start = new Date(schedule.startAt);
    return now < start;
  };

  const isScheduleExpired = (schedule: OutboundSchedule) => {
    const now = new Date();
    const end = new Date(schedule.endAt);
    return now > end;
  };

  const getScheduleStatus = (schedule: OutboundSchedule) => {
    if (isScheduleActive(schedule)) {
      return { label: "Đang hoạt động", color: "success" as const, icon: "✅" };
    } else if (isScheduleUpcoming(schedule)) {
      return { label: "Sắp diễn ra", color: "warning" as const, icon: "⏰" };
    } else {
      return { label: "Đã kết thúc", color: "default" as const, icon: "⏹️" };
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" label="Đang tải lịch xuất kho..." />
      </div>
    );
  }

  if (schedules.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">📅</div>
        <p className="text-lg text-default-500">Chưa có lịch xuất kho nào</p>
        <p className="text-sm text-default-400 mt-2">
          Tạo lịch xuất kho mới tại tab "Lập lịch xuất kho"
        </p>
      </div>
    );
  }

  // Sort schedules: Active first, then upcoming, then expired
  const sortedSchedules = [...schedules].sort((a, b) => {
    if (isScheduleActive(a) && !isScheduleActive(b)) return -1;
    if (!isScheduleActive(a) && isScheduleActive(b)) return 1;
    if (isScheduleUpcoming(a) && !isScheduleUpcoming(b)) return -1;
    if (!isScheduleUpcoming(a) && isScheduleUpcoming(b)) return 1;
    return new Date(b.startAt).getTime() - new Date(a.startAt).getTime();
  });

  return (
    <div className="space-y-4">
      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border border-divider">
          <CardBody className="p-4 text-center">
            <p className="text-sm text-default-500 mb-1">Tổng lịch</p>
            <p className="text-3xl font-bold text-primary">{schedules.length}</p>
          </CardBody>
        </Card>
        <Card className="border border-divider">
          <CardBody className="p-4 text-center">
            <p className="text-sm text-default-500 mb-1">Đang hoạt động</p>
            <p className="text-3xl font-bold text-success">
              {schedules.filter(isScheduleActive).length}
            </p>
          </CardBody>
        </Card>
        <Card className="border border-divider">
          <CardBody className="p-4 text-center">
            <p className="text-sm text-default-500 mb-1">Sắp diễn ra</p>
            <p className="text-3xl font-bold text-warning">
              {schedules.filter(isScheduleUpcoming).length}
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Table */}
      <Table aria-label="Bảng lịch xuất kho">
        <TableHeader>
          <TableColumn>SẢN PHẨM</TableColumn>
          <TableColumn>NHÀ KHO</TableColumn>
          <TableColumn>THỜI GIAN BẮT ĐẦU</TableColumn>
          <TableColumn>THỜI GIAN KẾT THÚC</TableColumn>
          <TableColumn>TRẠNG THÁI</TableColumn>
          <TableColumn align="center">THAO TÁC</TableColumn>
        </TableHeader>
        <TableBody>
          {sortedSchedules.map((schedule) => {
            const status = getScheduleStatus(schedule);
            return (
              <TableRow key={schedule._id}>
                <TableCell>
                  <div>
                    <p className="font-semibold">
                      {getProductName(schedule.productId)}
                    </p>
                    <p className="text-xs text-default-500 font-mono">
                      SKU: {getProductSKU(schedule.productId)}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {getWarehouseName(schedule.warehouseId)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p className="font-semibold">
                      {new Date(schedule.startAt).toLocaleDateString("vi-VN")}
                    </p>
                    <p className="text-xs text-default-500">
                      {new Date(schedule.startAt).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p className="font-semibold">
                      {new Date(schedule.endAt).toLocaleDateString("vi-VN")}
                    </p>
                    <p className="text-xs text-default-500">
                      {new Date(schedule.endAt).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Chip
                    size="sm"
                    variant="flat"
                    color={status.color}
                    startContent={<span>{status.icon}</span>}
                  >
                    {status.label}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-1">
                    <Tooltip content="Xóa" color="danger">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        color="danger"
                        onPress={() => onDelete(schedule)}
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
    </div>
  );
}