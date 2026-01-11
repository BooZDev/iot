import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Spinner,
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { useState } from "react";

interface TransactionHistoryProps {
  transactions: any[];
  products: any[];
  warehouses: any[];
  isLoading: boolean;
}

export default function TransactionHistory({
  transactions,
  products,
  warehouses,
  isLoading,
}: TransactionHistoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterWarehouse, setFilterWarehouse] = useState<string>("all");

  const getProductName = (productId: string) => {
    const product = products.find((p) => p._id === productId);
    return product?.name || "—";
  };

  const getProductSKU = (productId: string) => {
    const product = products.find((p) => p._id === productId);
    return product?.skuCode || "—";
  };

  const getWarehouseName = (warehouseId: string) => {
    const warehouse = warehouses.find((w) => w._id === warehouseId);
    return warehouse?.name || "—";
  };

  // Filter transactions
  let filteredTransactions = transactions.filter((transaction) => {
    const productName = getProductName(transaction.productId).toLowerCase();
    const productSKU = getProductSKU(transaction.productId).toLowerCase();
    const warehouseName = getWarehouseName(
      transaction.warehouseId
    ).toLowerCase();
    const searchLower = searchQuery.toLowerCase();

    return (
      productName.includes(searchLower) ||
      productSKU.includes(searchLower) ||
      warehouseName.includes(searchLower)
    );
  });

  if (filterType !== "all") {
    filteredTransactions = filteredTransactions.filter(
      (t) => t.transactionType === filterType
    );
  }

  if (filterWarehouse !== "all") {
    filteredTransactions = filteredTransactions.filter(
      (t) => t.warehouseId === filterWarehouse
    );
  }

  // Sort by date (newest first)
  filteredTransactions.sort(
    (a, b) =>
      new Date(b.requestTime || b.createdAt).getTime() -
      new Date(a.requestTime || a.createdAt).getTime()
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" label="Đang tải lịch sử giao dịch..." />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card className="border border-divider">
        <CardBody className="p-4">
          <div className="flex gap-3">
            <Input
              placeholder="Tìm kiếm sản phẩm, SKU, nhà kho..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="flex-1"
              size="sm"
              startContent={<span>🔍</span>}
            />
            <Select
              label="Loại giao dịch"
              placeholder="Tất cả"
              selectedKeys={filterType ? [filterType] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                setFilterType(selected || "all");
              }}
              className="w-48"
              size="sm"
            >
              <SelectItem key="all" value="all">
                Tất cả
              </SelectItem>
              <SelectItem key="IN" value="IN">
                📥 Nhập kho
              </SelectItem>
              <SelectItem key="OUT" value="OUT">
                📤 Xuất kho
              </SelectItem>
            </Select>
            <Select
              label="Nhà kho"
              placeholder="Tất cả"
              selectedKeys={filterWarehouse ? [filterWarehouse] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                setFilterWarehouse(selected || "all");
              }}
              className="w-48"
              size="sm"
            >
              <SelectItem key="all" value="all">
                Tất cả
              </SelectItem>
              {warehouses.map((warehouse: any) => (
                <SelectItem key={warehouse._id} value={warehouse._id}>
                  {warehouse.name}
                </SelectItem>
              ))}
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border border-divider">
          <CardBody className="p-4 text-center">
            <p className="text-sm text-default-500 mb-1">
              Tổng giao dịch hiển thị
            </p>
            <p className="text-3xl font-bold text-primary">
              {filteredTransactions.length}
            </p>
          </CardBody>
        </Card>
        <Card className="border border-divider">
          <CardBody className="p-4 text-center">
            <p className="text-sm text-default-500 mb-1">Tổng tất cả</p>
            <p className="text-3xl font-bold text-default-600">
              {transactions.length}
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Table */}
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-lg text-default-500">Không có giao dịch nào</p>
          <p className="text-sm text-default-400 mt-2">
            Thử thay đổi bộ lọc hoặc tìm kiếm
          </p>
        </div>
      ) : (
        <Table aria-label="Bảng lịch sử giao dịch">
          <TableHeader>
            <TableColumn>LOẠI</TableColumn>
            <TableColumn>SẢN PHẨM</TableColumn>
            <TableColumn>NHÀ KHO</TableColumn>
            <TableColumn>SỐ LƯỢNG</TableColumn>
            <TableColumn>TRẠNG THÁI</TableColumn>
            <TableColumn>THỜI GIAN</TableColumn>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((transaction, index) => (
              <TableRow key={transaction._id || index}>
                <TableCell>
                  <Chip
                    size="sm"
                    variant="flat"
                    color={
                      transaction.transactionType === "IN"
                        ? "success"
                        : "secondary"
                    }
                    startContent={
                      <span>
                        {transaction.transactionType === "IN" ? "📥" : "📤"}
                      </span>
                    }
                  >
                    {transaction.transactionType === "IN" ? "Nhập" : "Xuất"}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-semibold text-sm">
                      {getProductName(transaction.productId)}
                    </p>
                    <p className="text-xs text-default-500 font-mono">
                      {getProductSKU(transaction.productId)}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {getWarehouseName(transaction.warehouseId)}
                  </span>
                </TableCell>
                <TableCell>
                  <Chip size="sm" variant="flat" color="primary">
                    {transaction.quantity || 0}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Chip
                    size="sm"
                    variant="flat"
                    color={
                      transaction.status === "COMPLETED"
                        ? "success"
                        : transaction.status === "PENDING"
                          ? "warning"
                          : "danger"
                    }
                  >
                    {transaction.status || "PENDING"}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>
                      {new Date(
                        transaction.requestTime || transaction.createdAt
                      ).toLocaleDateString("vi-VN")}
                    </p>
                    <p className="text-xs text-default-500">
                      {new Date(
                        transaction.requestTime || transaction.createdAt
                      ).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}