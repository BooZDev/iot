import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Avatar,
  Checkbox,
  CheckboxGroup,
} from "@heroui/react";
import { User, Role } from "../EmployeesPage";

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: User | null;
  warehouses: any[];
  onSave: (data: any) => void;
  isLoading: boolean;
}

export default function EmployeeFormModal({
  isOpen,
  onClose,
  employee,
  warehouses,
  onSave,
  isLoading,
}: EmployeeFormModalProps) {
  const [formData, setFormData] = useState({
    code: "",
    username: "",
    email: "",
    password: "",
    dateOfBirth: "",
    fullName: "",
    avatarUrl: "",
    role: [Role.STAFF] as Role[],
    warehouseId: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (employee) {
      setFormData({
        code: employee.code,
        username: employee.username,
        email: employee.email,
        password: "",
        dateOfBirth: employee.dateOfBirth
          ? new Date(employee.dateOfBirth).toISOString().split("T")[0]
          : "",
        fullName: employee.fullName || "",
        avatarUrl: employee.avatarUrl || "",
        role: employee.role,
        warehouseId: employee.warehouseId || "",
      });
    } else {
      setFormData({
        code: "",
        username: "",
        email: "",
        password: "",
        dateOfBirth: "",
        fullName: "",
        avatarUrl: "",
        role: [Role.STAFF],
        warehouseId: "",
      });
    }
    setErrors({});
  }, [employee, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = "Mã nhân viên là bắt buộc";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Tên đăng nhập là bắt buộc";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    // Only validate password when creating new employee
    if (!employee) {
      if (!formData.password.trim()) {
        newErrors.password = "Mật khẩu là bắt buộc";
      } else if (formData.password.length < 6) {
        newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
      }
    }

    if (formData.role.length === 0) {
      newErrors.role = "Phải chọn ít nhất 1 vai trò";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      const submitData = { ...formData };
      
      // Remove password field when editing (not creating)
      if (employee) {
        delete submitData.password;
      }

      // Remove empty fields
      if (!submitData.dateOfBirth) delete submitData.dateOfBirth;
      if (!submitData.fullName) delete submitData.fullName;
      if (!submitData.avatarUrl) delete submitData.avatarUrl;
      if (!submitData.warehouseId) delete submitData.warehouseId;

      onSave(submitData);
    }
  };

  const handleClose = () => {
    setFormData({
      code: "",
      username: "",
      email: "",
      password: "",
      dateOfBirth: "",
      fullName: "",
      avatarUrl: "",
      role: [Role.STAFF],
      warehouseId: "",
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="3xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader>
          <h3 className="text-xl font-bold">
            {employee ? "✏️ Chỉnh sửa nhân viên" : "➕ Thêm nhân viên mới"}
          </h3>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            {/* Avatar Preview */}
            {formData.avatarUrl && (
              <div className="flex justify-center">
                <Avatar
                  src={formData.avatarUrl}
                  name={formData.fullName || formData.username}
                  className="w-24 h-24"
                  isBordered
                  color="primary"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {/* Code */}
              <Input
                label="Mã nhân viên"
                placeholder="NV001"
                value={formData.code}
                onValueChange={(value) =>
                  setFormData({ ...formData, code: value })
                }
                isRequired
                isInvalid={!!errors.code}
                errorMessage={errors.code}
                isDisabled={!!employee}
              />

              {/* Username */}
              <Input
                label="Tên đăng nhập"
                placeholder="johndoe"
                value={formData.username}
                onValueChange={(value) =>
                  setFormData({ ...formData, username: value })
                }
                isRequired
                isInvalid={!!errors.username}
                errorMessage={errors.username}
                isDisabled={!!employee}
              />
            </div>

            {/* Email */}
            <Input
              label="Email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onValueChange={(value) =>
                setFormData({ ...formData, email: value })
              }
              isRequired
              isInvalid={!!errors.email}
              errorMessage={errors.email}
            />

            {/* Password - Only show when creating */}
            {!employee && (
              <Input
                label="Mật khẩu"
                type="password"
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onValueChange={(value) =>
                  setFormData({ ...formData, password: value })
                }
                isRequired
                isInvalid={!!errors.password}
                errorMessage={errors.password}
              />
            )}

            {/* Full Name */}
            <Input
              label="Họ và tên"
              placeholder="Nguyễn Văn A"
              value={formData.fullName}
              onValueChange={(value) =>
                setFormData({ ...formData, fullName: value })
              }
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Date of Birth */}
              <Input
                label="Ngày sinh"
                type="date"
                value={formData.dateOfBirth}
                onValueChange={(value) =>
                  setFormData({ ...formData, dateOfBirth: value })
                }
              />

              {/* Warehouse */}
              <Select
                label="Nhà kho"
                placeholder="Chọn nhà kho"
                selectedKeys={formData.warehouseId ? [formData.warehouseId] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  setFormData({ ...formData, warehouseId: selected || "" });
                }}
              >
                {warehouses.map((warehouse) => (
                  <SelectItem key={warehouse._id} value={warehouse._id}>
                    {warehouse.name}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* Avatar URL */}
            <Input
              label="URL ảnh đại diện"
              placeholder="https://example.com/avatar.jpg"
              value={formData.avatarUrl}
              onValueChange={(value) =>
                setFormData({ ...formData, avatarUrl: value })
              }
            />

            {/* Roles */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Vai trò <span className="text-danger">*</span>
              </label>
              <CheckboxGroup
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value as Role[] })
                }
                isInvalid={!!errors.role}
                errorMessage={errors.role}
              >
                <div className="flex gap-4">
                  <Checkbox value={Role.ADMIN} color="danger">
                    <div className="flex items-center gap-2">
                      <span>👑</span>
                      <span>Admin</span>
                    </div>
                  </Checkbox>
                  <Checkbox value={Role.MANAGER} color="warning">
                    <div className="flex items-center gap-2">
                      <span>⭐</span>
                      <span>Quản lý</span>
                    </div>
                  </Checkbox>
                  <Checkbox value={Role.STAFF} color="success">
                    <div className="flex items-center gap-2">
                      <span>🧑‍💼</span>
                      <span>Nhân viên</span>
                    </div>
                  </Checkbox>
                </div>
              </CheckboxGroup>
            </div>

            {employee && (
              <div className="p-3 bg-warning-50 rounded-lg">
                <p className="text-xs text-warning-600">
                  ⚠️ Lưu ý: Không thể thay đổi mã nhân viên, tên đăng nhập và mật khẩu
                </p>
                <p className="text-xs text-warning-600 mt-1">
                  💡 Để đổi mật khẩu, vui lòng liên hệ quản trị viên hệ thống
                </p>
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={handleClose}>
            Hủy
          </Button>
          <Button color="primary" onPress={handleSubmit} isLoading={isLoading}>
            {employee ? "Cập nhật" : "Tạo mới"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}