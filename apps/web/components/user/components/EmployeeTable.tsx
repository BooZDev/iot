import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  Chip,
  Button,
  Tooltip,
  Spinner,
} from "@heroui/react";
import { User, Role } from "../EmployeesPage";

interface EmployeeTableProps {
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

export default function EmployeeTable({
  employees,
  warehouses,
  isLoading,
  onView,
  onEdit,
  onDelete,
}: EmployeeTableProps) {
  const getWarehouseName = (warehouseId: string) => {
    const warehouse = warehouses.find((w) => w._id === warehouseId);
    return warehouse?.name || "—";
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
    <Table aria-label="Bảng nhân viên">
      <TableHeader>
        <TableColumn>NHÂN VIÊN</TableColumn>
        <TableColumn>MÃ NV</TableColumn>
        <TableColumn>EMAIL</TableColumn>
        <TableColumn>VAI TRÒ</TableColumn>
        <TableColumn>NHÀ KHO</TableColumn>
        <TableColumn>NGÀY SINH</TableColumn>
        <TableColumn align="center">THAO TÁC</TableColumn>
      </TableHeader>
      <TableBody>
        {employees.map((employee) => (
          <TableRow key={employee._id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar
                  src={employee.avatarUrl}
                  name={employee.fullName || employee.username}
                  size="sm"
                  isBordered
                  color="primary"
                />
                <div>
                  <p className="font-semibold">
                    {employee.fullName || employee.username}
                  </p>
                  <p className="text-xs text-default-400">@{employee.username}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <span className="text-sm font-mono text-default-600">
                #{employee.code}
              </span>
            </TableCell>
            <TableCell>
              <span className="text-sm text-default-600">{employee.email}</span>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {employee.role.map((role) => (
                  <Chip
                    key={role}
                    size="sm"
                    variant="flat"
                    color={getRoleColor(role)}
                    startContent={<span className="text-xs">{getRoleIcon(role)}</span>}
                  >
                    {getRoleLabel(role)}
                  </Chip>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <span className="text-sm">
                {employee.warehouseId ? getWarehouseName(employee.warehouseId) : "—"}
              </span>
            </TableCell>
            <TableCell>
              <span className="text-sm">
                {employee.dateOfBirth
                  ? new Date(employee.dateOfBirth).toLocaleDateString("vi-VN")
                  : "—"}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-center gap-1">
                <Tooltip content="Xem chi tiết">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    color="primary"
                    onPress={() => onView(employee)}
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
                    onPress={() => onEdit(employee)}
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
                    onPress={() => onDelete(employee)}
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