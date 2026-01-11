import { useState } from "react";
import {
  Card,
  CardBody,
  Select,
  SelectItem,
  Button,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";

interface UpdateProductStateFormProps {
  products: any[];
  inventoryItems: any[];
  onSubmit: (data: { productId: string; flowState: string }) => Promise<void>;
  isLoading: boolean;
}

export default function UpdateProductStateForm({
  products,
  inventoryItems,
  onSubmit,
  isLoading,
}: UpdateProductStateFormProps) {
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [targetState, setTargetState] = useState<string>("");

  // Get unique warehouses from inventory
  const warehouses = Array.from(
    new Set(inventoryItems.map((item: any) => item.warehouseId))
  ).map((warehouseId) => {
    const item = inventoryItems.find(
      (i: any) => i.warehouseId === warehouseId
    );
    return {
      _id: warehouseId,
      name: item?.warehouseName || "Unknown",
    };
  });

  // Get products in selected warehouse
  const productsInWarehouse = selectedWarehouse
    ? inventoryItems
      .filter((item: any) => item.warehouseId === selectedWarehouse)
      .map((item: any) => {
        const product = products.find((p) => p._id === item.productId);
        return {
          ...product,
          quantity: item.quantity,
          inventoryItem: item,
        };
      })
      .filter((p: any) => p._id) // Remove null products
    : [];

  const selectedProductData = products.find((p) => p._id === selectedProduct);

  const getFlowStateColor = (state: string) => {
    const colors: Record<string, "success" | "secondary" | "danger"> = {
      READY_IN: "success",
      READY_OUT: "secondary",
      BLOCKED: "danger",
    };
    return colors[state] || "default";
  };

  const getFlowStateLabel = (state: string) => {
    const labels: Record<string, string> = {
      READY_IN: "Sẵn sàng nhập",
      READY_OUT: "Sẵn sàng xuất",
      BLOCKED: "Bị khóa",
    };
    return labels[state] || state;
  };

  const handleSubmit = async () => {
    if (selectedProduct && targetState) {
      try {
        await onSubmit({
          productId: selectedProduct,
          flowState: targetState,
        });
        // Reset form
        setSelectedProduct("");
        setTargetState("");
      } catch (error) {
        console.error("Error updating product state:", error);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-2 border-warning">
        <CardBody className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-warning-100 rounded-xl flex items-center justify-center">
              <span className="text-4xl">🔄</span>
            </div>
            <div>
              <h3 className="text-xl font-bold">Cập nhật trạng thái sản phẩm</h3>
              <p className="text-sm text-default-500">
                Thay đổi trạng thái của sản phẩm đang có trong kho
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            {/* Warehouse Selection */}
            <Select
              label="Nhà kho"
              placeholder="Chọn nhà kho để xem sản phẩm"
              selectedKeys={selectedWarehouse ? [selectedWarehouse] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                setSelectedWarehouse(selected);
                setSelectedProduct("");
                setTargetState("");
              }}
              startContent={<span className="text-default-400">🏭</span>}
            >
              {warehouses.map((warehouse: any) => (
                <SelectItem key={warehouse._id} value={warehouse._id}>
                  {warehouse.name}
                </SelectItem>
              ))}
            </Select>

            {/* Products Table */}
            {selectedWarehouse && productsInWarehouse.length > 0 && (
              <Card className="border border-divider">
                <CardBody className="p-4">
                  <p className="text-sm font-semibold mb-3">
                    📦 Sản phẩm trong kho ({productsInWarehouse.length})
                  </p>
                  <Table aria-label="Bảng sản phẩm trong kho">
                    <TableHeader>
                      <TableColumn>SẢN PHẨM</TableColumn>
                      <TableColumn>SỐ LƯỢNG</TableColumn>
                      <TableColumn>TRẠNG THÁI</TableColumn>
                      <TableColumn>THAO TÁC</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {productsInWarehouse.map((product: any) => (
                        <TableRow key={product._id}>
                          <TableCell>
                            <div>
                              <p className="font-semibold">{product.name}</p>
                              <p className="text-xs text-default-500 font-mono">
                                {product.skuCode}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Chip size="sm" variant="flat" color="primary">
                              {product.quantity}
                            </Chip>
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="sm"
                              variant="flat"
                              color={getFlowStateColor(product.flowState)}
                            >
                              {getFlowStateLabel(product.flowState)}
                            </Chip>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              color="warning"
                              variant="flat"
                              onPress={() => {
                                setSelectedProduct(product._id);
                                setTargetState("");
                              }}
                              isDisabled={selectedProduct === product._id}
                            >
                              {selectedProduct === product._id
                                ? "✅ Đã chọn"
                                : "Cập nhật"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardBody>
              </Card>
            )}

            {selectedWarehouse && productsInWarehouse.length === 0 && (
              <Card className="bg-warning-50 border-none">
                <CardBody className="p-4 text-center">
                  <p className="text-sm text-warning-700">
                    ⚠️ Không có sản phẩm nào trong kho này
                  </p>
                </CardBody>
              </Card>
            )}

            {/* Selected Product Info */}
            {selectedProductData && (
              <Card className="bg-success-50 border-none">
                <CardBody className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-success-700">
                        ✅ Sản phẩm đã chọn
                      </p>
                      <p className="text-xs text-success-600 mt-1">
                        {selectedProductData.name} (SKU:{" "}
                        {selectedProductData.skuCode})
                      </p>
                    </div>
                    <Chip
                      size="md"
                      color={getFlowStateColor(selectedProductData.flowState)}
                      variant="solid"
                    >
                      Hiện tại: {getFlowStateLabel(selectedProductData.flowState)}
                    </Chip>
                  </div>

                  {/* Target State Selection */}
                  <Select
                    label="Trạng thái mới"
                    placeholder="Chọn trạng thái mới"
                    selectedKeys={targetState ? [targetState] : []}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] as string;
                      setTargetState(selected);
                    }}
                    startContent={<span className="text-default-400">🎯</span>}
                  >
                    <SelectItem key="READY_IN" value="READY_IN">
                      <div className="flex items-center gap-2">
                        <span>🟢</span>
                        <span>READY_IN - Sẵn sàng nhập</span>
                      </div>
                    </SelectItem>
                    <SelectItem key="READY_OUT" value="READY_OUT">
                      <div className="flex items-center gap-2">
                        <span>🔵</span>
                        <span>READY_OUT - Sẵn sàng xuất</span>
                      </div>
                    </SelectItem>
                    <SelectItem key="BLOCKED" value="BLOCKED">
                      <div className="flex items-center gap-2">
                        <span>🔴</span>
                        <span>BLOCKED - Bị khóa</span>
                      </div>
                    </SelectItem>
                  </Select>
                </CardBody>
              </Card>
            )}

            {/* Info Box */}
            <Card className="bg-primary-50 border-none">
              <CardBody className="p-4">
                <p className="text-sm text-primary-700">
                  <span className="font-semibold">ℹ️ Hướng dẫn:</span>
                  <br />
                  1. Chọn nhà kho để xem danh sách sản phẩm
                  <br />
                  2. Chọn sản phẩm cần cập nhật trạng thái
                  <br />
                  3. Chọn trạng thái mới
                  <br />
                  4. Xác nhận cập nhật
                  <br />
                  <br />
                  <span className="font-semibold">📌 Lưu ý:</span>
                  <br />
                  • READY_IN: Sản phẩm sẵn sàng để nhập kho
                  <br />
                  • READY_OUT: Sản phẩm sẵn sàng để xuất kho
                  <br />• BLOCKED: Sản phẩm bị khóa, không thể giao dịch
                </p>
              </CardBody>
            </Card>

            {/* Submit Button */}
            <Button
              color="warning"
              size="lg"
              fullWidth
              onPress={handleSubmit}
              isLoading={isLoading}
              isDisabled={!selectedProduct || !targetState}
              className="font-semibold"
            >
              🔄 Cập nhật trạng thái
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}