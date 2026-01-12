import { useState } from "react";
import {
  Card,
  CardBody,
  Chip,
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import api from "../../../../libs/api";

interface Product {
  _id: string;
  skuCode: string;
  name: string;
  productTypeId: {
    _id: string;
    name: string;
  };
  flowState: string;
}

interface InventoryItem {
  _id: string;
  productId: Product;
  warehouseId: string;
  quantity: number;
  lastInAt: string;
  lastOutAt: string | null;
}

interface InventoryViewProps {
  warehouseId: string;
}

const getFlowStateLabel = (state: string) => {
  const labels: Record<string, string> = {
    READY_IN: "Sẵn sàng nhập",
    IN_PROGRESS: "Đang xử lý",
    READY_OUT: "Sẵn sàng xuất",
    COMPLETED: "Hoàn thành",
  };
  return labels[state] || state;
};

const getFlowStateColor = (state: string) => {
  const colors: Record<string, "success" | "warning" | "primary" | "default"> = {
    READY_IN: "primary",
    IN_PROGRESS: "warning",
    READY_OUT: "success",
    COMPLETED: "default",
  };
  return colors[state] || "default";
};

export default function InventoryView({ warehouseId }: InventoryViewProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: inventoryItems = [], isLoading } = useQuery({
    queryKey: ["inventory", warehouseId],
    queryFn: async () => {
      const response = await api.get(`/inventories/items/warehouse/${warehouseId}`);
      return response.data as InventoryItem[];
    },
  });

  const filteredItems = inventoryItems.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.productId.skuCode.toLowerCase().includes(searchLower) ||
      item.productId.name.toLowerCase().includes(searchLower) ||
      item.productId.productTypeId.name.toLowerCase().includes(searchLower)
    );
  });

  const totalQuantity = inventoryItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalProducts = inventoryItems.length;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border border-divider">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-default-500">Tổng số sản phẩm</p>
                <p className="text-2xl font-bold text-primary">{totalProducts}</p>
              </div>
              <div className="text-3xl">📦</div>
            </div>
          </CardBody>
        </Card>

        <Card className="border border-divider">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-default-500">Tổng số lượng</p>
                <p className="text-2xl font-bold text-success">{totalQuantity}</p>
              </div>
              <div className="text-3xl">📊</div>
            </div>
          </CardBody>
        </Card>

        <Card className="border border-divider">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-default-500">Hết hàng</p>
                <p className="text-2xl font-bold text-danger">
                  {inventoryItems.filter((item) => item.quantity === 0).length}
                </p>
              </div>
              <div className="text-3xl">⚠️</div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card className="border border-divider">
        <CardBody className="p-4">
          <div className="mb-4">
            <Input
              placeholder="🔍 Tìm kiếm theo SKU, tên sản phẩm, loại..."
              value={searchTerm}
              onValueChange={setSearchTerm}
              size="sm"
              className="max-w-md"
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Spinner size="lg" />
            </div>
          ) : (
            <Table aria-label="Bảng tồn kho">
              <TableHeader>
                <TableColumn>SKU</TableColumn>
                <TableColumn>TÊN SẢN PHẨM</TableColumn>
                <TableColumn>LOẠI</TableColumn>
                <TableColumn>SỐ LƯỢNG</TableColumn>
                <TableColumn>TRẠNG THÁI</TableColumn>
                <TableColumn>NHẬP GẦN NHẤT</TableColumn>
                <TableColumn>XUẤT GẦN NHẤT</TableColumn>
              </TableHeader>
              <TableBody emptyContent="Không có sản phẩm trong kho">
                {filteredItems.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>
                      <span className="font-mono text-sm font-semibold">
                        {item.productId.skuCode}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{item.productId.name}</span>
                    </TableCell>
                    <TableCell>
                      <Chip size="sm" variant="flat" color="secondary">
                        {item.productId.productTypeId.name}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="sm"
                        variant="flat"
                        color={item.quantity === 0 ? "danger" : item.quantity < 10 ? "warning" : "success"}
                      >
                        {item.quantity}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="sm"
                        variant="flat"
                        color={getFlowStateColor(item.productId.flowState)}
                      >
                        {getFlowStateLabel(item.productId.flowState)}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-default-500">
                        {formatDate(item.lastInAt)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-default-500">
                        {formatDate(item.lastOutAt)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>
    </div>
  );
}