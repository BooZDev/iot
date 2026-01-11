import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Select,
  SelectItem,
  Button,
  Input,
  Chip,
} from "@heroui/react";

interface OutboundTransactionFormProps {
  products: any[];
  warehouses: any[];
  devices: any[];
  schedules: any[];
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
}

export default function OutboundTransactionForm({
  products,
  warehouses,
  devices,
  schedules,
  onSubmit,
  isLoading,
}: OutboundTransactionFormProps) {
  const [formData, setFormData] = useState({
    productId: "",
    warehouseId: "",
    quantity: "",
    transactionType: "OUT",
    rfidTagId: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [scheduleStatus, setScheduleStatus] = useState<{
    canExport: boolean;
    message: string;
  }>({ canExport: false, message: "" });

  // Check schedule when product and warehouse are selected
  useEffect(() => {
    if (formData.productId && formData.warehouseId) {
      checkSchedule();
    } else {
      setScheduleStatus({ canExport: false, message: "" });
    }
  }, [formData.productId, formData.warehouseId]);

  const checkSchedule = () => {
    const now = new Date();
    const relevantSchedule = schedules.find(
      (s: any) =>
        s.productId === formData.productId &&
        s.warehouseId === formData.warehouseId
    );

    if (!relevantSchedule) {
      setScheduleStatus({
        canExport: false,
        message: "❌ Sản phẩm này chưa được đặt lịch xuất kho",
      });
      return;
    }

    const startTime = new Date(relevantSchedule.startAt);
    const endTime = new Date(relevantSchedule.endAt);

    if (now < startTime) {
      setScheduleStatus({
        canExport: false,
        message: `⏰ Chưa đến thời gian xuất kho. Bắt đầu: ${startTime.toLocaleString(
          "vi-VN"
        )}`,
      });
    } else if (now > endTime) {
      setScheduleStatus({
        canExport: false,
        message: `⏹️ Đã hết thời gian xuất kho. Kết thúc: ${endTime.toLocaleString(
          "vi-VN"
        )}`,
      });
    } else {
      setScheduleStatus({
        canExport: true,
        message: `✅ Trong thời gian xuất kho. Kết thúc: ${endTime.toLocaleString(
          "vi-VN"
        )}`,
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.productId) {
      newErrors.productId = "Sản phẩm là bắt buộc";
    }

    if (!formData.warehouseId) {
      newErrors.warehouseId = "Nhà kho là bắt buộc";
    }

    if (!scheduleStatus.canExport) {
      newErrors.schedule = "Không thể xuất kho lúc này";
    }

    if (!formData.quantity) {
      newErrors.quantity = "Số lượng là bắt buộc";
    } else if (parseInt(formData.quantity) <= 0) {
      newErrors.quantity = "Số lượng phải lớn hơn 0";
    }

    if (!formData.rfidTagId) {
      newErrors.rfidTagId = "RFID Tag là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      try {
        await onSubmit({
          ...formData,
          quantity: parseInt(formData.quantity),
        });
        // Reset form
        setFormData({
          productId: "",
          warehouseId: "",
          quantity: "",
          transactionType: "OUT",
          rfidTagId: "",
        });
        setErrors({});
        setScheduleStatus({ canExport: false, message: "" });
      } catch (error) {
        console.error("Error creating outbound transaction:", error);
      }
    }
  };

  const selectedProduct = products.find((p) => p._id === formData.productId);

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-2 border-secondary">
        <CardBody className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-secondary-100 rounded-xl flex items-center justify-center">
              <span className="text-4xl">📤</span>
            </div>
            <div>
              <h3 className="text-xl font-bold">Xuất sản phẩm khỏi kho</h3>
              <p className="text-sm text-default-500">
                Chỉ xuất được trong khung thời gian đã đặt lịch
              </p>
            </div>
          </div>

          {products.length === 0 && (
            <Card className="bg-warning-50 border-none mb-4">
              <CardBody className="p-4">
                <p className="text-sm text-warning-700 text-center">
                  ⚠️ Hiện không có sản phẩm nào sẵn sàng để xuất kho
                </p>
              </CardBody>
            </Card>
          )}

          <div className="space-y-4">
            {/* Product Selection */}
            <Select
              label="Sản phẩm"
              placeholder="Chọn sản phẩm cần xuất kho"
              selectedKeys={formData.productId ? [formData.productId] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                setFormData({ ...formData, productId: selected });
              }}
              isRequired
              isInvalid={!!errors.productId}
              errorMessage={errors.productId}
              startContent={<span className="text-default-400">📦</span>}
            >
              {products.map((product: any) => (
                <SelectItem key={product._id} value={product._id}>
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <span className="font-semibold">{product.name}</span>
                      <span className="text-xs text-default-500 ml-2">
                        ({product.skuCode})
                      </span>
                    </div>
                    <Chip size="sm" variant="flat" color="secondary">
                      READY_OUT
                    </Chip>
                  </div>
                </SelectItem>
              ))}
            </Select>

            {/* Warehouse Selection */}
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
              startContent={<span className="text-default-400">🏭</span>}
            >
              {warehouses.map((warehouse: any) => (
                <SelectItem key={warehouse._id} value={warehouse._id}>
                  {warehouse.name}
                </SelectItem>
              ))}
            </Select>

            {/* Schedule Status */}
            {formData.productId && formData.warehouseId && (
              <Card
                className={`border-none ${scheduleStatus.canExport
                    ? "bg-success-50"
                    : "bg-danger-50"
                  }`}
              >
                <CardBody className="p-4">
                  <p
                    className={`text-sm font-semibold ${scheduleStatus.canExport
                        ? "text-success-700"
                        : "text-danger-700"
                      }`}
                  >
                    {scheduleStatus.message}
                  </p>
                </CardBody>
              </Card>
            )}

            {/* Selected Product Info */}
            {selectedProduct && scheduleStatus.canExport && (
              <Card className="bg-secondary-50 border-none">
                <CardBody className="p-4">
                  <div>
                    <p className="text-sm font-semibold text-secondary-700">
                      ✅ Sản phẩm đã chọn
                    </p>
                    <p className="text-xs text-secondary-600 mt-1">
                      {selectedProduct.name} (SKU: {selectedProduct.skuCode})
                    </p>
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Quantity */}
            <Input
              type="number"
              label="Số lượng"
              placeholder="Nhập số lượng"
              value={formData.quantity}
              onValueChange={(value) =>
                setFormData({ ...formData, quantity: value })
              }
              isRequired
              isInvalid={!!errors.quantity}
              errorMessage={errors.quantity}
              startContent={<span className="text-default-400">#️⃣</span>}
              min="1"
              isDisabled={!scheduleStatus.canExport}
            />

            {/* RFID Tag Selection */}
            <Select
              label="RFID Tag"
              placeholder="Chọn RFID Tag/Device"
              selectedKeys={formData.rfidTagId ? [formData.rfidTagId] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                setFormData({ ...formData, rfidTagId: selected });
              }}
              isRequired
              isInvalid={!!errors.rfidTagId}
              errorMessage={errors.rfidTagId}
              startContent={<span className="text-default-400">📡</span>}
              isDisabled={!scheduleStatus.canExport}
            >
              {devices.map((device: any) => (
                <SelectItem key={device._id} value={device._id}>
                  {device.name} ({device.code})
                </SelectItem>
              ))}
            </Select>

            {/* Info Box */}
            <Card className="bg-warning-50 border-none">
              <CardBody className="p-4">
                <p className="text-sm text-warning-700">
                  <span className="font-semibold">⚠️ Lưu ý xuất kho:</span>
                  <br />
                  1. Sản phẩm phải có trạng thái READY_OUT
                  <br />
                  2. Phải trong khung giờ đã đặt lịch
                  <br />
                  3. Kiểm tra số lượng tồn kho
                  <br />
                  4. Quét RFID Tag để xác nhận
                </p>
              </CardBody>
            </Card>

            {/* Submit Button */}
            <Button
              color="secondary"
              size="lg"
              fullWidth
              onPress={handleSubmit}
              isLoading={isLoading}
              isDisabled={!scheduleStatus.canExport || products.length === 0}
              className="font-semibold"
            >
              ✅ Xác nhận xuất kho
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}