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
  Image,
} from "@heroui/react";
import { Warehouse } from "../Warehousespage";

interface WarehouseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  warehouse: Warehouse | null;
  onEdit: () => void;
}

export default function WarehouseDetailModal({
  isOpen,
  onClose,
  warehouse,
  onEdit,
}: WarehouseDetailModalProps) {
  if (!warehouse) return null;

  const hasLocations = warehouse.locations && warehouse.locations.length > 0;
  const isActive = warehouse.isActive !== false;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader>
          <h3 className="text-xl font-bold">🏭 Chi tiết nhà kho</h3>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            {/* Warehouse Header */}
            <Card className="bg-gradient-to-br from-primary-50 to-primary-100 border-none">
              <CardBody className="p-6">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-6xl">🏭</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">
                      {warehouse.name}
                    </h2>
                    <div className="flex gap-2 flex-wrap">
                      <Chip size="lg" variant="solid" color="secondary">
                        {warehouse.type}
                      </Chip>
                      {isActive ? (
                        <Chip size="lg" variant="solid" color="success">
                          ✅ Hoạt động
                        </Chip>
                      ) : (
                        <Chip size="lg" variant="solid" color="danger">
                          ❌ Ngừng hoạt động
                        </Chip>
                      )}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Information Cards */}
            <div className="grid grid-cols-1 gap-4">
              {/* Basic Info */}
              <Card className="border border-divider">
                <CardBody className="p-4">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <span>📋</span>
                    <span>Thông tin cơ bản</span>
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-default-500 mb-1">Tên</p>
                      <p className="font-medium text-sm">{warehouse.name}</p>
                    </div>
                    <Divider />
                    <div>
                      <p className="text-xs text-default-500 mb-1">Loại</p>
                      <p className="text-sm">{warehouse.type}</p>
                    </div>
                    <Divider />
                    <div>
                      <p className="text-xs text-default-500 mb-1">Địa chỉ</p>
                      <p className="text-sm">{warehouse.address}</p>
                    </div>
                    {warehouse.description && (
                      <>
                        <Divider />
                        <div>
                          <p className="text-xs text-default-500 mb-1">Mô tả</p>
                          <p className="text-sm">{warehouse.description}</p>
                        </div>
                      </>
                    )}
                  </div>
                </CardBody>
              </Card>

              {/* Coordinates Info */}
              <Card className="border border-divider">
                <CardBody className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold flex items-center gap-2">
                      <span>📍</span>
                      <span>Tọa độ bản đồ</span>
                    </h3>
                  </div>

                  {hasLocations ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-success-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-semibold text-success-700">
                            ✅ Đã có tọa độ polygon
                          </p>
                          <Chip size="sm" color="success" variant="flat">
                            {warehouse.locations!.length} điểm
                          </Chip>
                        </div>
                        <p className="text-xs text-success-600">
                          Nhà kho đã được vẽ trên bản đồ với{" "}
                          {warehouse.locations!.length} tọa độ
                        </p>
                      </div>

                      {/* Show first and last coordinates as sample */}
                      <div className="p-3 bg-default-50 rounded-lg">
                        <p className="text-xs text-default-600 mb-2 font-semibold">
                          Tọa độ mẫu:
                        </p>
                        <div className="space-y-1">
                          <p className="text-xs font-mono text-default-700">
                            Điểm 1: [{warehouse.locations?.[0]?.[0]?.toFixed(6) || "N/A"}, {" "}
                            {warehouse.locations?.[0]?.[1]?.toFixed(6) || "N/A"}]
                          </p>
                          {warehouse.locations!.length > 1 && (
                            <p className="text-xs font-mono text-default-700">
                              Điểm {warehouse.locations!.length}: [
                              {warehouse.locations &&
                                warehouse.locations.length > 0 &&
                                warehouse.locations[warehouse.locations.length - 1]?.[0]?.toFixed(6)}
                              ,{" "}
                              {warehouse.locations?.[
                                warehouse.locations.length - 1
                              ]?.[1]?.toFixed(6) || "N/A"}
                              ]
                            </p>
                          )}
                        </div>
                      </div>

                      <Card className="bg-primary-50 border-none">
                        <CardBody className="p-3">
                          <p className="text-xs text-primary-700">
                            💡 Để xem và chỉnh sửa tọa độ đầy đủ, vui lòng truy
                            cập trang{" "}
                            <strong>"Bản đồ nhà kho"</strong>
                          </p>
                        </CardBody>
                      </Card>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-4 bg-warning-50 rounded-lg text-center">
                        <p className="text-sm text-warning-700 font-semibold">
                          ⚠️ Chưa có tọa độ bản đồ
                        </p>
                        <p className="text-xs text-warning-600 mt-1">
                          Nhà kho chưa được vẽ trên bản đồ
                        </p>
                      </div>

                      <Card className="bg-primary-50 border-none">
                        <CardBody className="p-3">
                          <p className="text-xs text-primary-700">
                            💡 Để thêm tọa độ cho nhà kho, vui lòng truy cập
                            trang <strong>"Bản đồ nhà kho"</strong> và vẽ
                            polygon cho nhà kho này.
                          </p>
                        </CardBody>
                      </Card>
                    </div>
                  )}
                </CardBody>
              </Card>

              {/* Image */}
              {warehouse.imageUrl && (
                <Card className="border border-divider">
                  <CardBody className="p-4">
                    <h3 className="font-bold mb-3 flex items-center gap-2">
                      <span>🖼️</span>
                      <span>Hình ảnh</span>
                    </h3>
                    <Image
                      src={warehouse.imageUrl}
                      alt={warehouse.name}
                      className="w-full rounded-lg"
                      onError={() => {
                        (document.querySelector('img[src="' + warehouse.imageUrl + '"]') as HTMLImageElement).src =
                          "https://via.placeholder.com/400x300?text=Image+Not+Found";
                      }}
                    />
                  </CardBody>
                </Card>
              )}
            </div>

            {/* System Info */}
            {warehouse.createdAt && (
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
                        {new Date(warehouse.createdAt).toLocaleString("vi-VN")}
                      </p>
                    </div>
                    {warehouse.updatedAt && (
                      <div>
                        <p className="mb-1">Cập nhật lần cuối</p>
                        <p className="text-default-700">
                          {new Date(warehouse.updatedAt).toLocaleString(
                            "vi-VN"
                          )}
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
          <Button color="primary" onPress={onEdit}>
            ✏️ Chỉnh sửa
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}