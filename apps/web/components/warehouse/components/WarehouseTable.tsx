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
import { Warehouse } from "../Warehousespage";

interface WarehouseTableProps {
  warehouses: Warehouse[];
  isLoading: boolean;
  onView: (warehouse: Warehouse) => void;
  onEdit: (warehouse: Warehouse) => void;
  onDelete: (warehouse: Warehouse) => void;
}

export default function WarehouseTable({
  warehouses,
  isLoading,
  onView,
  onEdit,
  onDelete,
}: WarehouseTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" label="Đang tải nhà kho..." />
      </div>
    );
  }

  if (warehouses.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🏭</div>
        <p className="text-lg text-default-500">Không có nhà kho nào</p>
        <p className="text-sm text-default-400 mt-2">
          Thêm nhà kho mới để bắt đầu
        </p>
      </div>
    );
  }

  return (
    <Table aria-label="Bảng nhà kho">
      <TableHeader>
        <TableColumn>NHÀ KHO</TableColumn>
        <TableColumn>MÃ NHÀ KHO</TableColumn>
        <TableColumn>LOẠI</TableColumn>
        <TableColumn>ĐỊA CHỈ</TableColumn>
        <TableColumn>TỌA ĐỘ</TableColumn>
        <TableColumn>TRẠNG THÁI</TableColumn>
        <TableColumn align="center">THAO TÁC</TableColumn>
      </TableHeader>
      <TableBody>
        {warehouses.map((warehouse) => {
          const hasLocations =
            warehouse.locations && warehouse.locations.length > 0;
          const isActive = warehouse.isActive !== false;

          return (
            <TableRow key={warehouse._id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🏭</span>
                  </div>
                  <div>
                    <p className="font-semibold">{warehouse.name}</p>
                    {warehouse.description && (
                      <p className="text-xs text-default-500 line-clamp-1">
                        {warehouse.description}
                      </p>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="font-mono">{warehouse.warehouseCode}</span>
              </TableCell>
              <TableCell>
                <Chip size="sm" variant="flat" color="secondary">
                  {warehouse.type}
                </Chip>
              </TableCell>
              <TableCell>
                <span className="text-sm line-clamp-2">
                  {warehouse.address}
                </span>
              </TableCell>
              <TableCell>
                {hasLocations ? (
                  <div>
                    <Chip
                      size="sm"
                      variant="flat"
                      color="success"
                      startContent={<span>📍</span>}
                    >
                      {warehouse.locations!.length} điểm
                    </Chip>
                    <p className="text-xs text-default-500 mt-1">
                      Polygon coordinates
                    </p>
                  </div>
                ) : (
                  <Chip
                    size="sm"
                    variant="flat"
                    color="warning"
                    startContent={<span>⚠️</span>}
                  >
                    Chưa có
                  </Chip>
                )}
              </TableCell>
              <TableCell>
                {isActive ? (
                  <Chip size="sm" variant="flat" color="success">
                    ✅ Active
                  </Chip>
                ) : (
                  <Chip size="sm" variant="flat" color="danger">
                    ❌ Inactive
                  </Chip>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-1">
                  <Tooltip content="Xem chi tiết">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      color="primary"
                      onPress={() => onView(warehouse)}
                    >
                      👁️
                    </Button>
                  </Tooltip>
                  <Tooltip content="Chỉnh sửa">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      color="warning"
                      onPress={() => onEdit(warehouse)}
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
                      onPress={() => onDelete(warehouse)}
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