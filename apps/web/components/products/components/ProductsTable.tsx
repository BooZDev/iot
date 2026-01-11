import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  Tooltip,
  Spinner,
} from "@heroui/react";
import { Product, ProductFlowState, ProductType } from "../ProductsPage";

interface ProductsTableProps {
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

export default function ProductsTable({
  products,
  productTypes,
  isLoading,
  onView,
}: ProductsTableProps) {
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
    <Table aria-label="Bảng sản phẩm">
      <TableHeader>
        <TableColumn>SẢN PHẨM</TableColumn>
        <TableColumn>MÃ SKU</TableColumn>
        <TableColumn>LOẠI SẢN PHẨM</TableColumn>
        <TableColumn>TRẠNG THÁI</TableColumn>
        <TableColumn>NGÀY TẠO</TableColumn>
        <TableColumn align="center">THAO TÁC</TableColumn>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product._id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">📦</span>
                </div>
                <div>
                  <p className="font-semibold">{product.name}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <span className="text-sm font-mono text-default-600">
                {product.skuCode}
              </span>
            </TableCell>
            <TableCell>
              <span className="text-sm">
                {getProductTypeName(product.productTypeId)}
              </span>
            </TableCell>
            <TableCell>
              <Chip
                size="sm"
                variant="flat"
                color={getFlowStateColor(product.flowState)}
                startContent={
                  <span className="text-xs">
                    {getFlowStateIcon(product.flowState)}
                  </span>
                }
              >
                {getFlowStateLabel(product.flowState)}
              </Chip>
            </TableCell>
            <TableCell>
              <span className="text-sm">
                {product.createdAt
                  ? new Date(product.createdAt).toLocaleDateString("vi-VN")
                  : "—"}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-center gap-1">
                <Tooltip content="Xem chi tiết">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    color="primary"
                    onPress={() => onView(product)}
                  >
                    👁️
                  </Button>
                </Tooltip>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}