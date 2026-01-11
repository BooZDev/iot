"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Chip,
  Select,
  SelectItem,
  Tabs,
  Tab,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import api from "../../app/api/api";
import ProductsTable from "./components/ProductsTable";
import ProductsGrid from "./components/ProductsGrid";
import ProductStatsCards from "./components/ProductStatsCards";
import ProductDetailModal from "./components/ProductDetailModal";

export enum ProductFlowState {
  READY_IN = "READY_IN",
  READY_OUT = "READY_OUT",
  BLOCKED = "BLOCKED",
}

export interface ProductType {
  _id: string;
  code: string;
  name: string;
  description?: string;
}

export interface Product {
  _id: string;
  skuCode: string;
  name: string;
  productTypeId: string;
  flowState: ProductFlowState;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFlowState, setSelectedFlowState] = useState<string>("all");
  const [selectedProductType, setSelectedProductType] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("grid");
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  // Fetch all products
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await api.get("/products");
      return response.data as Product[];
    },
  });

  // Fetch product types
  const { data: productTypes = [] } = useQuery({
    queryKey: ["product-types"],
    queryFn: async () => {
      const response = await api.get("/product-types");
      return response.data as ProductType[];
    },
  });

  // Fetch warehouses
  const { data: warehouses = [] } = useQuery({
    queryKey: ["warehouses"],
    queryFn: async () => {
      const response = await api.get("/warehouses");
      return response.data;
    },
  });

  // Filter products
  let filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.skuCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedFlowState !== "all") {
    filteredProducts = filteredProducts.filter(
      (p) => p.flowState === selectedFlowState
    );
  }

  if (selectedProductType !== "all") {
    filteredProducts = filteredProducts.filter(
      (p) => p.productTypeId === selectedProductType
    );
  }

  // Calculate statistics
  const stats = {
    total: products.length,
    readyIn: products.filter((p) => p.flowState === ProductFlowState.READY_IN)
      .length,
    readyOut: products.filter((p) => p.flowState === ProductFlowState.READY_OUT)
      .length,
    blocked: products.filter((p) => p.flowState === ProductFlowState.BLOCKED)
      .length,
    productTypes: productTypes.length,
  };

  const handleViewProduct = async (product: Product) => {
    try {
      const response = await api.get(`/products/${product._id}`);
      setViewingProduct(response.data);
    } catch (error) {
      console.error("Error fetching product details:", error);
      setViewingProduct(product);
    }
  };

  return (
    <div className="p-6  mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            📦 Danh sách sản phẩm
          </h1>
          <p className="text-default-500 mt-1">
            Xem thông tin và trạng thái sản phẩm trong hệ thống
          </p>
        </div>
      </div>

      {/* Statistics */}
      <ProductStatsCards stats={stats} />

      {/* Main Content */}
      <Card className="border border-divider">
        <CardHeader className="flex flex-col items-start gap-3 pb-0">
          <div className="flex w-full justify-between items-center">
            <Tabs
              selectedKey={viewMode}
              onSelectionChange={(key) => setViewMode(key as "table" | "grid")}
              variant="underlined"
              size="lg"
            >
              <Tab
                key="grid"
                title={
                  <div className="flex items-center gap-2">
                    <span>🎴</span>
                    <span>Lưới</span>
                  </div>
                }
              />
              <Tab
                key="table"
                title={
                  <div className="flex items-center gap-2">
                    <span>📋</span>
                    <span>Bảng</span>
                  </div>
                }
              />
            </Tabs>

            <div className="flex items-center gap-3">
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                startContent={<span>🔍</span>}
                value={searchQuery}
                onValueChange={setSearchQuery}
                className="w-80"
                size="sm"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex w-full gap-3">
            <Select
              label="Trạng thái"
              placeholder="Tất cả trạng thái"
              selectedKeys={selectedFlowState ? [selectedFlowState] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                setSelectedFlowState(selected || "all");
              }}
              className="w-60"
              size="sm"
            >
              <SelectItem key="all" value="all">
                Tất cả trạng thái
              </SelectItem>
              <SelectItem key={ProductFlowState.READY_IN}>
                🟢 Sẵn sàng nhập
              </SelectItem>
              <SelectItem key={ProductFlowState.READY_OUT}>
                🔵 Sẵn sàng xuất
              </SelectItem>
              <SelectItem key={ProductFlowState.BLOCKED}>
                🔴 Bị khóa
              </SelectItem>
            </Select>

            <Select
              label="Loại sản phẩm"
              placeholder="Tất cả loại"
              selectedKeys={selectedProductType ? [selectedProductType] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                setSelectedProductType(selected || "all");
              }}
              className="w-60"
              size="sm"
            >
              <SelectItem key="all" value="all">
                Tất cả loại
              </SelectItem>
              {productTypes.map((type) => (
                <SelectItem key={type._id} value={type._id}>
                  {type.name}
                </SelectItem>
              ))}
            </Select>
          </div>
        </CardHeader>
        <CardBody>
          {viewMode === "table" ? (
            <ProductsTable
              products={filteredProducts}
              productTypes={productTypes}
              isLoading={productsLoading}
              onView={handleViewProduct}
            />
          ) : (
            <ProductsGrid
              products={filteredProducts}
              productTypes={productTypes}
              isLoading={productsLoading}
              onView={handleViewProduct}
            />
          )}
        </CardBody>
      </Card>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={viewingProduct}
        productTypes={productTypes}
        warehouses={warehouses}
        onClose={() => setViewingProduct(null)}
      />
    </div>
  );
}