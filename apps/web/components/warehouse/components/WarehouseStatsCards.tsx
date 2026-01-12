import { Card, CardBody } from "@heroui/react";

interface WarehouseStatsCardsProps {
  stats: {
    total: number;
    withLocations: number;
    withoutLocations: number;
    active: number;
  };
}

export default function WarehouseStatsCards({
  stats,
}: WarehouseStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="border border-divider bg-gradient-to-br from-primary-50 to-primary-100">
        <CardBody className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-100 rounded-xl">
              <span className="text-3xl">🏭</span>
            </div>
            <div>
              <p className="text-sm text-default-600 font-medium">
                Tổng nhà kho
              </p>
              <p className="text-3xl font-bold text-primary">{stats.total}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="border border-divider bg-gradient-to-br from-success-50 to-success-100">
        <CardBody className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-success-100 rounded-xl">
              <span className="text-3xl">✅</span>
            </div>
            <div>
              <p className="text-sm text-default-600 font-medium">
                Đang hoạt động
              </p>
              <p className="text-3xl font-bold text-success">{stats.active}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="border border-divider bg-gradient-to-br from-secondary-50 to-secondary-100">
        <CardBody className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-secondary-100 rounded-xl">
              <span className="text-3xl">📍</span>
            </div>
            <div>
              <p className="text-sm text-default-600 font-medium">
                Có tọa độ bản đồ
              </p>
              <p className="text-3xl font-bold text-secondary">
                {stats.withLocations}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="border border-divider bg-gradient-to-br from-warning-50 to-warning-100">
        <CardBody className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-warning-100 rounded-xl">
              <span className="text-3xl">⚠️</span>
            </div>
            <div>
              <p className="text-sm text-default-600 font-medium">
                Chưa có tọa độ
              </p>
              <p className="text-3xl font-bold text-warning">
                {stats.withoutLocations}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}