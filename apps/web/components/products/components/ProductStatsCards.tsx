import { Card, CardBody } from "@heroui/react";

interface ProductStatsCardsProps {
  stats: {
    total: number;
    readyIn: number;
    readyOut: number;
    blocked: number;
    productTypes: number;
  };
}

export default function ProductStatsCards({ stats }: ProductStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <Card className="border border-divider bg-linear-to-br from-primary-50 to-primary-100">
        <CardBody className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-100 rounded-xl">
              <span className="text-3xl">📦</span>
            </div>
            <div>
              <p className="text-sm text-default-600 font-medium">
                Tổng sản phẩm
              </p>
              <p className="text-3xl font-bold text-primary">{stats.total}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="border border-divider bg-linear-to-br from-success-50 to-success-100">
        <CardBody className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-success-100 rounded-xl">
              <span className="text-3xl">🟢</span>
            </div>
            <div>
              <p className="text-sm text-default-600 font-medium">Sẵn sàng nhập</p>
              <p className="text-3xl font-bold text-success">{stats.readyIn}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="border border-divider bg-linear-to-br from-secondary-50 to-secondary-100">
        <CardBody className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-secondary-100 rounded-xl">
              <span className="text-3xl">🔵</span>
            </div>
            <div>
              <p className="text-sm text-default-600 font-medium">Sẵn sàng xuất</p>
              <p className="text-3xl font-bold text-secondary">{stats.readyOut}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="border border-divider bg-linear-to-br from-danger-50 to-danger-100">
        <CardBody className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-danger-100 rounded-xl">
              <span className="text-3xl">🔴</span>
            </div>
            <div>
              <p className="text-sm text-default-600 font-medium">Bị khóa</p>
              <p className="text-3xl font-bold text-danger">{stats.blocked}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="border border-divider bg-linear-to-br from-warning-50 to-warning-100">
        <CardBody className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-warning-100 rounded-xl">
              <span className="text-3xl">🏷️</span>
            </div>
            <div>
              <p className="text-sm text-default-600 font-medium">Loại SP</p>
              <p className="text-3xl font-bold text-warning">
                {stats.productTypes}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}