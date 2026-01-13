/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Card,
  CardBody,
  Select,
  SelectItem,
  Button,
  Input,
  Chip,
} from "@heroui/react";

interface ScheduleOutboundFormProps {
  inventoryItems: any[];
  products: any[];
  warehouses: any[];
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
}

export default function ScheduleOutboundForm({
  inventoryItems,
  products,
  warehouses,
  onSubmit,
  isLoading,
}: ScheduleOutboundFormProps) {
  const [formData, setFormData] = useState({
    warehouseId: "",
    productId: "",
    startAt: "",
    endAt: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filter products that are in selected warehouse
  const availableProducts = formData.warehouseId
    ? inventoryItems
      .filter((item) => item.warehouseId === formData.warehouseId)
    : [];

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.warehouseId) {
      newErrors.warehouseId = "Nhà kho là bắt buộc";
    }

    if (!formData.productId) {
      newErrors.productId = "Sản phẩm là bắt buộc";
    }

    if (!formData.startAt) {
      newErrors.startAt = "Thời gian bắt đầu là bắt buộc";
    }

    if (!formData.endAt) {
      newErrors.endAt = "Thời gian kết thúc là bắt buộc";
    }

    if (formData.startAt && formData.endAt) {
      const start = new Date(formData.startAt);
      const end = new Date(formData.endAt);
      if (end <= start) {
        newErrors.endAt = "Thời gian kết thúc phải sau thời gian bắt đầu";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      try {
        await onSubmit({
          ...formData,
          startAt: new Date(formData.startAt).toISOString(),
          endAt: new Date(formData.endAt).toISOString(),
        });
        // Reset form
        setFormData({
          warehouseId: "",
          productId: "",
          startAt: "",
          endAt: "",
        });
        setErrors({});
      } catch (error) {
        console.error("Error creating schedule:", error);
      }
    }
  };

  const selectedProduct = products.find((p) => p._id === formData.productId);
  const selectedInventory = inventoryItems.find(
    (item) =>
      item.productId === formData.productId &&
      item.warehouseId === formData.warehouseId
  );

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-2 border-secondary">
        <CardBody className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-secondary-100 rounded-xl flex items-center justify-center">
              <span className="text-4xl">📅</span>
            </div>
            <div>
              <h3 className="text-xl font-bold">Lập lịch xuất kho</h3>
              <p className="text-sm text-default-500">
                Đặt lịch xuất kho cho sản phẩm đang có trong kho
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Warehouse Selection */}
            <Select
              label="Nhà kho"
              placeholder="Chọn nhà kho"
              selectedKeys={formData.warehouseId ? [formData.warehouseId] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                setFormData({
                  ...formData,
                  warehouseId: selected,
                  productId: "", // Reset product when warehouse changes
                });
              }}
              isRequired
              isInvalid={!!errors.warehouseId}
              errorMessage={errors.warehouseId}
              startContent={<span className="text-default-400">🏭</span>}
            >
              {warehouses.map((warehouse: any) => (
                <SelectItem key={warehouse._id} data-value={warehouse._id}>
                  {warehouse.name}
                </SelectItem>
              ))}
            </Select>

            {/* Product Selection */}
            <Select
              label="Sản phẩm"
              placeholder={
                formData.warehouseId
                  ? "Chọn sản phẩm"
                  : "Vui lòng chọn nhà kho trước"
              }
              selectedKeys={formData.productId ? [formData.productId] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                setFormData({ ...formData, productId: selected });
              }}
              renderValue={(items) =>
                items.map((item) => {
                  const product = availableProducts.find(
                    (p) => p.productId._id === item.key
                  );
                  return (
                    <div key={product.productId._id} className="flex justify-between items-center w-full">
                      <span>{product.productId.name}</span>
                      <Chip size="sm" variant="flat" color="primary">
                        SL : {product.quantity}
                      </Chip>
                    </div>
                  );
                })
              }
              isRequired
              isInvalid={!!errors.productId}
              errorMessage={errors.productId}
              isDisabled={!formData.warehouseId}
              startContent={<span className="text-default-400">📦</span>}
            >
              {availableProducts.map((product: any) => (
                <SelectItem key={product.productId._id} data-value={product.productId._id}>
                  {`${product.productId.name} (SKU: ${product.productId.skuCode})`}
                  <span className="text-green-400">{`Tồn kho: ${product.quantity}`}</span>
                </SelectItem>
              ))}
            </Select>

            {/* Selected Product Info */}
            {selectedProduct && selectedInventory && (
              <Card className="bg-success-50 border-none">
                <CardBody className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-success-700">
                        ✅ Sản phẩm đã chọn
                      </p>
                      <p className="text-xs text-success-600 mt-1">
                        {selectedProduct.productId.name} (SKU: {selectedProduct.productId.skuCode})
                      </p>
                    </div>
                    <Chip size="md" color="success" variant="solid">
                      Số lượng: {selectedInventory.productId.quantity}
                    </Chip>
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Start Date Time */}
            <Input
              type="datetime-local"
              label="Thời gian bắt đầu xuất kho"
              placeholder="Chọn thời gian bắt đầu"
              value={formData.startAt}
              onValueChange={(value) =>
                setFormData({ ...formData, startAt: value })
              }
              isRequired
              isInvalid={!!errors.startAt}
              errorMessage={errors.startAt}
              startContent={<span className="text-default-400">⏰</span>}
            />

            {/* End Date Time */}
            <Input
              type="datetime-local"
              label="Thời gian kết thúc xuất kho"
              placeholder="Chọn thời gian kết thúc"
              value={formData.endAt}
              onValueChange={(value) =>
                setFormData({ ...formData, endAt: value })
              }
              isRequired
              isInvalid={!!errors.endAt}
              errorMessage={errors.endAt}
              startContent={<span className="text-default-400">⏰</span>}
            />

            {/* Info Box */}
            <Card className="bg-warning-50 border-none">
              <CardBody className="p-4">
                <p className="text-sm text-warning-700">
                  <span className="font-semibold">⚠️ Lưu ý:</span> Sản phẩm chỉ
                  có thể xuất kho trong khoảng thời gian đã đặt lịch. Sau khi đặt
                  lịch, trạng thái sản phẩm sẽ chuyển sang <strong>&quot;READY_OUT&quot;</strong> khi đến thời gian xuất kho.
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
              isDisabled={!formData.warehouseId || !formData.productId}
              className="font-semibold"
            >
              📅 Đặt lịch xuất kho
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}