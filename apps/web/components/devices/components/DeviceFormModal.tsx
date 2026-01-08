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
import {
  Device,
  DeviceType,
  DeviceState,
} from "../../../types/device";

interface DeviceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  device: Device | null;
  warehouses: any[];
  gateways: Device[];
  onSave: (data: any) => void;
  isLoading: boolean;
}

export default function DeviceFormModal({
  isOpen,
  onClose,
  device,
  warehouses,
  gateways,
  onSave,
  isLoading,
}: DeviceFormModalProps) {
  const [formData, setFormData] = useState({
    deviceCode: "",
    name: "",
    type: DeviceType.ENV_SENSOR,
    mac: "",
    warehouseId: "",
    gatewayId: null as string | null,
    state: DeviceState.ACTIVE,
    locationsInWarehouse: [] as number[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (device) {
      setFormData({
        deviceCode: device.deviceCode || "",
        name: device.name,
        type: device.type,
        mac: device.mac,
        warehouseId: device.warehouseId,
        gatewayId: device.gatewayId || null,
        state: device.state,
        locationsInWarehouse: device.locationsInWarehouse || [],
      });
    } else {
      setFormData({
        deviceCode: "",
        name: "",
        type: DeviceType.ENV_SENSOR,
        mac: "",
        warehouseId: "",
        gatewayId: null,
        state: DeviceState.ACTIVE,
        locationsInWarehouse: [],
      });
    }
    setErrors({});
  }, [device, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên thiết bị là bắt buộc";
    }

    if (!formData.mac.trim()) {
      newErrors.mac = "Địa chỉ MAC là bắt buộc";
    }

    if (!formData.warehouseId) {
      newErrors.warehouseId = "Nhà kho là bắt buộc";
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
      deviceCode: "",
      name: "",
      type: DeviceType.ENV_SENSOR,
      mac: "",
      warehouseId: "",
      gatewayId: null,
      state: DeviceState.ACTIVE,
      locationsInWarehouse: [],
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
            {device ? "✏️ Sửa thiết bị" : "➕ Thêm thiết bị mới"}
          </h3>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Input
              label="Mã thiết bị"
              placeholder="Nhập mã thiết bị"
              value={formData.deviceCode}
              onValueChange={(value) =>
                setFormData({ ...formData, deviceCode: value })
              }
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

            <Input
              label="Địa chỉ MAC"
              placeholder="Nhập địa chỉ MAC"
              value={formData.mac}
              onValueChange={(value) =>
                setFormData({ ...formData, mac: value })
              }
              isRequired
              isInvalid={!!errors.mac}
              errorMessage={errors.mac}
            />

            <Select
              label="Loại thiết bị"
              placeholder="Chọn loại thiết bị"
              selectedKeys={[formData.type]}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as DeviceType;
                setFormData({ ...formData, type: selected });
              }}
              isRequired
              isDisabled={!!device}
            >
              <SelectItem key={DeviceType.GATEWAY} value={DeviceType.GATEWAY}>
                Gateway
              </SelectItem>
              <SelectItem
                key={DeviceType.ENV_SENSOR}
                value={DeviceType.ENV_SENSOR}
              >
                Cảm biến môi trường
              </SelectItem>
              <SelectItem
                key={DeviceType.RFID_READER}
                value={DeviceType.RFID_READER}
              >
                Đầu đọc RFID
              </SelectItem>
              <SelectItem key={DeviceType.OTHER} value={DeviceType.OTHER}>
                Node điều khiển
              </SelectItem>
            </Select>

            <Select
              label="Nhà kho"
              placeholder="Chọn nhà kho"
              selectedKeys={formData.warehouseId ? [formData.warehouseId] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                setFormData({ ...formData, warehouseId: selected });
              }}
              isRequired
              isInvalid={!!errors.warehouseId}
              errorMessage={errors.warehouseId}
            >
              {warehouses.map((warehouse) => (
                <SelectItem key={warehouse._id} value={warehouse._id}>
                  {warehouse.name}
                </SelectItem>
              ))}
            </Select>

            {formData.type !== DeviceType.GATEWAY && gateways.length > 0 && (
              <Select
                label="Gateway kết nối"
                placeholder="Chọn gateway (tùy chọn)"
                selectedKeys={formData.gatewayId ? [formData.gatewayId] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  setFormData({ ...formData, gatewayId: selected || null });
                }}
              >
                {gateways.map((gateway) => (
                  <SelectItem key={gateway._id} value={gateway._id}>
                    {gateway.name}
                  </SelectItem>
                ))}
              </Select>
            )}

            {device && (
              <Select
                label="Trạng thái"
                placeholder="Chọn trạng thái"
                selectedKeys={[formData.state]}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as DeviceState;
                  setFormData({ ...formData, state: selected });
                }}
              >
                <SelectItem key={DeviceState.ACTIVE} value={DeviceState.ACTIVE}>
                  Hoạt động
                </SelectItem>
                <SelectItem
                  key={DeviceState.INACTIVE}
                  value={DeviceState.INACTIVE}
                >
                  Không hoạt động
                </SelectItem>
                <SelectItem
                  key={DeviceState.MAINTENANCE}
                  value={DeviceState.MAINTENANCE}
                >
                  Bảo trì
                </SelectItem>
                <SelectItem
                  key={DeviceState.UNAUTHORIZED}
                  value={DeviceState.UNAUTHORIZED}
                >
                  Chưa xác thực
                </SelectItem>
              </Select>
            )}

            {device && formData.locationsInWarehouse.length === 2 && (
              <div className="p-3 bg-default-100 rounded">
                <p className="text-sm font-semibold mb-1">📍 Vị trí trên bản đồ:</p>
                <p className="text-xs font-mono">
                  Lng: {formData.locationsInWarehouse[0]?.toFixed(6)}, Lat:{" "}
                  {formData.locationsInWarehouse[1]?.toFixed(6)}
                </p>
                <p className="text-xs text-default-500 mt-1">
                  * Thay đổi vị trí trên trang chi tiết nhà kho
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
            {device ? "Cập nhật" : "Tạo mới"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}