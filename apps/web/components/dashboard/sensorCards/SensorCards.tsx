"use client";

import { Card, CardBody, Progress } from "@heroui/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { io } from "socket.io-client";
import { FaTemperatureHigh } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";
import { GiSmokingOrb } from "react-icons/gi";
import { MdOutlineWbTwilight } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import api from "../../../libs/api";
import { useSocket } from "../../../context/SocketContext";

interface Threshold {
  temp_lo: number;
  temp_hi: number;
  hum_lo: number;
  hum_hi: number;
  gas_hi: number;
  light_lo: number;
  light_hi: number;
}

export default function SensorCards({ params }: { params?: { warehouseId: string } }) {
  const { socket, joinRoom } = useSocket();
  const [data, setData] = useState<{
    temp: number;
    hum: number;
    gasLever: number;
    lightCurrent: number;
  }>({ temp: 0, hum: 0, gasLever: 0, lightCurrent: 0 });

  const [threshold, setThreshold] = useState<Threshold>({
    temp_lo: -99,
    temp_hi: 200,
    hum_lo: -1,
    hum_hi: 101,
    gas_hi: 1000,
    light_lo: -100,
    light_hi: 3000,
  });

  const warehouseId = params?.warehouseId || usePathname().split("/")[2];

  useQuery({
    queryKey: ['environmentalData'],
    queryFn: async () => {
      const response = await api.get(`/data/${warehouseId}/latest`);

      if (!response.data) { return }
      setData(response.data.data);
      return response.data;
    },
  })

  useQuery({
    queryKey: ['thresholds', warehouseId],
    queryFn: async () => {
      const response = await api.get(`/threshold/${warehouseId}`);

      if (!response.data) { return }
      setThreshold(response.data.thresholds);
      return response.data;
    },
  })

  useEffect(() => {
    if (!socket) return;

    socket.on("environmentalData", (msg) => {
      setData(msg);
    });

    return () => {
      socket.off("environmentalData");
    };
  }, [socket]);

  // Helper functions to check status
  const getTempStatus = () => {
    if (threshold.temp_lo === -99 && threshold.temp_hi === 200) return "success";
    if (data.temp < threshold.temp_lo || data.temp > threshold.temp_hi) return "danger";
    return "success";
  };

  const getHumStatus = () => {
    if (threshold.hum_lo === -1 && threshold.hum_hi === 101) return "success";
    if (data.hum < threshold.hum_lo || data.hum > threshold.hum_hi) return "danger";
    return "success";
  };

  const getGasStatus = () => {
    if (threshold.gas_hi === 1000) return "success";
    if (data.gasLever > threshold.gas_hi) return "danger";
    return "success";
  };

  const getLightStatus = () => {
    if (threshold.light_lo === -100 && threshold.light_hi === 3000) return "success";
    if (data.lightCurrent < threshold.light_lo || data.lightCurrent > threshold.light_hi) return "danger";
    return "success";
  };

  const getStatusLabel = (status: string) => {
    return status === "success" ? "Normal" : "Attention";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Temperature Card */}
      <Card className="border border-divider">
        <CardBody className="flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className={`p-2 rounded-md bg-primary-100 dark:bg-primary-900/20`}
              >
                <FaTemperatureHigh className="text-primary-500" size={24} />
              </div>
              <h3 className="text-lg font-medium">Nhiệt độ</h3>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-full bg-${getTempStatus()}-100 text-${getTempStatus()}-500 dark:bg-${getTempStatus()}-900/20`}
            >
              {getStatusLabel(getTempStatus())}
            </span>
          </div>

          <div className="flex items-end gap-2 mb-3">
            <motion.span
              key={data.temp}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-semibold"
            >
              {data.temp}
            </motion.span>
            <span className="text-default-500">°C</span>
          </div>

          <Progress
            aria-label={`Temperature level`}
            value={(data.temp / 50) * 100}
            color={getTempStatus() as "success" | "warning" | "danger"}
            className="h-1.5"
          />

          {threshold.temp_lo !== -99 && threshold.temp_hi !== 200 && (
            <p className="text-xs text-default-500 mt-2">
              Ngưỡng: {threshold.temp_lo}°C - {threshold.temp_hi}°C
            </p>
          )}
        </CardBody>
      </Card>

      {/* Humidity Card */}
      <Card className="border border-divider">
        <CardBody>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className={`p-2 rounded-md bg-secondary-100 dark:bg-secondary-900/20`}
              >
                <WiHumidity className="text-secondary-500" size={24} />
              </div>
              <h3 className="text-lg font-medium">Độ ẩm</h3>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-full bg-${getHumStatus()}-100 text-${getHumStatus()}-500 dark:bg-${getHumStatus()}-900/20`}
            >
              {getStatusLabel(getHumStatus())}
            </span>
          </div>

          <div className="flex items-end gap-2 mb-3">
            <motion.span
              key={data.hum}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-semibold"
            >
              {data.hum}
            </motion.span>
            <span className="text-default-500">%</span>
          </div>

          <Progress
            aria-label={`Độ ẩm`}
            value={data.hum}
            color={getHumStatus() as "success" | "warning" | "danger"}
            className="h-1.5"
          />

          {threshold.hum_lo !== -1 && threshold.hum_hi !== 101 && (
            <p className="text-xs text-default-500 mt-2">
              Ngưỡng: {threshold.hum_lo}% - {threshold.hum_hi}%
            </p>
          )}
        </CardBody>
      </Card>

      {/* Gas Card */}
      <Card className="border border-divider">
        <CardBody>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className={`p-2 rounded-md bg-success-100 dark:bg-success-900/20`}
              >
                <GiSmokingOrb className="text-success-500" size={24} />
              </div>
              <h3 className="text-lg font-medium">Nồng độ khí Gas/Khói</h3>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-full bg-${getGasStatus()}-100 text-${getGasStatus()}-500 dark:bg-${getGasStatus()}-900/20`}
            >
              {getStatusLabel(getGasStatus())}
            </span>
          </div>

          <div className="flex items-end gap-2 mb-3">
            <motion.span
              key={data.gasLever}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-semibold"
            >
              {data.gasLever}
            </motion.span>
            <span className="text-default-500">ppm</span>
          </div>

          <Progress
            aria-label={`Nồng độ khí Gas/Khói`}
            value={(data.gasLever / 5000) * 100}
            color={getGasStatus() as "success" | "warning" | "danger"}
            className="h-1.5"
          />

          {threshold.gas_hi !== 1000 && (
            <p className="text-xs text-default-500 mt-2">
              Ngưỡng tối đa: {threshold.gas_hi} ppm
            </p>
          )}
        </CardBody>
      </Card>

      {/* Light Card */}
      <Card className="border border-divider">
        <CardBody>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className={`p-2 rounded-md bg-warning-100 dark:bg-warning-900/20`}
              >
                <MdOutlineWbTwilight className="text-warning-500" size={24} />
              </div>
              <h3 className="text-lg font-medium">Cường độ ánh sáng</h3>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-full bg-${getLightStatus()}-100 text-${getLightStatus()}-500 dark:bg-${getLightStatus()}-900/20`}
            >
              {getStatusLabel(getLightStatus())}
            </span>
          </div>

          <div className="flex items-end gap-2 mb-3">
            <motion.span
              key={data.lightCurrent}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-semibold"
            >
              {data.lightCurrent.toFixed(2)}
            </motion.span>
            <span className="text-default-500">lux</span>
          </div>

          <Progress
            aria-label={`Cường độ ánh sáng`}
            value={(data.lightCurrent / 2000) * 100}
            color={getLightStatus() as "success" | "warning" | "danger"}
            className="h-1.5"
          />

          {threshold.light_lo !== -100 && threshold.light_hi !== 3000 && (
            <p className="text-xs text-default-500 mt-2">
              Ngưỡng: {threshold.light_lo} - {threshold.light_hi} lux
            </p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}