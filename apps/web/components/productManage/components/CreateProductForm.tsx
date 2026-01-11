import { useState } from "react";
import {
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
  Button,
  Textarea,
} from "@heroui/react";

interface CreateProductFormProps {
  productTypes: any[];
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
}

export default function CreateProductForm({
  productTypes,
  onSubmit,
  isLoading,
}: CreateProductFormProps) {
  const [formData, setFormData] = useState({
    skuCode: "",
    name: "",
    productTypeId: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.skuCode.trim()) {
      newErrors.skuCode = "Mã SKU là bắt buộc";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Tên sản phẩm là bắt buộc";
    }

    if (!formData.productTypeId) {
      newErrors.productTypeId = "Loại sản phẩm là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      try {
        await onSubmit({
          ...formData,
        });
        // Reset form
        setFormData({
          skuCode: "",
          name: "",
          productTypeId: "",
        });
        setErrors({});
      } catch (error) {
        console.error("Error creating product:", error);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-2 border-primary">
        <CardBody className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center">
              <span className="text-4xl">📦</span>
            </div>
            <div>
              <h3 className="text-xl font-bold">Tạo sản phẩm mới</h3>
              <p className="text-sm text-default-500">
                Sản phẩm mới sẽ có trạng thái "Sẵn sàng nhập kho"
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* SKU Code */}
            <Input
              label="Mã SKU"
              placeholder="VD: SP001, PROD-2024-001"
              value={formData.skuCode}
              onValueChange={(value) =>
                setFormData({ ...formData, skuCode: value })
              }
              isRequired
              isInvalid={!!errors.skuCode}
              errorMessage={errors.skuCode}
              startContent={<span className="text-default-400">🏷️</span>}
            />

            {/* Product Name */}
            <Input
              label="Tên sản phẩm"
              placeholder="Nhập tên sản phẩm"
              value={formData.name}
              onValueChange={(value) =>
                setFormData({ ...formData, name: value })
              }
              isRequired
              isInvalid={!!errors.name}
              errorMessage={errors.name}
              startContent={<span className="text-default-400">📝</span>}
            />

            {/* Product Type */}
            <Select
              label="Loại sản phẩm"
              placeholder="Chọn loại sản phẩm"
              selectedKeys={formData.productTypeId ? [formData.productTypeId] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                setFormData({ ...formData, productTypeId: selected });
              }}
              isRequired
              isInvalid={!!errors.productTypeId}
              errorMessage={errors.productTypeId}
              startContent={<span className="text-default-400">🗂️</span>}
            >
              {productTypes.map((type) => (
                <SelectItem key={type._id} value={type._id}>
                  {type.name}
                  {type.description && (
                    <span className="text-xs text-default-400 ml-2">
                      - {type.description}
                    </span>
                  )}
                </SelectItem>
              ))}
            </Select>

            {/* Info Box */}
            <Card className="bg-primary-50 border-none">
              <CardBody className="p-4">
                <p className="text-sm text-primary-700">
                  <span className="font-semibold">ℹ️ Lưu ý:</span> Sản phẩm sau
                  khi tạo sẽ có trạng thái <strong>"READY_IN"</strong> (Sẵn sàng
                  nhập kho). Bạn có thể nhập sản phẩm vào kho tại trang
                  "Nhập/Xuất kho".
                </p>
              </CardBody>
            </Card>

            {/* Submit Button */}
            <Button
              color="primary"
              size="lg"
              fullWidth
              onPress={handleSubmit}
              isLoading={isLoading}
              className="font-semibold"
            >
              ✅ Tạo sản phẩm
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}