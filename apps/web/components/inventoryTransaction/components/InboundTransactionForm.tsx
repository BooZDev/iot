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

interface InboundTransactionFormProps {
  products: any[];
  warehouses: any[];
  devices: any[];
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
}

export default function InboundTransactionForm({
  products,
  warehouses,
  devices,
  onSubmit,
  isLoading,
}: InboundTransactionFormProps) {
  const [formData, setFormData] = useState({
    productId: "",
    warehouseId: "",
    quantity: "",
    transactionType: "IN",
    rfidTagId: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.productId) {
      newErrors.productId = "Sản phẩm là bắt buộc";
    }

    if (!formData.warehouseId) {
      newErrors.warehouseId = "Nhà kho là bắt buộc";
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
          transactionType: "IN",
          rfidTagId: "",
        });
        setErrors({});
      } catch (error) {
        console.error("Error creating inbound transaction:", error);
      }
    }
  };

  const selectedProduct = products.find((p) => p._id === formData.productId);

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-2 border-success">
        <CardBody className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-success-100 rounded-xl flex items-center justify-center">
              <span className="text-4xl">📥</span>
            </div>
            <div>
              <h3 className="text-xl font-bold">Nhập sản phẩm vào kho</h3>
              <p className="text-sm text-default-500">
                Chỉ nhập được sản phẩm có trạng thái &quot;READY_IN&quot;
              </p>
            </div>
          </div>

          {products.length === 0 && (
            <Card className="bg-warning-50 border-none mb-4">
              <CardBody className="p-4">
                <p className="text-sm text-warning-700 text-center">
                  ⚠️ Hiện không có sản phẩm nào sẵn sàng để nhập kho
                </p>
              </CardBody>
            </Card>
          )}

          <div className="space-y-4">
            {/* Product Selection */}
            <Select
              label="Sản phẩm"
              placeholder="Chọn sản phẩm cần nhập kho"
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
                <SelectItem key={product._id} data-key={product._id} textValue={product.name}>
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <span className="font-semibold">{product.name}</span>
                      <span className="text-xs text-default-500 ml-2">
                        ({product.skuCode})
                      </span>
                    </div>
                    <Chip size="sm" variant="flat" color="success">
                      READY_IN
                    </Chip>
                  </div>
                </SelectItem>
              ))}
            </Select>

            {/* Selected Product Info */}
            {selectedProduct && (
              <Card className="bg-success-50 border-none">
                <CardBody className="p-4">
                  <div>
                    <p className="text-sm font-semibold text-success-700">
                      ✅ Sản phẩm đã chọn
                    </p>
                    <p className="text-xs text-success-600 mt-1">
                      {selectedProduct.name} (SKU: {selectedProduct.skuCode})
                    </p>
                  </div>
                </CardBody>
              </Card>
            )}

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
                <SelectItem key={warehouse._id} data-key={warehouse._id} textValue={warehouse.name}>
                  {warehouse.name}
                </SelectItem>
              ))}
            </Select>

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
            >
              {devices.map((device: any) => (
                <SelectItem key={device._id} data-value={device._id} textValue={device.name}>
                  {device.name} ({device.code})
                </SelectItem>
              ))}
            </Select>

            {/* Info Box */}
            <Card className="bg-primary-50 border-none">
              <CardBody className="p-4">
                <p className="text-sm text-primary-700">
                  <span className="font-semibold">ℹ️ Quy trình nhập kho:</span>
                  <br />
                  1. Chọn sản phẩm READY_IN
                  <br />
                  2. Chọn nhà kho đích
                  <br />
                  3. Nhập số lượng
                  <br />
                  4. Quét RFID Tag
                  <br />
                  5. Xác nhận nhập kho
                </p>
              </CardBody>
            </Card>

            {/* Submit Button */}
            <Button
              color="success"
              size="lg"
              fullWidth
              onPress={handleSubmit}
              isLoading={isLoading}
              isDisabled={products.length === 0}
              className="font-semibold"
            >
              ✅ Xác nhận nhập kho
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}