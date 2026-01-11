import { Card, CardBody } from "@heroui/react";

interface TransactionStatsCardsProps {
  stats: {
    totalInbound: number;
    totalOutbound: number;
    readyInProducts: number;
    readyOutProducts: number;
    totalTransactions: number;
  };
}

export default function TransactionStatsCards({
  stats,
}: TransactionStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <Card className="border border-divider bg-gradient-to-br from-success-50 to-success-100">
        <CardBody className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-success-100 rounded-xl">
              <span className="text-3xl">📥</span>
            </div>
            <div>
              <p className="text-sm text-default-600 font-medium">
                Giao dịch nhập
              </p>
              <p className="text-3xl font-bold text-success">
                {stats.totalInbound}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="border border-divider bg-gradient-to-br from-secondary-50 to-secondary-100">
        <CardBody className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-secondary-100 rounded-xl">
              <span className="text-3xl">📤</span>
            </div>
            <div>
              <p className="text-sm text-default-600 font-medium">
                Giao dịch xuất
              </p>
              <p className="text-3xl font-bold text-secondary">
                {stats.totalOutbound}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="border border-divider bg-gradient-to-br from-warning-50 to-warning-100">
        <CardBody className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-warning-100 rounded-xl">
              <span className="text-3xl">🟢</span>
            </div>
            <div>
              <p className="text-sm text-default-600 font-medium">
                SP sẵn sàng nhập
              </p>
              <p className="text-3xl font-bold text-warning">
                {stats.readyInProducts}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="border border-divider bg-gradient-to-br from-primary-50 to-primary-100">
        <CardBody className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-100 rounded-xl">
              <span className="text-3xl">🔵</span>
            </div>
            <div>
              <p className="text-sm text-default-600 font-medium">
                SP sẵn sàng xuất
              </p>
              <p className="text-3xl font-bold text-primary">
                {stats.readyOutProducts}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="border border-divider bg-gradient-to-br from-danger-50 to-danger-100">
        <CardBody className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-danger-100 rounded-xl">
              <span className="text-3xl">📊</span>
            </div>
            <div>
              <p className="text-sm text-default-600 font-medium">
                Tổng giao dịch
              </p>
              <p className="text-3xl font-bold text-danger">
                {stats.totalTransactions}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}