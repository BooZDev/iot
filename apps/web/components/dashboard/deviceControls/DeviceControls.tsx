"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Switch,
  Tooltip,
  Chip,
  Pagination,
} from "@heroui/react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import api from "../../../libs/api";
import { usePathname } from "next/navigation";

interface Device {
  _id: string;
  name: string;
  status: number;
  state: "active" | "inactive" | "maintenance";
  type: number;
}

export default function DeviceControls({ params }: { params?: { warehouseId: string } }) {
  const [devices, setDevices] = useState<Device[]>([]);

  const warehouseId = params?.warehouseId || usePathname().split("/")[2];

  const diviceQuery = useQuery({
    queryKey: ["devices"],
    queryFn: async () => {
      const response = await api.get(`/warehouses/${warehouseId}/sub-devices`);

      if (!response.data) { return; }
      setDevices(response.data)
      return response.data;
    },
  })

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const pages = Math.ceil(devices.length / rowsPerPage);

  const curentPageDevices = (page: number) => {
    const startIndex = (page - 1) * rowsPerPage;
    return devices.slice(startIndex, startIndex + rowsPerPage);
  };

  const toggleDevice = (id: string) => {
    setDevices(
      devices.map((device) => {
        if (device._id === id && device.state !== "maintenance" && device.state !== "inactive") {
          api.post(`/control/${device._id}`, {
            kind: 1,
            actuator: device.type,
            on: device.status === 1 ? 0 : 1,
          });

          return {
            ...device,
            status: device.status === 1 ? 0 : 1,
          }
        }
        else
          return device
      }
      )
    );
  };

  const getStatusColor = (state: string) => {
    switch (state) {
      case "active":
        return "success";
      case "inactive":
        return "danger";
      case "maintenance":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Card className="border border-divider h-full col-start-1 col-end-3">
      <CardHeader className="flex justify-between">
        <div className="flex items-center gap-2">
          {/* <Icon icon="lucide:cpu" className="text-primary" width={20} /> */}
          <h2 className="text-lg font-medium">Thiết bị hoạt động</h2>
        </div>

        <div className="flex items-center gap-8">
          <Pagination
            isCompact
            showShadow
            color="secondary"
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
            className="text-green-500"
          />

          <Chip color="primary" variant="flat" size="sm">
            {devices.filter((d) => d.state).length} Active
          </Chip>
        </div>
      </CardHeader>
      <CardBody>
        <div className="grid grid-rows-5 gap-3">
          {curentPageDevices(page).map((device) => (
            <motion.div
              key={device._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-between p-3 rounded-medium bg-content2 dark:bg-content2"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-md ${device.status ? "bg-primary/10 text-primary" : "bg-default-100 text-default-500"}`}
                >
                  {/* <Icon icon={`lucide:${device.icon}`} width={20} /> */}
                </div>
                <div>
                  <p className="font-medium">{device.name}</p>
                  <div className="flex items-center gap-2 text-xs text-default-500">
                    <Chip
                      size="sm"
                      variant="flat"
                      color={getStatusColor(device.state)}
                      className="h-5 px-1"
                    >
                      {device.state === "active" ? "Hoạt động" : device.state === "inactive" ? "Ngưng hoạt động" : "Bảo trì"}
                    </Chip>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Tooltip
                  content={
                    device.state === "maintenance"
                      ? "Device under maintenance"
                      : device.status === 1
                        ? "Tắt"
                        : "Bật"
                  }
                >
                  <Switch
                    size="sm"
                    color="primary"
                    isSelected={device.status === 1}
                    isDisabled={device.state === "maintenance"}
                    onValueChange={() => toggleDevice(device._id)}
                  />
                </Tooltip>
              </div>
            </motion.div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
