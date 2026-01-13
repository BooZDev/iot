/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardBody,
  Avatar,
  Chip,
  Button,
  Tooltip,
  Spinner,
} from "@heroui/react";
import { User, Role } from "../EmployeesPage";

interface EmployeeGridProps {
  employees: User[];
  warehouses: any[];
  isLoading: boolean;
  onView: (employee: User) => void;
  onEdit: (employee: User) => void;
  onDelete: (employee: User) => void;
}

const getRoleColor = (role: Role) => {
  const colors: Record<Role, "danger" | "warning" | "success"> = {
    [Role.ADMIN]: "danger",
    [Role.MANAGER]: "warning",
    [Role.STAFF]: "success",
  };
  return colors[role];
};

const getRoleLabel = (role: Role) => {
  const labels: Record<Role, string> = {
    [Role.ADMIN]: "Admin",
    [Role.MANAGER]: "Quản lý",
    [Role.STAFF]: "Nhân viên",
  };
  return labels[role];
};

const getRoleIcon = (role: Role) => {
  const icons: Record<Role, string> = {
    [Role.ADMIN]: "👑",
    [Role.MANAGER]: "⭐",
    [Role.STAFF]: "🧑‍💼",
  };
  return icons[role];
};

export default function EmployeeGrid({
  employees,
  warehouses,
  isLoading,
  onView,
  onEdit,
  onDelete,
}: EmployeeGridProps) {
  const getWarehouseName = (warehouseId: string) => {
    const warehouse = warehouses.find((w) => w._id === warehouseId);
    return warehouse?.name || "Chưa phân công";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" label="Đang tải nhân viên..." />
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">👥</div>
        <p className="text-lg text-default-500">Không có nhân viên nào</p>
        <p className="text-sm text-default-400 mt-2">
          Thêm nhân viên mới để bắt đầu
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {employees.map((employee) => (
        <Card
          key={employee._id}
          className="border border-divider hover:border-primary transition-all hover:shadow-lg"
          isPressable
          onPress={() => onView(employee)}
        >
          <CardBody className="p-5">
            {/* Avatar & Name */}
            <div className="flex flex-col items-center mb-4">
              <Avatar
                src={employee.avatarUrl}
                name={employee.fullName || employee.username}
                className="w-24 h-24 text-large mb-3 ring-4 ring-primary-100"
                isBordered
                color="primary"
              />
              <h3 className="font-bold text-lg text-center">
                {employee.fullName || employee.username}
              </h3>
              <p className="text-xs text-default-500 font-mono">
                #{employee.code}
              </p>
            </div>

            {/* Roles */}
            <div className="flex flex-wrap gap-1 justify-center mb-4">
              {employee.role.map((role) => (
                <Chip
                  key={role}
                  size="sm"
                  variant="flat"
                  color={getRoleColor(role)}
                  startContent={<span>{getRoleIcon(role)}</span>}
                >
                  {getRoleLabel(role)}
                </Chip>
              ))}
            </div>

            {/* Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-default-400">📧</span>
                <span className="text-default-600 truncate">{employee.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-default-400">👤</span>
                <span className="text-default-600 truncate">
                  {employee.username}
                </span>
              </div>
              {employee.warehouseId && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-default-400">🏭</span>
                  <span className="text-default-600 truncate">
                    {getWarehouseName(employee.warehouseId)}
                  </span>
                </div>
              )}
              {employee.dateOfBirth && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-default-400">🎂</span>
                  <span className="text-default-600">
                    {new Date(employee.dateOfBirth).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-3 border-t border-divider">
              <Tooltip content="Xem chi tiết">
                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  color="primary"
                  onPress={() => {
                    onView(employee);
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
                    onEdit(employee);
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
                    onDelete(employee);
                  }}
                >
                  🗑️
                </Button>
              </Tooltip>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}