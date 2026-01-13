import {
  Card,
  CardBody,
  Chip,
  Button,
  Tooltip,
  Spinner,
} from "@heroui/react";
import { Product, ProductFlowState, ProductType } from "../ProductsPage";

interface ProductsGridProps {
  products: Product[];
  productTypes: ProductType[];
  isLoading: boolean;
  onView: (product: Product) => void;
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
    [ProductFlowState.READY_IN]: "Sẵn sàng nhập",
    [ProductFlowState.READY_OUT]: "Sẵn sàng xuất",
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

export default function ProductsGrid({
  products,
  productTypes,
  isLoading,
  onView,
}: ProductsGridProps) {
  const getProductTypeName = (typeId: string) => {
    const type = productTypes.find((t) => t._id === typeId);
    return type?.name || "—";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" label="Đang tải sản phẩm..." />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">📦</div>
        <p className="text-lg text-default-500">Không có sản phẩm nào</p>
        <p className="text-sm text-default-400 mt-2">
          Thử thay đổi bộ lọc hoặc tìm kiếm
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <Card
          key={product._id}
          className="border border-divider hover:border-primary transition-all hover:shadow-lg"
          isPressable
          onPress={() => onView(product)}
        >
          <CardBody className="p-5">
            {/* Product Icon & Name */}
            <div className="flex flex-col items-center mb-4">
              <div className="w-20 h-20 bg-primary-100 rounded-xl flex items-center justify-center mb-3">
                <span className="text-4xl">📦</span>
              </div>
              <h3 className="font-bold text-lg text-center">{product.name}</h3>
              <p className="text-xs text-default-500 font-mono mt-1">
                SKU: {product.skuCode}
              </p>
            </div>

            {/* Flow State */}
            <div className="flex justify-center mb-4">
              <Chip
                size="md"
                variant="flat"
                color={getFlowStateColor(product.flowState)}
                startContent={
                  <span className="text-lg">
                    {getFlowStateIcon(product.flowState)}
                  </span>
                }
              >
                {getFlowStateLabel(product.flowState)}
              </Chip>
            </div>

            {/* Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-default-400">🏷️</span>
                <span className="text-default-600 truncate">
                  {getProductTypeName(product.productTypeId)}
                </span>
              </div>
              {product.createdAt && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-default-400">📅</span>
                  <span className="text-default-600">
                    {new Date(product.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              )}
            </div>

            {/* Action */}
            <div className="pt-3 border-t border-divider">
              <Tooltip content="Xem chi tiết">
                <Button
                  fullWidth
                  size="sm"
                  variant="flat"
                  color="primary"
                  onPress={() => {
                    onView(product);
                  }}
                >
                  👁️ Xem chi tiết
                </Button>
              </Tooltip>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}