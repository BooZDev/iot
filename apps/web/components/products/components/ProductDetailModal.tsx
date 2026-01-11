import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
  Card,
  CardBody,
  Divider,
} from "@heroui/react";
import { Product, ProductFlowState, ProductType } from "../ProductsPage";

interface ProductDetailModalProps {
  product: Product | null;
  productTypes: ProductType[];
  warehouses: any[];
  onClose: () => void;
}

const getFlowStateColor = (state: ProductFlowState) => {
  const colors: Record<
    ProductFlowState,
    "success" | "secondary" | "danger"
  > = {
    [ProductFlowState.READY_IN]: "success",
    [ProductFlowState.READY_OUT]: "secondary",
    [ProductFlowState.BLOCKED]: "danger",
  };
  return colors[state];
};

const getFlowStateLabel = (state: ProductFlowState) => {
  const labels: Record<ProductFlowState, string> = {
    [ProductFlowState.READY_IN]: "Sẵn sàng nhập kho",
    [ProductFlowState.READY_OUT]: "Sẵn sàng xuất kho",
    [ProductFlowState.BLOCKED]: "Bị khóa",
  };
  return labels[state];
};

const getFlowStateIcon = (state: ProductFlowState) => {
  const icons: Record<ProductFlowState, string> = {
    [ProductFlowState.READY_IN]: "🟢",
    [ProductFlowState.READY_OUT]: "🔵",
    [ProductFlowState.BLOCKED]: "🔴",
  };
  return icons[state];
};

export default function ProductDetailModal({
  product,
  productTypes,
  warehouses,
  onClose,
}: ProductDetailModalProps) {
  if (!product) return null;

  const getProductTypeName = (typeId: string) => {
    const type = productTypes.find((t) => t._id === typeId);
    return type?.name || "—";
  };

  const getProductTypeDescription = (typeId: string) => {
    const type = productTypes.find((t) => t._id === typeId);
    return type?.description || "";
  };

  return (
    <Modal
      isOpen={!!product}
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader>
          <h3 className="text-xl font-bold">📦 Chi tiết sản phẩm</h3>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            {/* Product Header */}
            <Card className="bg-gradient-to-br from-primary-50 to-primary-100 border-none">
              <CardBody className="p-6">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-6xl">📦</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                    <p className="text-default-600 font-mono mb-3">
                      SKU: {product.skuCode}
                    </p>
                    <Chip
                      size="lg"
                      variant="solid"
                      color={getFlowStateColor(product.flowState)}
                      startContent={
                        <span className="text-xl">
                          {getFlowStateIcon(product.flowState)}
                        </span>
                      }
                    >
                      {getFlowStateLabel(product.flowState)}
                    </Chip>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Information Cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Product Info */}
              <Card className="border border-divider">
                <CardBody className="p-4">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <span>📋</span>
                    <span>Thông tin sản phẩm</span>
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-default-500 mb-1">Mã SKU</p>
                      <p className="font-mono text-sm font-semibold">
                        {product.skuCode}
                      </p>
                    </div>
                    <Divider />
                    <div>
                      <p className="text-xs text-default-500 mb-1">Tên sản phẩm</p>
                      <p className="font-medium text-sm">{product.name}</p>
                    </div>
                    <Divider />
                    <div>
                      <p className="text-xs text-default-500 mb-1">Loại sản phẩm</p>
                      <p className="text-sm">
                        {getProductTypeName(product.productTypeId)}
                      </p>
                      {getProductTypeDescription(product.productTypeId) && (
                        <p className="text-xs text-default-400 mt-1">
                          {getProductTypeDescription(product.productTypeId)}
                        </p>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Status Info */}
              <Card className="border border-divider">
                <CardBody className="p-4">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <span>📊</span>
                    <span>Trạng thái</span>
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-default-500 mb-1">
                        Trạng thái hiện tại
                      </p>
                      <Chip
                        size="md"
                        variant="flat"
                        color={getFlowStateColor(product.flowState)}
                      >
                        {getFlowStateLabel(product.flowState)}
                      </Chip>
                    </div>
                    <Divider />
                    <div>
                      <p className="text-xs text-default-500 mb-2">
                        Mô tả trạng thái:
                      </p>
                      <div className="p-3 bg-default-100 rounded-lg">
                        <p className="text-xs text-default-600">
                          {product.flowState === ProductFlowState.READY_IN &&
                            "✅ Sản phẩm sẵn sàng để nhập vào kho"}
                          {product.flowState === ProductFlowState.READY_OUT &&
                            "📤 Sản phẩm sẵn sàng để xuất khỏi kho"}
                          {product.flowState === ProductFlowState.BLOCKED &&
                            "🚫 Sản phẩm đang bị khóa, không thể thực hiện giao dịch"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* System Info */}
            {product.createdAt && (
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
                        {new Date(product.createdAt).toLocaleString("vi-VN")}
                      </p>
                    </div>
                    {product.updatedAt && (
                      <div>
                        <p className="mb-1">Cập nhật lần cuối</p>
                        <p className="text-default-700">
                          {new Date(product.updatedAt).toLocaleString("vi-VN")}
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
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}