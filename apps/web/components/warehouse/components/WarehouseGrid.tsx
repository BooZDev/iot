import {
  Card,
  CardBody,
  Button,
  Tooltip,
  Spinner,
  Chip,
} from "@heroui/react";
import { Warehouse } from "../Warehousespage";
import Link from "next/link";

interface WarehouseGridProps {
  warehouses: Warehouse[];
  isLoading: boolean;
  onView: (warehouse: Warehouse) => void;
  onEdit: (warehouse: Warehouse) => void;
  onDelete: (warehouse: Warehouse) => void;
}

export default function WarehouseGrid({
  warehouses,
  isLoading,
  onView,
  onEdit,
  onDelete,
}: WarehouseGridProps) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {warehouses.map((warehouse) => {
        const hasLocations = warehouse.locations && warehouse.locations.length > 0;
        const isActive = warehouse.isActive !== false;

        return (
          <Card
            key={warehouse._id}
            className="border border-divider hover:border-primary transition-all hover:shadow-lg"
            isPressable
            onPress={() => onView(warehouse)}
          >
            <CardBody className="p-5">
              {/* Warehouse Icon & Name */}
              <div className="flex flex-col items-center mb-4">
                <div className="w-20 h-20 bg-primary-100 rounded-xl flex items-center justify-center mb-3">
                  <span className="text-4xl">🏭</span>
                </div>
                <h3 className="font-bold text-lg text-center">
                  {warehouse.name}
                </h3>
              </div>

              {/* Type & Status */}
              <div className="flex justify-center gap-2 mb-4 flex-wrap">
                <Chip size="sm" variant="flat" color="secondary">
                  {warehouse.type}
                </Chip>
                {hasLocations ? (
                  <Chip
                    size="sm"
                    variant="flat"
                    color="success"
                    startContent={<span>📍</span>}
                  >
                    {warehouse.locations!.length} điểm
                  </Chip>
                ) : (
                  <Chip
                    size="sm"
                    variant="flat"
                    color="warning"
                    startContent={<span>⚠️</span>}
                  >
                    Chưa có tọa độ
                  </Chip>
                )}
                {isActive ? (
                  <Chip size="sm" variant="flat" color="success">
                    ✅ Active
                  </Chip>
                ) : (
                  <Chip size="sm" variant="flat" color="danger">
                    ❌ Inactive
                  </Chip>
                )}
              </div>

              {/* Address */}
              <div className="mb-4">
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-default-400 mt-0.5">📍</span>
                  <span className="text-default-600 flex-1 line-clamp-2">
                    {warehouse.address}
                  </span>
                </div>
              </div>

              {/* Description */}
              {warehouse.description && (
                <div className="mb-4 p-2 bg-default-50 rounded-lg">
                  <p className="text-xs text-default-600 line-clamp-2">
                    {warehouse.description}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-divider">
                <Tooltip content="Dashboard" color="secondary">
                  <Button
                    as={Link}
                    href={`/warehouses/${warehouse._id}`}
                    isIconOnly
                    size="sm"
                    variant="flat"
                    color="secondary"
                  >
                    📊
                  </Button>
                </Tooltip>
                <Tooltip content="Xem chi tiết">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    color="primary"
                    onPress={() => {
                      onView(warehouse);
                    }}
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
                    onPress={() => {
                      onEdit(warehouse);
                    }}
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
                    onPress={() => {
                      onDelete(warehouse);
                    }}
                  >
                    🗑️
                  </Button>
                </Tooltip>
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}