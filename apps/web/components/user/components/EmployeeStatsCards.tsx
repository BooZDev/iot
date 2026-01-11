import { Card, CardBody } from "@heroui/react";

interface EmployeeStatsCardsProps {
  stats: {
    total: number;
    admin: number;
    manager: number;
    staff: number;
    active: number;
  };
}

export default function EmployeeStatsCards({ stats }: EmployeeStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <Card className="border border-divider bg-gradient-to-br from-primary-50 to-primary-100">
        <CardBody className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-100 rounded-xl">
              <span className="text-3xl">👥</span>
            </div>
            <div>
              <p className="text-sm text-default-600 font-medium">
                Tổng nhân viên
              </p>
              <p className="text-3xl font-bold text-primary">{stats.total}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="border border-divider bg-gradient-to-br from-danger-50 to-danger-100">
        <CardBody className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-danger-100 rounded-xl">
              <span className="text-3xl">👑</span>
            </div>
            <div>
              <p className="text-sm text-default-600 font-medium">Admin</p>
              <p className="text-3xl font-bold text-danger">{stats.admin}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="border border-divider bg-gradient-to-br from-warning-50 to-warning-100">
        <CardBody className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-warning-100 rounded-xl">
              <span className="text-3xl">⭐</span>
            </div>
            <div>
              <p className="text-sm text-default-600 font-medium">Manager</p>
              <p className="text-3xl font-bold text-warning">{stats.manager}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="border border-divider bg-gradient-to-br from-success-50 to-success-100">
        <CardBody className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-success-100 rounded-xl">
              <span className="text-3xl">🧑‍💼</span>
            </div>
            <div>
              <p className="text-sm text-default-600 font-medium">Staff</p>
              <p className="text-3xl font-bold text-success">{stats.staff}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="border border-divider bg-gradient-to-br from-secondary-50 to-secondary-100">
        <CardBody className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-secondary-100 rounded-xl">
              <span className="text-3xl">✅</span>
            </div>
            <div>
              <p className="text-sm text-default-600 font-medium">Đang làm việc</p>
              <p className="text-3xl font-bold text-secondary">{stats.active}</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}