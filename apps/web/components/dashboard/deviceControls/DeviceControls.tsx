"use client";

import { useState } from "react";
import { Card, CardHeader, CardBody, Switch, Tooltip, Chip } from "@heroui/react";
import { motion } from "framer-motion";

interface Device {
  id: string;
  name: string;
  icon: string;
  isActive: boolean;
  status: "Hoạt động" | "Không hoạt động" | "Bảo trì";
  location: string;
  powerUsage: number;
}

export default function DeviceControls() {
  // Mock devices data
  const [devices, setDevices] = useState<Device[]>([
    {
      id: "fan-01",
      name: "Quạt thông gió",
      icon: "fan",
      isActive: true,
      status: "Hoạt động",
      location: "Khu A",
      powerUsage: 120,
    },
    {
      id: "pump-01",
      name: "Máy lạnh",
      icon: "droplet",
      isActive: true,
      status: "Hoạt động",
      location: "Khu A",
      powerUsage: 85,
    },
    {
      id: "light-01",
      name: "Máy sưởi",
      icon: "lightbulb",
      isActive: true,
      status: "Hoạt động",
      location: "Khu C",
      powerUsage: 210,
    },
    {
      id: "humidifier-01",
      name: "Máy tạo ẩm",
      icon: "cloud",
      isActive: false,
      status: "Bảo trì",
      location: "Khu A",
      powerUsage: 0,
    },
    {
      id: "dehumidifier-01",
      name: "Máy hút ẩm",
      icon: "cloud-off",
      isActive: false,
      status: "Hoạt động",
      location: "Khu D",
      powerUsage: 0,
    },
  ]);

  const toggleDevice = (id: string) => {
    setDevices(
      devices.map((device) =>
        device.id === id && device.status !== "Bảo trì"
          ? { ...device, isActive: !device.isActive, powerUsage: device.isActive ? 0 : Math.round(Math.random() * 100) + 50 }
          : device
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Hoạt động":
        return "success";
      case "Không hoạt động":
        return "danger";
      case "Bảo trì":
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
        <Chip color="primary" variant="flat" size="sm">
          {devices.filter((d) => d.isActive).length} Active
        </Chip>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {devices.map((device) => (
            <motion.div
              key={device.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-between p-3 rounded-medium bg-content2 dark:bg-content2"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-md ${device.isActive ? "bg-primary/10 text-primary" : "bg-default-100 text-default-500"}`}>
                  {/* <Icon icon={`lucide:${device.icon}`} width={20} /> */}
                </div>
                <div>
                  <p className="font-medium">{device.name}</p>
                  <div className="flex items-center gap-2 text-xs text-default-500">
                    <span>{device.location}</span>
                    <span>•</span>
                    <Chip
                      size="sm"
                      variant="flat"
                      color={getStatusColor(device.status)}
                      className="h-5 px-1"
                    >
                      {device.status}
                    </Chip>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {device.isActive && (
                  <span className="text-xs text-default-500">
                    {device.powerUsage}W
                  </span>
                )}
                <Tooltip content={device.status === "Bảo trì" ? "Device under maintenance" : device.isActive ? "Tắt" : "Bật"}>
                  <Switch
                    size="sm"
                    color="primary"
                    isSelected={device.isActive}
                    isDisabled={device.status === "Bảo trì"}
                    onValueChange={() => toggleDevice(device.id)}
                  />
                </Tooltip>
              </div>
            </motion.div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};