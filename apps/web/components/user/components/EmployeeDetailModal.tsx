import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Avatar,
  Chip,
  Card,
  CardBody,
  Divider,
} from "@heroui/react";
import { User, Role } from "../EmployeesPage";

interface EmployeeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: User | null;
  warehouses: any[];
  onEdit: () => void;
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

export default function EmployeeDetailModal({
  isOpen,
  onClose,
  employee,
  warehouses,
  onEdit,
}: EmployeeDetailModalProps) {
  if (!employee) return null;

  const getWarehouseName = (warehouseId: string) => {
    const warehouse = warehouses.find((w) => w._id === warehouseId);
    return warehouse?.name || "Chưa phân công";
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader>
          <h3 className="text-xl font-bold">👤 Thông tin nhân viên</h3>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            {/* Profile Header */}
            <Card className="bg-gradient-to-br from-primary-50 to-primary-100 border-none">
              <CardBody className="p-6">
                <div className="flex items-center gap-6">
                  <Avatar
                    src={employee.avatarUrl}
                    name={employee.fullName || employee.username}
                    className="w-32 h-32 text-4xl ring-4 ring-white"
                    isBordered
                    color="primary"
                  />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">
                      {employee.fullName || employee.username}
                    </h2>
                    <p className="text-default-600 mb-3">@{employee.username}</p>
                    <div className="flex flex-wrap gap-2">
                      {employee.role.map((role) => (
                        <Chip
                          key={role}
                          size="md"
                          variant="solid"
                          color={getRoleColor(role)}
                          startContent={
                            <span className="text-lg">{getRoleIcon(role)}</span>
                          }
                        >
                          {getRoleLabel(role)}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Information Cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Personal Info */}
              <Card className="border border-divider">
                <CardBody className="p-4">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <span>📋</span>
                    <span>Thông tin cá nhân</span>
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-default-500 mb-1">Mã nhân viên</p>
                      <p className="font-mono text-sm font-semibold">
                        #{employee.code}
                      </p>
                    </div>
                    <Divider />
                    <div>
                      <p className="text-xs text-default-500 mb-1">Họ và tên</p>
                      <p className="font-medium text-sm">
                        {employee.fullName || "—"}
                      </p>
                    </div>
                    <Divider />
                    <div>
                      <p className="text-xs text-default-500 mb-1">Ngày sinh</p>
                      <p className="text-sm">
                        {employee.dateOfBirth
                          ? new Date(employee.dateOfBirth).toLocaleDateString(
                              "vi-VN",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )
                          : "—"}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>

                {/* Contact Info */}
              <Card className="border border-divider">
                <CardBody className="p-4">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <span>📧</span>
                    <span>Thông tin liên hệ</span>
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-default-500 mb-1">Email</p>
                      <p className="text-sm break-all">{employee.email}</p>
                    </div>
                    <Divider />
                    <div>
                      <p className="text-xs text-default-500 mb-1">Username</p>
                      <p className="text-sm font-mono">@{employee.username}</p>
                    </div>
                    <Divider />
                    <div>
                      <p className="text-xs text-default-500 mb-1">Mật khẩu</p>
                      <p className="text-sm">••••••••</p>
                      <p className="text-xs text-default-400 mt-1">
                        (Liên hệ quản trị viên để đổi mật khẩu)
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Work Info */}
            <Card className="border border-divider">
              <CardBody className="p-4">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <span>🏭</span>
                  <span>Thông tin công việc</span>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-default-500 mb-1">Nhà kho</p>
                    <p className="font-medium text-sm">
                      {employee.warehouseId
                        ? getWarehouseName(employee.warehouseId)
                        : "Chưa phân công"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-default-500 mb-1">Vai trò</p>
                    <div className="flex flex-wrap gap-1">
                      {employee.role.map((role) => (
                        <Chip
                          key={role}
                          size="sm"
                          variant="flat"
                          color={getRoleColor(role)}
                        >
                          {getRoleLabel(role)}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* System Info */}
            {employee.createdAt && (
              <Card className="border border-divider bg-default-50">
                <CardBody className="p-4">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <span>⏱️</span>
                    <span>Thông tin hệ thống</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-xs text-default-500">
                    <div>
                      <p className="mb-1">Ngày tạo</p>
                      <p className="text-default-700">
                        {new Date(employee.createdAt).toLocaleString("vi-VN")}
                      </p>
                    </div>
                    {employee.updatedAt && (
                      <div>
                        <p className="mb-1">Cập nhật lần cuối</p>
                        <p className="text-default-700">
                          {new Date(employee.updatedAt).toLocaleString("vi-VN")}
                        </p>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="default" variant="light" onPress={onClose}>
            Đóng
          </Button>
          <Button color="primary" onPress={onEdit}>
            ✏️ Chỉnh sửa
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}