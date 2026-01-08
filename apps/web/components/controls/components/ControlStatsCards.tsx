import { Card, CardBody } from "@heroui/react";

interface ControlStatsCardsProps {
  stats: {
    totalDevices: number;
    totalSubDevices: number;
    activeSubDevices: number;
    inactiveSubDevices: number;
    activeDevices: number;
  };
}

export default function ControlStatsCards({ stats }: ControlStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <Card className="border border-divider">
        <CardBody className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">🔌</span>
            <p className="text-sm text-default-500">Thiết bị chính</p>
          </div>
          <p className="text-3xl font-bold text-primary">{stats.totalDevices}</p>
        </CardBody>
      </Card>

      <Card className="border border-divider">
        <CardBody className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">⚙️</span>
            <p className="text-sm text-default-500">Thiết bị con</p>
          </div>
          <p className="text-3xl font-bold text-secondary">
            {stats.totalSubDevices}
          </p>
        </CardBody>
      </Card>

      <Card className="border border-divider">
        <CardBody className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">✅</span>
            <p className="text-sm text-default-500">Đang bật</p>
          </div>
          <p className="text-3xl font-bold text-success">
            {stats.activeSubDevices}
          </p>
        </CardBody>
      </Card>

      <Card className="border border-divider">
        <CardBody className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">⭕</span>
            <p className="text-sm text-default-500">Đang tắt</p>
          </div>
          <p className="text-3xl font-bold text-default-500">
            {stats.inactiveSubDevices}
          </p>
        </CardBody>
      </Card>

      <Card className="border border-divider">
        <CardBody className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">🟢</span>
            <p className="text-sm text-default-500">TB hoạt động</p>
          </div>
          <p className="text-3xl font-bold text-success">{stats.activeDevices}</p>
        </CardBody>
      </Card>
    </div>
  );
}