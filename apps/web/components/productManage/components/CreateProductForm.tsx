/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
  Button,
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";

interface CreateProductFormProps {
  productTypes: any[];
  onSubmit: (data: any) => Promise<void>;
  onCreateProductType: (data: any) => Promise<any>;
  isLoading: boolean;
  isCreatingType: boolean;
}

export default function CreateProductForm({
  productTypes,
  onSubmit,
  onCreateProductType,
  isLoading,
  isCreatingType,
}: CreateProductFormProps) {
  const [formData, setFormData] = useState({
    skuCode: "",
    name: "",
    productTypeId: "",
  });

  const [newTypeData, setNewTypeData] = useState({
    code: "",
    name: "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [typeErrors, setTypeErrors] = useState<Record<string, string>>({});

  const { isOpen, onOpen, onClose } = useDisclosure();

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

  const validateProductType = () => {
    const newErrors: Record<string, string> = {};

    if (!newTypeData.code.trim()) {
      newErrors.code = "Mã loại là bắt buộc";
    }

    if (!newTypeData.name.trim()) {
      newErrors.name = "Tên loại là bắt buộc";
    }

    setTypeErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      try {
        await onSubmit({
          ...formData,
          flowState: "READY_IN", // Default state for new products
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

  const handleCreateProductType = async () => {
    if (validateProductType()) {
      try {
        const newType = await onCreateProductType(newTypeData);
        // Set the newly created type as selected
        if (newType && newType._id) {
          setFormData({ ...formData, productTypeId: newType._id });
        }
        // Reset form
        setNewTypeData({ code: "", name: "", description: "" });
        setTypeErrors({});
        onClose();
      } catch (error) {
        console.error("Error creating product type:", error);
      }
    }
  };

  const handleCloseTypeModal = () => {
    setNewTypeData({ code: "", name: "", description: "" });
    setTypeErrors({});
    onClose();
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
                Sản phẩm mới sẽ có trạng thái &quot;Sẵn sàng nhập kho&quot;
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

            {/* Product Type with Add Button */}
            <div className="space-y-2">
              <div className="flex gap-2">
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
                  className="flex-1"
                >
                  {productTypes.map((type) => (
                    <SelectItem key={type._id} data-key={type._id}>
                      {type.name}
                      {type.description && (
                        <span className="text-xs text-default-400 ml-2">
                          - {type.description}
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </Select>
                <Button
                  color="primary"
                  variant="flat"
                  onPress={onOpen}
                  className="min-w-32"
                >
                  ➕ Thêm loại
                </Button>
              </div>
            </div>

            {/* Info Box */}
            <Card className="bg-primary-50 border-none">
              <CardBody className="p-4">
                <p className="text-sm text-primary-700">
                  <span className="font-semibold">ℹ️ Lưu ý:</span> Sản phẩm sau
                  khi tạo sẽ có trạng thái <strong>&quot;READY_IN&quot;</strong> (Sẵn sàng
                  nhập kho). Bạn có thể nhập sản phẩm vào kho tại trang
                  &quot;Nhập/Xuất kho&quot;.
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

      {/* Add Product Type Modal */}
      <Modal isOpen={isOpen} onClose={handleCloseTypeModal} size="lg">
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-bold">➕ Thêm loại sản phẩm mới</h3>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Mã loại"
                placeholder="VD: CATE001"
                value={newTypeData.code}
                onValueChange={(value) =>
                  setNewTypeData({ ...newTypeData, code: value })
                }
                isRequired
                isInvalid={!!typeErrors.code}
                errorMessage={typeErrors.code}
                startContent={<span className="text-default-400">🏷️</span>}
              />

              <Input
                label="Tên loại"
                placeholder="VD: Điện tử"
                value={newTypeData.name}
                onValueChange={(value) =>
                  setNewTypeData({ ...newTypeData, name: value })
                }
                isRequired
                isInvalid={!!typeErrors.name}
                errorMessage={typeErrors.name}
                startContent={<span className="text-default-400">📝</span>}
              />

              <Textarea
                label="Mô tả"
                placeholder="Mô tả chi tiết về loại sản phẩm (tùy chọn)"
                value={newTypeData.description}
                onValueChange={(value) =>
                  setNewTypeData({ ...newTypeData, description: value })
                }
                minRows={3}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={handleCloseTypeModal}>
              Hủy
            </Button>
            <Button
              color="primary"
              onPress={handleCreateProductType}
              isLoading={isCreatingType}
            >
              ✅ Tạo loại
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}