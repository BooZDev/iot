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
} from "@heroui/react";

interface SubDeviceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  subDevice: any | null;
  devices: any[];
  selectedDeviceId: string;
  onSave: (data: any) => void;
  isLoading: boolean;
}

export default function SubDeviceFormModal({
  isOpen,
  onClose,
  subDevice,
  devices,
  selectedDeviceId,
  onSave,
  isLoading,
}: SubDeviceFormModalProps) {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    type: 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (subDevice) {
      setFormData({
        code: subDevice.code,
        name: subDevice.name,
        type: subDevice.type,
      });
    } else {
      setFormData({
        code: "",
        name: "",
        type: 1,
      });
    }
    setErrors({});
  }, [subDevice, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = "Mã thiết bị là bắt buộc";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Tên thiết bị là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave(formData);
    }
  };

  const handleClose = () => {
    setFormData({
      code: "",
      name: "",
      type: 1,
    });
    setErrors({});
    onClose();
  };

  const getDeviceName = (deviceId: string) => {
    const device = devices.find((d) => d._id === deviceId);
    return device?.name || "";
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
    >
      <ModalContent>
        <ModalHeader>
          <h3 className="text-xl font-bold">
            {subDevice ? "✏️ Sửa thiết bị con" : "➕ Thêm thiết bị con"}
          </h3>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            {!subDevice && selectedDeviceId && (
              <div className="p-3 bg-primary-50 rounded-lg">
                <p className="text-sm font-semibold text-primary">
                  Thiết bị chính: {getDeviceName(selectedDeviceId)}
                </p>
              </div>
            )}

            <Input
              label="Mã thiết bị"
              placeholder="Nhập mã thiết bị"
              value={formData.code}
              onValueChange={(value) =>
                setFormData({ ...formData, code: value })
              }
              isRequired
              isInvalid={!!errors.code}
              errorMessage={errors.code}
            />

            <Input
              label="Tên thiết bị"
              placeholder="Nhập tên thiết bị"
              value={formData.name}
              onValueChange={(value) =>
                setFormData({ ...formData, name: value })
              }
              isRequired
              isInvalid={!!errors.name}
              errorMessage={errors.name}
            />

            <Select
              label="Loại thiết bị"
              placeholder="Chọn loại thiết bị"
              selectedKeys={[formData.type.toString()]}
              onSelectionChange={(keys) => {
                const selected = parseInt(Array.from(keys)[0] as string);
                setFormData({ ...formData, type: selected });
              }}
              isRequired
            >
              <SelectItem key="1" value="1">
                🌀 Quạt thông gió
              </SelectItem>
              <SelectItem key="2" value="2">
                💡 Đèn chiếu sáng
              </SelectItem>
              <SelectItem key="3" value="3">
                ❄️ Điều hòa
              </SelectItem>
              <SelectItem key="4" value="4">
                🔥 Máy sưởi
              </SelectItem>
              <SelectItem key="5" value="5">
                💧 Máy tạo ẩm
              </SelectItem>
              <SelectItem key="6" value="6">
                💨 Máy hút ẩm
              </SelectItem>
            </Select>

            {subDevice && (
              <div className="p-3 bg-default-100 rounded">
                <p className="text-sm font-semibold mb-1">ℹ️ Thông tin:</p>
                <p className="text-xs text-default-500">
                  Trạng thái ON/OFF có thể thay đổi trên trang chi tiết nhà kho
                </p>
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={handleClose}>
            Hủy
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isLoading={isLoading}
          >
            {subDevice ? "Cập nhật" : "Tạo mới"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}