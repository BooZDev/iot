import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Switch,
  Card,
  CardBody,
} from "@heroui/react";
import { Warehouse } from "../Warehousespage";

interface WarehouseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  warehouse: Warehouse | null;
  onSave: (data: any) => void;
  isLoading: boolean;
}

export default function WarehouseFormModal({
  isOpen,
  onClose,
  warehouse,
  onSave,
  isLoading,
}: WarehouseFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    address: "",
    description: "",
    imageUrl: "",
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (warehouse) {
      setFormData({
        name: warehouse.name,
        type: warehouse.type,
        address: warehouse.address,
        description: warehouse.description || "",
        imageUrl: warehouse.imageUrl || "",
        isActive: warehouse.isActive !== false,
      });
    } else {
      setFormData({
        name: "",
        type: "",
        address: "",
        description: "",
        imageUrl: "",
        isActive: true,
      });
    }
    setErrors({});
  }, [warehouse, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên nhà kho là bắt buộc";
    }

    if (!formData.type.trim()) {
      newErrors.type = "Loại nhà kho là bắt buộc";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Địa chỉ là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      const submitData: any = {
        name: formData.name,
        type: formData.type,
        address: formData.address,
        isActive: formData.isActive,
      };

      if (formData.description.trim()) {
        submitData.description = formData.description;
      }

      if (formData.imageUrl.trim()) {
        submitData.imageUrl = formData.imageUrl;
      }

      onSave(submitData);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      type: "",
      address: "",
      description: "",
      imageUrl: "",
      isActive: true,
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader>
          <h3 className="text-xl font-bold">
            {warehouse ? "✏️ Chỉnh sửa nhà kho" : "➕ Thêm nhà kho mới"}
          </h3>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            {/* Warehouse Name */}
            <Input
              label="Tên nhà kho"
              placeholder="Nhập tên nhà kho"
              value={formData.name}
              onValueChange={(value) =>
                setFormData({ ...formData, name: value })
              }
              isRequired
              isInvalid={!!errors.name}
              errorMessage={errors.name}
              startContent={<span className="text-default-400">🏭</span>}
            />

            {/* Type */}
            <Input
              label="Loại nhà kho"
              placeholder="VD: Đông lạnh, Kho khô, Kho phân phối"
              value={formData.type}
              onValueChange={(value) =>
                setFormData({ ...formData, type: value })
              }
              isRequired
              isInvalid={!!errors.type}
              errorMessage={errors.type}
              startContent={<span className="text-default-400">🗂️</span>}
            />

            {/* Address */}
            <Textarea
              label="Địa chỉ"
              placeholder="Nhập địa chỉ đầy đủ"
              value={formData.address}
              onValueChange={(value) =>
                setFormData({ ...formData, address: value })
              }
              isRequired
              isInvalid={!!errors.address}
              errorMessage={errors.address}
              minRows={2}
            />

            {/* Description */}
            <Textarea
              label="Mô tả"
              placeholder="Mô tả chi tiết về nhà kho (tùy chọn)"
              value={formData.description}
              onValueChange={(value) =>
                setFormData({ ...formData, description: value })
              }
              minRows={3}
            />

            {/* Image URL */}
            <Input
              label="URL hình ảnh"
              placeholder="https://example.com/image.jpg (tùy chọn)"
              value={formData.imageUrl}
              onValueChange={(value) =>
                setFormData({ ...formData, imageUrl: value })
              }
              startContent={<span className="text-default-400">🖼️</span>}
            />

            {/* Active Status */}
            <div className="flex items-center justify-between p-3 bg-default-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Trạng thái hoạt động</p>
                <p className="text-xs text-default-500">
                  Nhà kho có đang hoạt động không?
                </p>
              </div>
              <Switch
                isSelected={formData.isActive}
                onValueChange={(value) =>
                  setFormData({ ...formData, isActive: value })
                }
                color="success"
              />
            </div>

            {/* Info Box */}
            <Card className="bg-primary-50 border-none">
              <CardBody className="p-4">
                <p className="text-sm text-primary-700">
                  <span className="font-semibold">📍 Lưu ý về tọa độ:</span>
                  <br />
                  Tọa độ bản đồ (locations) không được quản lý ở đây.
                  <br />
                  Vui lòng truy cập trang <strong>"Bản đồ nhà kho"</strong> để
                  cập nhật tọa độ polygon cho nhà kho.
                </p>
              </CardBody>
            </Card>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={handleClose}>
            Hủy
          </Button>
          <Button color="primary" onPress={handleSubmit} isLoading={isLoading}>
            {warehouse ? "✅ Cập nhật" : "✅ Tạo mới"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}