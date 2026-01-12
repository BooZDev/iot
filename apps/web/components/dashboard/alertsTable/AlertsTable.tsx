"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Pagination,
  Button,
} from "@heroui/react";
import { useSocket } from "../../../context/SocketContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../libs/api";
import { usePathname } from "next/navigation";

interface Alert {
  _id: string;
  level: "info" | "warning" | "critical";
  reason: string;
  value: number;
  status: "new" | "acknowledged" | "resolved";
  warehouseId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function AlertsTable({ params }: { params?: { warehouseId: string } }) {
  const { socket } = useSocket();
  const warehouseId = params?.warehouseId || usePathname().split("/")[2];
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  // Fetch alerts from API
  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['alerts', warehouseId],
    queryFn: async () => {
      const response = await api.get(`/alerts/${warehouseId}`);
      return response.data || [];
    }
  });

  // Mutation to update alert status
  const updateAlertMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "acknowledged" | "resolved" }) => {
      const response = await api.patch(`/alerts/${id}`, { status });
      return response.data;
    },
    onSuccess: () => {
      // Refetch alerts after successful update
      queryClient.invalidateQueries({ queryKey: ['alerts', warehouseId] });
    },
  });

  // Listen for new alerts from socket
  useEffect(() => {
    if (!socket) return;

    socket.on("alert", (alert: Alert) => {
      // Only add alert if it belongs to current warehouse
      if (alert.warehouseId === warehouseId) {
        console.log("Received alert:", alert);
        queryClient.invalidateQueries({ queryKey: ['alerts', warehouseId] });
      }
    });

    return () => {
      socket.off("alert");
    };
  }, [socket, warehouseId, queryClient]);

  // Calculate pagination
  const pages = Math.ceil(alerts.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return alerts.slice(start, end);
  }, [page, alerts]);

  // Update alert status
  const updateAlertStatus = (id: string, status: "acknowledged" | "resolved") => {
    updateAlertMutation.mutate({ id, status });
  };

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 1) return "Vừa xong";
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ngày trước`;
  };

  // Get level color
  const getLevelColor = (level: string) => {
    switch (level) {
      case "critical":
        return "danger";
      case "warning":
        return "warning";
      case "info":
        return "primary";
      default:
        return "default";
    }
  };

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

  // Get sensor type in Vietnamese
  const getSensorType = (reason: string) => {
    const reasonUpper = reason.toUpperCase();

    if (reasonUpper.includes("TEMP")) return "Cảm biến nhiệt độ";
    if (reasonUpper.includes("LIGHT")) return "Cảm biến ánh sáng";
    if (reasonUpper.includes("HUMID") || reasonUpper.includes("HUM")) return "Cảm biến độ ẩm";
    if (reasonUpper.includes("GAS")) return "Cảm biến khí gas";

    return "Hệ thống";
  };

  // Parse alert message to Vietnamese
  const parseAlertMessage = (reason: string) => {
    const reasonUpper = reason.toUpperCase();

    // Temperature alerts
    if (reasonUpper.includes("TEMP_LOW")) {
      return `Nhiệt độ thấp`;
    }
    if (reasonUpper.includes("TEMP_HIGH")) {
      return `Nhiệt độ cao`;
    }

    // Light alerts
    if (reasonUpper.includes("LIGHT_LOW")) {
      return `Ánh sáng thấp`;
    }
    if (reasonUpper.includes("LIGHT_HIGH")) {
      return `Ánh sáng cao`;
    }

    // Humidity alerts
    if (reasonUpper.includes("HUMID_LOW") || reasonUpper.includes("HUM_LOW")) {
      return `Độ ẩm thấp`;
    }
    if (reasonUpper.includes("HUMID_HIGH") || reasonUpper.includes("HUM_HIGH")) {
      return `Độ ẩm cao`;
    }
    // Gas alerts
    if (reasonUpper.includes("GAS_HIGH")) {
      return `Khí gas cao`;
    }

    // Default fallback
    return reason;
  };

  // Get level label in Vietnamese
  const getLevelLabel = (level: string) => {
    switch (level) {
      case "critical":
        return "Nghiêm trọng";
      case "warning":
        return "Cảnh báo";
      case "info":
        return "Thông tin";
      default:
        return level;
    }
  };

  // Get status label in Vietnamese
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "new":
        return "Mới";
      case "acknowledged":
        return "Đã xác nhận";
      case "resolved":
        return "Đã giải quyết";
      default:
        return status;
    }
  };

  return (
    <Card className="border border-divider h-full col-start-1 col-end-4">
      <CardHeader className="flex justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-medium">Cảnh báo gần đây</h2>
          {alerts.length > 0 && (
            <Chip size="sm" color="danger" variant="flat">
              {alerts.filter((a: Alert) => a.status === "new").length} mới
            </Chip>
          )}
        </div>
      </CardHeader>
      <CardBody className="px-0">
        <Table
          aria-label="Bảng cảnh báo hệ thống"
          removeWrapper
          bottomContent={
            pages > 1 ? (
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="secondary"
                  page={page}
                  total={pages}
                  onChange={(page) => setPage(page)}
                />
              </div>
            ) : null
          }
        >
          <TableHeader>
            <TableColumn className="text-md">THÔNG BÁO</TableColumn>
            <TableColumn className="text-md">NGUỒN</TableColumn>
            <TableColumn className="text-md">GIÁ TRỊ</TableColumn>
            <TableColumn className="text-md">THỜI GIAN</TableColumn>
            <TableColumn className="text-md">TRẠNG THÁI</TableColumn>
            <TableColumn className="text-md">HÀNH ĐỘNG</TableColumn>
          </TableHeader>
          <TableBody
            emptyContent={isLoading ? "Đang tải..." : "Không có cảnh báo nào"}
            isLoading={isLoading}
          >
            {items.map((alert: Alert) => (
              <TableRow key={alert._id}>
                <TableCell>
                  <div className="flex items-center justify-between gap-2">
                    <span>{parseAlertMessage(alert.reason)}</span>
                    <Chip
                      size="sm"
                      color={getLevelColor(alert.level)}
                      variant="dot"
                    >
                      {getLevelLabel(alert.level)}
                    </Chip>
                  </div>
                </TableCell>
                <TableCell>{getSensorType(alert.reason)}</TableCell>
                <TableCell>
                  <span className="font-medium">{alert.value}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-default-500">
                    {formatRelativeTime(alert.createdAt)}
                  </span>
                </TableCell>
                <TableCell>
                  <Chip
                    size="sm"
                    color={getStatusColor(alert.status)}
                    variant="flat"
                  >
                    {getStatusLabel(alert.status)}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {alert.status === "new" && (
                      <Button
                        size="sm"
                        variant="light"
                        color="warning"
                        isLoading={updateAlertMutation.isPending}
                        onPress={() =>
                          updateAlertStatus(alert._id, "acknowledged")
                        }
                      >
                        Xác nhận
                      </Button>
                    )}
                    {(alert.status === "new" ||
                      alert.status === "acknowledged") && (
                        <Button
                          size="sm"
                          variant="light"
                          color="success"
                          isLoading={updateAlertMutation.isPending}
                          onPress={() => updateAlertStatus(alert._id, "resolved")}
                        >
                          Giải quyết
                        </Button>
                      )}
                    {alert.status === "resolved" && (
                      <span className="text-xs text-default-500">
                        Không cần hành động
                      </span>
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
}