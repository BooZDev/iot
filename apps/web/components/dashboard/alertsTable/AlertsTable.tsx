"use client";

import { useMemo, useState } from "react";
import { Card, CardHeader, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Pagination, Button } from "@heroui/react";

interface Alert {
  id: string;
  message: string;
  severity: "info" | "warning" | "error";
  source: string;
  timestamp: Date;
  status: "new" | "acknowledged" | "resolved";
}

export default function AlertsTable() {
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  // Mock alerts data
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "alert-001",
      message: "Temperature exceeded threshold in Zone B",
      severity: "warning",
      source: "Temperature Sensor",
      timestamp: new Date(Date.now() - 15 * 60000),
      status: "new",
    },
    {
      id: "alert-002",
      message: "Humidity level dropped below 50% in Zone A",
      severity: "warning",
      source: "Humidity Sensor",
      timestamp: new Date(Date.now() - 45 * 60000),
      status: "acknowledged",
    },
    {
      id: "alert-003",
      message: "Water pump maintenance required",
      severity: "info",
      source: "Water Pump",
      timestamp: new Date(Date.now() - 120 * 60000),
      status: "acknowledged",
    },
    {
      id: "alert-004",
      message: "Power consumption spike detected",
      severity: "warning",
      source: "Energy Monitor",
      timestamp: new Date(Date.now() - 180 * 60000),
      status: "resolved",
    },
    {
      id: "alert-005",
      message: "System update available",
      severity: "info",
      source: "System",
      timestamp: new Date(Date.now() - 240 * 60000),
      status: "new",
    },
    {
      id: "alert-006",
      message: "Network connectivity issues in Zone C",
      severity: "error",
      source: "Network Monitor",
      timestamp: new Date(Date.now() - 300 * 60000),
      status: "acknowledged",
    },
    {
      id: "alert-007",
      message: "Low inventory alert: Chamomile",
      severity: "warning",
      source: "Inventory System",
      timestamp: new Date(Date.now() - 360 * 60000),
      status: "new",
    },
    {
      id: "alert-008",
      message: "Camera motion detection triggered",
      severity: "info",
      source: "AI Camera",
      timestamp: new Date(Date.now() - 420 * 60000),
      status: "resolved",
    },
  ]);

  // Calculate pagination
  const pages = Math.ceil(alerts.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return alerts.slice(start, end);
  }, [page, alerts]);

  // Update alert status
  const updateAlertStatus = (id: string, status: "acknowledged" | "resolved") => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === id ? { ...alert, status } : alert
      )
    );
  };

  // Format relative time
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  // Get severity color
  // const getSeverityColor = (severity: string) => {
  //   switch (severity) {
  //     case "error":
  //       return "danger";
  //     case "warning":
  //       return "warning";
  //     case "info":
  //       return "primary";
  //     default:
  //       return "default";
  //   }
  // };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "danger";
      case "acknowledged":
        return "warning";
      case "resolved":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <Card className="border border-divider h-full col-start-1 col-end-4">
      <CardHeader className="flex justify-between">
        <div className="flex items-center gap-2">
          {/* <Icon icon="lucide:bell" className="text-primary" width={20} /> */}
          <h2 className="text-lg font-medium">Recent Alerts</h2>
        </div>
        <Button
          size="sm"
          variant="flat"
          color="primary"
        // startContent={<Icon icon="lucide:filter" width={16} />}
        >
          Filter
        </Button>
      </CardHeader>
      <CardBody className="px-0">
        <Table
          aria-label="Alerts and system logs"
          removeWrapper
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="secondary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
                className="text-green-500"
              />
            </div>
          }
        >
          <TableHeader>
            <TableColumn>MESSAGE</TableColumn>
            <TableColumn>SOURCE</TableColumn>
            <TableColumn>TIME</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody>
            {items.map((alert) => (
              <TableRow key={alert.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {/* <Icon
                      icon={
                        alert.severity === "error" ? "lucide:alert-circle" :
                          alert.severity === "warning" ? "lucide:alert-triangle" :
                            "lucide:info"
                      }
                      className={`text-${getSeverityColor(alert.severity)}`}
                      width={16}
                    /> */}
                    <span>{alert.message}</span>
                  </div>
                </TableCell>
                <TableCell>{alert.source}</TableCell>
                <TableCell>{formatRelativeTime(alert.timestamp)}</TableCell>
                <TableCell>
                  <Chip
                    size="sm"
                    color={getStatusColor(alert.status)}
                    variant="flat"
                  >
                    {alert.status}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {alert.status === "new" && (
                      <Button
                        size="sm"
                        variant="light"
                        color="warning"
                        onPress={() => updateAlertStatus(alert.id, "acknowledged")}
                      >
                        Acknowledge
                      </Button>
                    )}
                    {(alert.status === "new" || alert.status === "acknowledged") && (
                      <Button
                        size="sm"
                        variant="light"
                        color="success"
                        onPress={() => updateAlertStatus(alert.id, "resolved")}
                      >
                        Resolve
                      </Button>
                    )}
                    {alert.status === "resolved" && (
                      <span className="text-xs text-default-500">No action needed</span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
};